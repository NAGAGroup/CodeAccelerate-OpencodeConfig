import type { Plugin } from "@opencode-ai/plugin";

/**
 * TechLeadGuardrailsPlugin - Enforces role boundaries for all agents with special rules for tech_lead
 * 
 * Features:
 * 1. UNIVERSAL: Mandatory todolists before ANY work (all agents)
 * 2. UNIVERSAL: Completion checkpoint when all todos marked complete (all agents)
 * 3. UNIVERSAL: Auto-reset todolist requirement after completion (all agents)
 * 4. TECH_LEAD ONLY: Todo content analysis with meta-reflection (detect anti-patterns)
 * 5. TECH_LEAD ONLY: Markdown-only editing enforcement
 * 6. TECH_LEAD ONLY: Skill-loading enforcement before delegation
 * 7. TECH_LEAD ONLY: Infinite reflection loop prevention (one reflection per pattern per todolist)
 */
export const TechLeadGuardrailsPlugin: Plugin = async ({ client }) => {
  // Track loaded skills per session
  const loadedSkills = new Map<string, Set<string>>();
  
  // Track current agent per session
  const sessionAgents = new Map<string, string>();
  
  // Track todolist state per session
  interface TodolistState {
    exists: boolean;
    allComplete: boolean;
    lastTodos: any[];
  }
  const sessionTodolist = new Map<string, TodolistState>();
  
  // Track which reflection patterns have been triggered per session
  // This prevents infinite reflection loops when agent updates todolist
  type ReflectionPattern = 'implementation' | 'no-delegation' | 'parallel' | 'large-list';
  const sessionReflections = new Map<string, Set<ReflectionPattern>>();

  // Helper: Inject reflection prompt that agent will see after completing current response
  // Uses synthetic: true so the agent sees it but the user doesn't (cleaner UX)
  // Uses noReply: true to queue the message rather than interrupt current response
  // CRITICAL: agentName parameter preserves agent context - without it, session defaults to tech_lead!
  // NOTE: Call this WITHOUT await in hooks to avoid blocking tool completion
  async function injectReflection(sessionID: string, message: string, agentName?: string) {
    try {
      await client.session.prompt({
        path: { id: sessionID },
        body: {
          noReply: true,  // Queue for later - agent sees after completing current response
          ...(agentName ? { agent: agentName } : {}), // Preserve agent context
          parts: [
            { 
              type: "text", 
              text: message,
              synthetic: true  // Agent sees it, user doesn't - cleaner UX
            }
          ],
        },
      });
    } catch (error) {
      // Silently fail - don't pollute TUI
    }
  }

  // Helper: Guide agent with synthetic prompt instead of hard error
  // Injects guidance then throws minimal error to stop tool execution
  // CRITICAL: agentName parameter preserves agent context - without it, session defaults to tech_lead!
  async function guideThenBlock(sessionID: string, guidance: string, agentName?: string) {
    // Inject guidance for agent to see
    await injectReflection(sessionID, guidance, agentName);
    // Throw minimal error to stop tool execution (user won't see this)
    throw new Error("Tool execution blocked by guardrail");
  }

  // Helper: Check if all todos are complete
  function areAllTodosComplete(todos: any[]): boolean {
    return todos.length > 0 && todos.every(t => 
      t.status === 'completed' || t.status === 'cancelled'
    );
  }

  // Helper: Analyze todos for anti-patterns (tech_lead only)
  function analyzeTodos(todos: any[]): { needsReflection: boolean; pattern?: ReflectionPattern; prompt?: string } {
    const implementationKeywords = [
      /^(create|write|implement|code|add|build)\s+\w+\.(js|ts|py|go|rs|java|jsx|tsx|cpp|c|rb|php)/i,
      /^(update|modify|change|edit|fix)\s+\w+\s+(function|class|component|module|file)/i,
      /write.*code/i,
      /implement.*logic/i,
      /add.*function/i,
      /create.*class/i,
    ];

    const delegationKeywords = [
      /delegate/i,
      /assign/i,
      /(junior_dev|test_runner|explore|librarian|generic_runner)/i,
    ];

    // Pattern 1: Implementation todos (Red flag)
    const implTodos = todos.filter(t => 
      implementationKeywords.some(regex => regex.test(t.content))
    );

    if (implTodos.length > 0) {
      const examples = implTodos.slice(0, 2).map(t => `- "${t.content}"`).join('\n');
      return {
        needsReflection: true,
        pattern: 'implementation',
        prompt: `[Reflection Checkpoint]

Your todos contain implementation tasks:
${examples}

Question: Are you planning to implement code yourself?

Remember: You are a coordinator, not an implementer.
- For code implementation -> Delegate to junior_dev
- For builds/tests -> Delegate to test_runner
- For research -> Delegate to explore/librarian

Should these todos be for DELEGATING work rather than DOING work?`
      };
    }

    // Pattern 2: No delegation mentioned (Yellow flag - only if 3+ todos)
    if (todos.length >= 3) {
      const hasDelegation = todos.some(t => 
        delegationKeywords.some(regex => regex.test(t.content))
      );

      if (!hasDelegation) {
        const examples = todos.slice(0, 3).map(t => `- "${t.content}"`).join('\n');
        return {
          needsReflection: true,
          pattern: 'no-delegation',
          prompt: `[Reflection Checkpoint]

Your todos don't mention delegating to subagents:
${examples}

Question: Is all this work for you to do personally?

Consider: Could some of these be delegated in parallel?
- Analysis work -> explore agent
- Implementation -> junior_dev agent  
- Verification -> test_runner agent

Or are you still in the solo research phase? (That's fine too!)`
        };
      }
    }

    // Pattern 3: Parallel opportunities
    const pendingDelegations = todos.filter(t => 
      delegationKeywords.some(regex => regex.test(t.content)) && 
      t.status === 'pending'
    );

    if (pendingDelegations.length >= 2) {
      const examples = pendingDelegations.slice(0, 2).map(t => `- "${t.content}"`).join('\n');
      return {
        needsReflection: true,
        pattern: 'parallel',
        prompt: `[Reflection Checkpoint]

You have multiple delegation todos:
${examples}

Question: Are these tasks independent?

If yes, you can delegate to multiple agents IN PARALLEL using multiple task() calls in the same message. This is much faster than sequential delegation.

If no, proceed sequentially as planned.`
      };
    }

    // Pattern 4: Large todo list (Complexity signal)
    if (todos.length >= 7) {
      return {
        needsReflection: true,
        pattern: 'large-list',
        prompt: `[Reflection Checkpoint]

You've created ${todos.length} todos for this task.

Question: Is this task too complex for the delegation model?

Consider:
- Have you already tried delegating and failed 2+ times?
- Does this affect 15+ files across multiple systems?
- Would the user benefit from direct implementation?

If yes to multiple, consider suggesting: "This task is complex. Would you like me to switch to the build agent?"

If no, proceed with coordinated delegation as planned.`
      };
    }

    return { needsReflection: false };
  }

  return {
    // Track agent identity per session
    "chat.message": async (input, output) => {
      const sessionID = input.sessionID || output.message?.sessionID;
      const agent = output.message?.agent;
      
      if (sessionID && agent) {
        sessionAgents.set(sessionID, agent);
      }
    },

    // Track skill loads and todolist creation/updates
    "tool.execute.after": async (input, output) => {
      const sessionID = input.sessionID;
      const agent = sessionAgents.get(sessionID);
      
      // Track skill loads for all agents
      if (input.tool === "skill") {
        const skillName = output.metadata?.name;
        if (skillName) {
          if (!loadedSkills.has(sessionID)) {
            loadedSkills.set(sessionID, new Set());
          }
          loadedSkills.get(sessionID)!.add(skillName);
        }
      }
      
      // Track todolist creation and updates
      if (input.tool === "todowrite") {
        const todos = output.metadata?.todos;
        
        if (todos?.length) {
          const allComplete = areAllTodosComplete(todos);
          
          // Update todolist state
          sessionTodolist.set(sessionID, {
            exists: true,
            allComplete: allComplete,
            lastTodos: todos,
          });
          
          // Completion checkpoint (for all agents)
          if (agent === "tech_lead" && allComplete) {
            // DON'T await - inject asynchronously to avoid blocking tool completion
            injectReflection(sessionID, `[Completion Checkpoint]

All todos are marked complete!

Before finishing:
1. Have you verified the work succeeded?
2. Is there any follow-up work needed?
3. Should you report results to the user?

If truly done: Summarize what was accomplished.
If user requests more work: Create new todolist for the new work.`, agent);
            
            // Clear reflection tracking when todos complete - allow reflections for next todolist
            sessionReflections.delete(sessionID);
          }
          
          // Todo content analysis (only for tech_lead, only if not all complete)
          if (agent === "tech_lead" && !allComplete) {
            const analysis = analyzeTodos(todos);
            if (analysis.needsReflection && analysis.pattern && analysis.prompt) {
              // Check if we've already reflected on this pattern in this session
              const reflectedPatterns = sessionReflections.get(sessionID) || new Set();
              
              if (!reflectedPatterns.has(analysis.pattern)) {
                // First time seeing this pattern - inject reflection
                reflectedPatterns.add(analysis.pattern);
                sessionReflections.set(sessionID, reflectedPatterns);
                
                // DON'T await - inject asynchronously to avoid blocking tool completion
                injectReflection(sessionID, analysis.prompt, agent);
              }
            }
          }
        }
      }
    },

    // Enforce guardrails before tool execution
    "tool.execute.before": async (input, output) => {
      const sessionID = input.sessionID;
      const tool = input.tool;
      const agent = sessionAgents.get(sessionID);
      
      // ========================================
      // UNIVERSAL TODOLIST ENFORCEMENT (ALL AGENTS)
      // ========================================
      
      // Coordination tools: Allow without todolist (these help CREATE the todolist)
      const coordinationTools = ["question", "skill", "query_required_skills", "todoread", "todowrite"];
      if (coordinationTools.includes(tool)) {
        // Continue to agent-specific checks below
      } else if (tool.startsWith("mermaid_")) {
        // Mermaid tools: Allow without todolist (visualization/planning)
        // Continue to agent-specific checks below
      } else {
        // ALL other tools require todolist (for all agents)
        const todoState = sessionTodolist.get(sessionID);
        
        // No todolist at all
        if (!todoState?.exists) {
          await guideThenBlock(sessionID, `[Todolist Required]

You must create a todolist before beginning work.

Even for simple tasks, create a single-item todolist:
todowrite({ todos: [
  { id: "1", content: "Brief description of what you're doing", status: "in_progress", priority: "high" }
]})

For complex tasks, break it down:
todowrite({ todos: [
  { id: "1", content: "First step", status: "in_progress", priority: "high" },
  { id: "2", content: "Second step", status: "pending", priority: "high" },
  { id: "3", content: "Third step", status: "pending", priority: "medium" }
]})

Benefits:
- Makes your plan visible to the user
- Tracks progress through the session
- Keeps you organized`, agent);
        }
        
        // All todos complete - need new todolist for new work
        if (todoState.allComplete) {
          const previousWork = todoState.lastTodos
            .slice(0, 3)
            .map(t => `- ${t.content}`)
            .join('\n');
          
          await guideThenBlock(sessionID, `[Todolist Required]

Your previous todos are all complete. Starting new work requires a new todolist.

Previous work:
${previousWork}

Create new todolist: todowrite({ todos: [...] })

This helps track the new work you're starting.`, agent);
        }
      }
      
      // ========================================
      // TECH_LEAD SPECIFIC GUARDRAILS
      // ========================================
      
      // Only apply tech_lead-specific guardrails to tech_lead
      if (agent !== "tech_lead") return;
      
      // EDIT/WRITE TOOLS: Check file extension
      if (tool === "edit" || tool === "write") {
        const filePath = output.args?.filePath || input.args?.filePath;
        
        if (!filePath) {
          await guideThenBlock(sessionID, `[tech_lead Constraint] Cannot determine file path for ${tool} operation. Please specify a file path.`, agent);
        }
        
        // Allow markdown files
        if (filePath.endsWith(".md")) return;
        
        // Block all other file types
        await guideThenBlock(sessionID, `[tech_lead Constraint] Cannot edit non-markdown files directly.
File: ${filePath}

You can only edit/write markdown files (.md) for:
- Documentation (README.md, CONTRIBUTING.md)
- Plans (.opencode/plans/*.md, docs/plans/*.md)
- Architecture docs (.opencode/architecture/*.md)

For code changes:
1. Load skill: skill({name: 'junior_dev-task'})
2. Create detailed implementation spec
3. Delegate to junior_dev agent

For complex tasks affecting 15+ files or after 3+ failed delegations:
1. Ask user: "This task is complex. Should we switch to build agent?"
2. User can type "switch to build" if they agree

Remember: You are a coordinator, not an implementer.`, agent);
      }
      
      // TASK TOOL: Validate skill was loaded first
      if (tool === "task") {
        const subagentType = output.args?.subagent_type || input.args?.subagent_type;
        
        if (!subagentType) {
          await guideThenBlock(sessionID, `[tech_lead Constraint] task tool requires subagent_type parameter. Please specify which agent you want to delegate to.`, agent);
        }
        
        const requiredSkill = `${subagentType}-task`;
        const skills = loadedSkills.get(sessionID) || new Set();
        
        if (!skills.has(requiredSkill)) {
          await guideThenBlock(sessionID, `[tech_lead Constraint] Must load skill before delegation.

Before delegating to ${subagentType}, you must:
1. Load skill: skill({name: '${requiredSkill}'})
2. Review the required template_data fields
3. Then call task with complete template_data

The -task skill shows exactly what information the agent needs.
Don't skip this step - it ensures proper delegation.`, agent);
        }
        
        return;
      }
    },
  };
};
