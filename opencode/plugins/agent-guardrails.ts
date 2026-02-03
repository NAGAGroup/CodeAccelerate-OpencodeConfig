import type { Plugin } from "@opencode-ai/plugin";
import { createCompactionDetector } from "../lib/utils";

/**
 * AgentGuardrailsPlugin - Enforces role boundaries for all agents with agent-specific rules
 *
 * Features:
 * 1. UNIVERSAL: Mandatory todolists before ANY work
 * 2. UNIVERSAL: Auto-reset todolist requirement after completion
 * 3. TECH_LEAD ONLY: todoplan required before todowrite/todoread
 * 4. TECH_LEAD ONLY: Markdown-only editing enforcement
 * 5. TECH_LEAD ONLY: Skill-loading enforcement before delegation
 * 6. LIBRARIAN ONLY: Context7-first enforcement before exa
 */
export const AgentGuardrailsPlugin: Plugin = async ({ client }) => {
  // Track loaded skills per session
  const loadedSkills = new Map<string, Set<string>>();

  // Track current agent per session
  const sessionAgents = new Map<string, string>();

  // Track todolist state per session
  interface TodolistState {
    exists: boolean;
    allComplete: boolean;
    lastTodos: any[];
    metareflectionOccurred: boolean;
    finalizationPromptSent: boolean;
  }
  const sessionTodolist = new Map<string, TodolistState>();

  // Track todoplan calls per session
  const todoplanCalled = new Map<string, boolean>();

  // Track the index of the last compaction message we've processed per session
  // This prevents re-processing the same compaction message multiple times
  const lastProcessedCompactionIndex = new Map<string, number>();

  // Track Context7 tool usage per session (for librarian guardrail)
  const context7Used = new Map<string, boolean>();

  // Use shared compaction detection utility
  const createCompactionHandler = createCompactionDetector(client);

  // Helper: Inject reflection prompt that agent will see after completing current response
  // Uses synthetic: true so the agent sees it but the user doesn't (cleaner UX)
  // Uses noReply: true to queue the message rather than interrupt current response
  // CRITICAL: agentName parameter preserves agent context - without it, session defaults to tech_lead!
  // NOTE: Call this WITHOUT await in hooks to avoid blocking tool completion
  async function injectReflection(
    sessionID: string,
    message: string,
    agentName?: string,
  ) {
    try {
      await client.session.prompt({
        path: { id: sessionID },
        body: {
          noReply: true, // Queue for later - agent sees after completing current response
          ...(agentName ? { agent: agentName } : {}), // Preserve agent context
          parts: [
            {
              type: "text",
              text: message,
              synthetic: true, // Agent sees it, user doesn't - cleaner UX
            },
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
  async function guideThenBlock(
    sessionID: string,
    guidance: string,
    agentName?: string,
  ) {
    // Inject guidance for agent to see
    await injectReflection(sessionID, guidance, agentName);
    // Throw minimal error to stop tool execution (user won't see this)
    throw new Error("Tool execution blocked by guardrail");
  }

  // Helper: Check if all todos are complete
  function areAllTodosComplete(todos: any[]): boolean {
    return (
      todos.length > 0 &&
      todos.every((t) => t.status === "completed" || t.status === "cancelled")
    );
  }

  return {
    // Track agent identity per session
    "chat.message": async (input, output) => {
      const sessionID = input.sessionID || output.message?.sessionID;
      const agent = output.message?.agent;

      // Skip internal OpenCode agents (compaction, etc.)
      if (agent === "compaction") return;

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
          const previousState = sessionTodolist.get(sessionID);
          const wasComplete = previousState?.allComplete || false;

          // Update todolist state
          sessionTodolist.set(sessionID, {
            exists: true,
            allComplete: allComplete,
            lastTodos: todos,
            metareflectionOccurred: false,
            finalizationPromptSent:
              previousState?.finalizationPromptSent || false,
          });

          // Trigger finalization reflection when todos transition to all complete
          if (
            allComplete &&
            !wasComplete &&
            !sessionTodolist.get(sessionID)?.finalizationPromptSent
          ) {
            // Mark that we've sent the finalization prompt
            const currentState = sessionTodolist.get(sessionID);
            if (currentState) {
              sessionTodolist.set(sessionID, {
                ...currentState,
                finalizationPromptSent: true,
              });
            }

            // Don't await - fire and forget to avoid blocking todowrite completion
            injectReflection(
              sessionID,
              `[Todolist Complete]

All todos are now marked as completed or cancelled. Before finishing:

Provide a complete summary of your work for the user.

If you already provided a detailed summary in your previous message, restate it exactly so the user has a clear record of what was accomplished.

Your summary should include:
- What was completed
- Key results or outcomes
- Any important notes or next steps

This ensures the user has a clear final report of the session's work.`,
              agent,
            );
          }

          // Reset todoplan when todos complete (tech_lead only)
          if (agent === "tech_lead" && allComplete) {
            todoplanCalled.set(sessionID, false);
          }
        }
      }

      // Track todoplan calls (tech_lead only)
      if (input.tool === "todoplan" && agent === "tech_lead") {
        todoplanCalled.set(sessionID, true);
      }

      // Track Context7 tool usage for librarian
      if (input.tool.toLowerCase().startsWith("context7")) {
        context7Used.set(sessionID, true);
      }
    },

    // Use shared compaction detection utility for dual-hook strategy
    event: createCompactionHandler(
      async (sessionID, compactionIndex) => {
        // Clear todolist state from our Map - force fresh start after compaction
        sessionTodolist.delete(sessionID);

        // Clear todoplan state - require new planning after compaction
        todoplanCalled.delete(sessionID);

        // Clear Context7 tracking for librarian
        context7Used.delete(sessionID);

        // Remember that we've processed this compaction
        lastProcessedCompactionIndex.set(sessionID, compactionIndex);
      },
      (sessionID) => lastProcessedCompactionIndex.get(sessionID) ?? -1,
    ),

    // Enforce guardrails before tool execution
    "tool.execute.before": async (input, output) => {
      const sessionID = input.sessionID;
      const tool = input.tool;
      const agent = sessionAgents.get(sessionID);

      // ========================================
      // UNIVERSAL TODOLIST ENFORCEMENT (ALL AGENTS)
      // ========================================

      // Coordination tools: Allow without todolist (these help CREATE the todolist)
      const coordinationTools = [
        "question",
        "skill",
        "query_required_skills",
        "todoplan",
        "todoread",
        "todowrite",
      ];
      if (coordinationTools.includes(tool)) {
        // Continue to agent-specific checks below
      } else if (tool.startsWith("mermaid_")) {
        // Mermaid tools: Allow without todolist (visualization/planning)
        // Continue to agent-specific checks below
      } else {
        // ALL other tools require todolist (for all agents)
        const todoState = sessionTodolist.get(sessionID);

        // No todolist at all - implement metareflection state tracking
        if (!todoState?.exists && !todoState?.metareflectionOccurred) {
          // Mark that metareflection has occurred
          sessionTodolist.set(sessionID, {
            exists: false,
            allComplete: false,
            lastTodos: [],
            metareflectionOccurred: true,
            finalizationPromptSent: false,
          });

          await guideThenBlock(
            sessionID,
            `[Todolist Required]

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
- Keeps you organized`,
            agent,
          );
        }

        // If metareflection already occurred but still no todolist, block silently
        if (!todoState?.exists && todoState?.metareflectionOccurred) {
          throw new Error("Tool execution blocked by guardrail");
        }

        // All todos complete - need new todolist for new work
        if (todoState?.allComplete) {
          const previousWork = todoState.lastTodos
            .slice(0, 3)
            .map((t) => `- ${t.content}`)
            .join("\n");

          await guideThenBlock(
            sessionID,
            `[Todolist Required]

Your previous todos are all complete. Starting new work requires a new todolist.

Previous work:
${previousWork}

Create new todolist: todowrite({ todos: [...] })

This helps track the new work you're starting.`,
            agent,
          );
        }
      }

      // ========================================
      // LIBRARIAN SPECIFIC GUARDRAILS
      // ========================================

      if (
        agent === "librarian" &&
        (input.tool.toLowerCase().startsWith("exa") ||
          input.tool.startsWith("web"))
      ) {
        const hasUsedContext7 = context7Used.get(sessionID) || false;

        if (!hasUsedContext7) {
          await guideThenBlock(
            sessionID,
            `[Context7 Required Before web search tools]

You must try Context7 tools first before using web tools like exa, websearch or webfetch.

Context7 should be your first choice for:
- Popular open-source libraries and frameworks
- Standard packages (npm, PyPI, Maven Central, etc.)
- Well-documented APIs and SDKs
- Major frameworks (React, Vue, Django, Rails, etc.)

Use web search tools only when:
- Context7 doesn't have the information you need
- Researching vendor-specific documentation
- Looking for blog posts, tutorials, or research papers
- Exploring GitHub repositories
- Finding specialized or niche content

You MUST try relevant Context7 tools first, then retry web tools if needed.

Running web tools will not work until you have used Context7 tools in this session, 
even if you're sure context7 doesn't make sense for the task.`,
            agent,
          );
        }
      }

      // ========================================
      // TECH_LEAD SPECIFIC GUARDRAILS
      // ========================================

      // Only apply tech_lead-specific guardrails to tech_lead
      if (agent !== "tech_lead") return;

      // TODOWRITE/TODOREAD: Require todoplan to be called first
      if (tool === "todowrite" || tool === "todoread") {
        const planCalled = todoplanCalled.get(sessionID);
        if (!planCalled) {
          await guideThenBlock(
            sessionID,
            `[tech_lead Constraint] Must call todoplan before using ${tool}.

Before creating or reading your todolist, you must:
1. Call todoplan() to get todolist guidance
2. Review the guidance
3. Then call ${tool}

This ensures you've considered delegation patterns, parallel opportunities, and proper tool usage.`,
            agent,
          );
        }
      }

      // EDIT/WRITE TOOLS: Check file extension
      if (tool === "edit" || tool === "write") {
        const filePath = output.args?.filePath || input.args?.filePath;

        if (!filePath) {
          await guideThenBlock(
            sessionID,
            `[tech_lead Constraint] Cannot determine file path for ${tool} operation. Please specify a file path.`,
            agent,
          );
        }

        // Allow markdown files
        if (filePath.endsWith(".md")) return;

        // Block all other file types
        await guideThenBlock(
          sessionID,
          `[tech_lead Constraint] Cannot edit non-markdown files directly.
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

Remember: You are a coordinator, not an implementer.`,
          agent,
        );
      }

      // TASK TOOL: Validate skill was loaded first
      if (tool === "task") {
        const subagentType =
          output.args?.subagent_type || input.args?.subagent_type;

        if (!subagentType) {
          await guideThenBlock(
            sessionID,
            `[tech_lead Constraint] task tool requires subagent_type parameter. Please specify which agent you want to delegate to.`,
            agent,
          );
        }

        const requiredSkill = `${subagentType}-task`;
        const skills = loadedSkills.get(sessionID) || new Set();

        if (!skills.has(requiredSkill)) {
          await guideThenBlock(
            sessionID,
            `[tech_lead Constraint] Must load skill before delegation.

Before delegating to ${subagentType}, you must:
1. Load skill: skill({name: '${requiredSkill}'})
2. Review the required template_data fields
3. Then call task with complete template_data

The -task skill shows exactly what information the agent needs.
Don't skip this step - it ensures proper delegation.`,
            agent,
          );
        }

        return;
      }
    },
  };
};
