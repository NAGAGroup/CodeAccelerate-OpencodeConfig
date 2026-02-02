# Enforcing Todolist Before ALL Tools

## Date
February 2, 2026

## Change: Strict Todolist Enforcement

### Previous Behavior (REMOVED)

**Research tools exemption:**
```typescript
// OLD - Research tools could run without todolist
const researchTools = ["read", "glob", "grep", "lsp"];
if (researchTools.includes(tool)) return;  // Skip todolist check
```

**Problem:**
- Agent could do extensive research without planning
- Meta-reflection never triggered until agent started "work" tools
- User had no visibility into agent's exploration process
- No guidance during the research phase

### New Behavior (STRICT)

**All tools require todolist (except coordination tools):**
```typescript
// NEW - Only coordination tools exempt
const coordinationTools = ["question", "skill", "query_required_skills", "todoread", "todowrite"];
if (coordinationTools.includes(tool)) return;

// Mermaid tools exempt (visualization/planning)
if (tool.startsWith("mermaid_")) return;

// ALL OTHER TOOLS REQUIRE TODOLIST
const todoState = sessionTodolist.get(sessionID);
if (!todoState?.exists) {
  throw new Error('[Todolist Required]...');
}
```

### Why This Change?

**1. Meta-Reflection Trigger**
The todolist is what triggers meta-reflection. If agent can skip todolist during research, they never get guidance about their approach.

**Example without strict enforcement:**
```
User: "Add authentication to the API"
Agent: read(api.js)       // No todolist required
Agent: read(auth.js)      // No todolist required
Agent: glob(src/**/*.js)  // No todolist required
Agent: grep("auth")       // No todolist required
Agent: todowrite([...])   // Creates implementation todos
→ Meta-reflection: "You're planning to implement code yourself?"
→ TOO LATE - agent already explored with implementation mindset
```

**Example with strict enforcement:**
```
User: "Add authentication to the API"
Agent: read(api.js)       // ERROR: [Todolist Required]
Agent: todowrite(["Research current auth setup", "Analyze requirements", "Plan approach"])
→ Meta-reflection: "Your todos don't mention delegation - is this solo research?" ✓
Agent: read(api.js)       // NOW allowed - todolist exists
Agent: read(auth.js)
Agent: Updates todolist based on findings
Agent: todowrite(["Delegate implementation to junior_dev", "Review and test"])
→ Proper delegation approach from the start!
```

**2. User Visibility**
With strict enforcement, the todolist is created upfront, giving users immediate visibility into the agent's plan.

**3. Prevents Aimless Exploration**
Requiring a todolist before ANY action forces the agent to articulate intent before diving in.

### What Tools Are Exempt?

**Coordination Tools (always allowed):**
- `question` - Ask user for clarification
- `skill` - Load delegation skills
- `query_required_skills` - Check available skills
- `todoread` - Read existing todos
- `todowrite` - Create/update todos

**Why exempt?** These tools are used TO CREATE the todolist and coordinate the plan.

**Mermaid Tools (always allowed):**
- `mermaid_render_svg`
- `mermaid_render_ascii`
- `mermaid_validate`
- `mermaid_list_themes`

**Why exempt?** Visualization tools for planning/documentation, often used DURING todolist creation.

### What Tools Now Require Todolist?

**ALL other tools, including:**

**Research tools:**
- `read` - Read files
- `glob` - Find files
- `grep` - Search content
- `lsp` - Language server queries

**Work tools:**
- `edit` - Edit files
- `write` - Write files
- `task` - Delegate to subagents

**Execution tools:**
- `bash` - Run commands (if allowed)
- Any custom tools added by plugins

### Expected Workflow

**1. User sends request**
```
User: "Refactor the authentication module to use JWT"
```

**2. Agent tries to explore**
```
Agent: read(src/auth.js)
→ ERROR: [Todolist Required]
```

**3. Agent creates todolist**
```
Agent: todowrite({
  todos: [
    { id: "1", content: "Read and understand current auth implementation", status: "in_progress", priority: "high" },
    { id: "2", content: "Research JWT best practices", status: "pending", priority: "high" },
    { id: "3", content: "Design JWT integration approach", status: "pending", priority: "medium" },
    { id: "4", content: "Delegate implementation to junior_dev", status: "pending", priority: "medium" }
  ]
})
→ Meta-reflection triggers: "You have pending delegations - can you run them in parallel?"
```

**4. Agent proceeds with todolist**
```
Agent: read(src/auth.js)  // NOW allowed
Agent: read(docs/jwt.md)
Agent: Updates todo #1 to completed
Agent: Continues with plan...
```

### Benefits

✅ **Early Guidance**: Meta-reflection happens before work starts, not after
✅ **User Visibility**: Plan is visible from the beginning
✅ **Intentional Work**: Agent must articulate goals before acting
✅ **Proper Delegation**: Encourages thinking about delegation upfront
✅ **Progress Tracking**: Every action maps to a todo item

### Trade-offs

⚠️ **Extra Step**: Agent must create todolist even for simple queries
- Mitigation: Single-item todolists are fine for simple tasks

⚠️ **Less Exploratory Freedom**: Can't "just look around"
- Mitigation: Create todos like "Explore codebase structure" to allow open-ended research

⚠️ **More Initial Friction**: Adds one message before starting
- Mitigation: Todolist creation is fast and clarifies intent

### Testing

**Test Case 1: Simple Research**
```
User: "What does the authentication module do?"
Agent: read(src/auth.js)
→ ERROR: [Todolist Required]
Agent: todowrite([{ id: "1", content: "Read and explain auth module", status: "in_progress" }])
Agent: read(src/auth.js)
→ SUCCESS
```

**Test Case 2: Complex Task**
```
User: "Add rate limiting to all API endpoints"
Agent: glob(src/api/**/*.js)
→ ERROR: [Todolist Required]
Agent: todowrite([...detailed plan...])
→ Meta-reflection: Checks for implementation vs delegation
Agent: read files, analyzes, delegates
→ Proper workflow
```

**Test Case 3: Coordination Tools Work Without Todolist**
```
User: "Can you help me?"
Agent: question("What would you like me to help with?")
→ SUCCESS (question tool exempt)
User: "Add a feature"
Agent: skill({name: 'junior_dev-task'})
→ SUCCESS (skill tool exempt)
Agent: read(...)
→ ERROR: [Todolist Required]
```

### Migration Notes

**Old Behavior:**
Agents could research extensively before creating todolist. This felt more natural for exploratory tasks.

**New Behavior:**
Agents must create todolist upfront. This ensures:
1. User sees the plan immediately
2. Meta-reflection guides the approach early
3. Every action is tracked against a goal

**Recommendation:**
If users complain about the extra friction, we can:
1. Make the first N tool calls exempt (e.g., first 3 reads)
2. Add a "quick research" mode that bypasses this
3. Make it configurable per agent

For now, the strict approach ensures meta-reflection actually happens.

### Configuration (Future)

If needed, we could make this configurable:

```typescript
interface GuardrailsConfig {
  todolist: {
    enforcement: 'strict' | 'lenient' | 'work-only';
    // strict: All tools (current)
    // lenient: First N research tools allowed, then require
    // work-only: Only edit/write/task require todolist (old behavior)
  };
}
```

### Summary

**Change**: Removed research tools exemption from todolist requirement

**Reason**: Todolist creation triggers meta-reflection, which guides agent approach

**Impact**: Agent must create todolist before ANY tool use (except coordination/visualization)

**Result**: Better guidance, visibility, and intentional work from the start

This makes tech_lead truly a planning-first coordinator!
