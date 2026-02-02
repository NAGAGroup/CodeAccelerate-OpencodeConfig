# Tech Lead Guardrails Plugin - Complete Fix Summary

## Date
February 2, 2026

## Overview
Fixed critical bugs in the tech_lead guardrails plugin that prevented todolist tracking and meta-reflection from working correctly.

---

## All Issues & Fixes

### ✅ Issue 1: Todolist Not Recognized After Creation (FIXED)

**Problem**: After tech_lead created a todolist, the next `task()` call was STILL blocked with "Todolist Required" error.

**Root Cause**: Incorrect data access in `tool.execute.after` hook - trying to read `output.args` or `input.args` which don't exist.

**Understanding the Hook Signature**:
```typescript
"tool.execute.after"?: (
  input: { tool: string; sessionID: string; callID: string },
  output: {
    title: string
    output: string
    metadata: any  // <-- Tool-specific data goes here!
  },
) => Promise<void>
```

**The Bug** (lines 185, 196):
```typescript
// WRONG - these fields don't exist!
const skillName = output.result?.name || input.args?.name;
const todos = output.args?.todos || input.args?.todos;
```

**The Fix**:
```typescript
// CORRECT - read from metadata
const skillName = output.metadata?.name;
const todos = output.metadata?.todos;
```

**Why This Works**:
Tools return `{ title, output, metadata }`. The OpenCode codebase shows:
```typescript
// todowrite tool (packages/opencode/src/tool/todo.ts)
return {
  title: `${params.todos.length} todos`,
  output: JSON.stringify(params.todos, null, 2),
  metadata: {
    todos: params.todos  // <-- Data is here!
  }
}

// skill tool (packages/opencode/src/tool/skill.ts)
return {
  title: `Loaded skill: ${skill.name}`,
  output: "...",
  metadata: {
    name: skill.name,  // <-- Data is here!
    dir
  }
}
```

---

### ✅ Issue 2: No Meta-Reflection Shown (FIXED)

**Problem**: Reflection prompts were not triggering agent responses when anti-patterns were detected.

**Root Cause**: Used `noReply: true` which only adds the message to history WITHOUT triggering an AI response.

**Understanding noReply**:
From oh-my-opencode and OpenCode source:
- `noReply: true` → Message added, NO AI response
- `noReply: false` → Message added, AI IMMEDIATELY responds

**When to Use Each**:
```typescript
// Use noReply: true for silent notifications (background updates)
await client.session.prompt({
  body: {
    noReply: true,  // Agent sees this later in context
    parts: [{ type: "text", text: "Background task started" }]
  }
})

// Use noReply: false for checkpoints requiring immediate response
await client.session.prompt({
  body: {
    noReply: false,  // Agent must respond NOW
    parts: [{ type: "text", text: "[Reflection] Please confirm..." }]
  }
})
```

**The Fix** (line 35):
```typescript
await client.session.prompt({
  path: { id: sessionID },
  body: {
    noReply: false,  // Changed from true -> Agent must respond
    parts: [{ type: "text", text: `\n${message}\n` }],
  },
});
```

**Trade-off**:
This means reflection will ADD a message to the conversation (agent's response to the reflection). This is intentional - we want the agent to pause and acknowledge before continuing.

---

### ⚠️ Issue 3: Research Tools Bypass (DESIGN DECISION)

**Status**: Intentional behavior, kept as-is

**Current Behavior**: Tech_lead can use `read`, `glob`, `grep`, `lsp` indefinitely without creating a todolist.

**Why This Exists** (lines 248-250):
```typescript
const researchTools = ["read", "glob", "grep", "lsp"];
if (researchTools.includes(tool)) return;
```

**Rationale**: Allow exploration before planning - natural workflow where agent gathers information before deciding what to do.

**Alternative Approaches** (if we want to change this later):

**Option A: Strict (require todolist before ANY tool)**
```typescript
// Remove the research tools exemption entirely
const workTools = ["edit", "write", "task"];
if (workTools.includes(tool)) {
  // existing todolist check
}
```

**Option B: Lenient (allow N research tools, then require todolist)**
```typescript
const researchCount = new Map<string, number>();

if (researchTools.includes(tool)) {
  const count = (researchCount.get(sessionID) || 0) + 1;
  researchCount.set(sessionID, count);
  
  if (count > 5) {  // After 5 research tools
    throw new Error("Please create a todolist before continuing research");
  }
  return;
}
```

**Option C: Current (research exempt, work actions require todolist)**
- Keep as-is
- Research tools never require todolist
- Only edit/write/task trigger the requirement

**Recommendation**: Keep Option C unless users complain about excessive research without planning.

---

## Files Modified

### `/home/gta/CodeAccelerate-OpencodeConfig/opencode/plugins/tech-lead-guardrails.ts`

**Line 35**: Changed `noReply: true` → `noReply: false`
```typescript
// Before:
noReply: true,

// After:
noReply: false,  // FALSE = trigger immediate AI response to reflection
```

**Line 185**: Fixed skill metadata access
```typescript
// Before:
const skillName = output.result?.name || input.args?.name;

// After:
const skillName = output.metadata?.name;
```

**Line 196**: Fixed todowrite metadata access
```typescript
// Before:
const todos = output.args?.todos || input.args?.todos;

// After:
const todos = output.metadata?.todos;
```

**Added console.log debugging** (lines 32-34, 42):
```typescript
console.log('[tech-lead-guardrails] Injecting reflection for session:', sessionID);
console.log('[tech-lead-guardrails] Message:', message.substring(0, 100) + '...');
// ... after prompt ...
console.log('[tech-lead-guardrails] Reflection injected successfully');
```

---

## How Plugin Hooks Work (For Future Reference)

### Hook Invocation Pattern
```typescript
// From packages/opencode/src/plugin/index.ts
export async function trigger<Name, Input, Output>(
  name: Name, 
  input: Input, 
  output: Output
): Promise<Output> {
  for (const hook of await state().then((x) => x.hooks)) {
    const fn = hook[name]
    if (!fn) continue
    await fn(input, output)  // Hook MODIFIES output in place!
  }
  return output
}
```

### Example: tool.execute.after
```typescript
// In session/prompt.ts:
const result = await tool.execute(params, ctx)  
// result = { title: "...", output: "...", metadata: { ... } }

await Plugin.trigger(
  "tool.execute.after",
  { tool: "todowrite", sessionID, callID },  // input
  result  // output (the result object)
)
```

### Key Insight
The `output` parameter in hooks is NOT the tool arguments - it's the tool RESULT.
- In `tool.execute.before`: `output` = `{ args }`
- In `tool.execute.after`: `output` = `{ title, output, metadata }`

---

## Testing Checklist

- [ ] Create new session with tech_lead agent
- [ ] Tech_lead does research (read/glob files)
- [ ] Tech_lead creates todolist with anti-patterns
- [ ] Verify: Meta-reflection prompt appears and agent responds
- [ ] Tech_lead calls task tool
- [ ] Verify: NO false "Todolist Required" error
- [ ] Tech_lead completes all todos
- [ ] Verify: Completion checkpoint appears
- [ ] Tech_lead tries to use edit/write/task again
- [ ] Verify: "Create new todolist" error appears
- [ ] Tech_lead creates new todolist
- [ ] Verify: Can proceed with work

---

## Key Learnings

### 1. Plugin Hook Data Flow
- `tool.execute.before`: `output.args` contains the tool arguments
- `tool.execute.after`: `output.metadata` contains the tool-specific result data
- Never assume data structure - always check the tool's return value

### 2. NoReply Semantics
- `noReply: true` = Silent notification (seen later)
- `noReply: false` = Checkpoint (immediate response)
- Use `false` when you need the agent to acknowledge and reflect

### 3. Research Complex Plugins
- oh-my-opencode is an excellent reference for complex plugin patterns
- Always check OpenCode source code for canonical implementations
- Don't guess - verify hook signatures and data structures

---

## References

- **OpenCode Plugin Docs**: https://opencode.ai/docs/plugins
- **OpenCode Plugin Types**: `/tmp/opencode-repo/packages/plugin/src/index.ts`
- **Plugin Trigger Implementation**: `/tmp/opencode-repo/packages/opencode/src/plugin/index.ts`
- **Todo Tool Implementation**: `/tmp/opencode-repo/packages/opencode/src/tool/todo.ts`
- **Skill Tool Implementation**: `/tmp/opencode-repo/packages/opencode/src/tool/skill.ts`
- **oh-my-opencode Reference**: https://github.com/code-yeongyu/oh-my-opencode
- **Background Manager (noReply example)**: `/tmp/oh-my-opencode/src/features/background-agent/manager.ts`

---

## Next Steps

1. **Test the plugin** in a live OpenCode session
2. **Monitor console.log output** to verify reflection logic runs
3. **Observe agent behavior** when meta-reflection is triggered
4. **Adjust reflection messages** if agent responses are not helpful
5. **Consider adding metrics** to track plugin effectiveness

---

## Potential Future Enhancements

### 1. Configurable Reflection Behavior
Allow users to configure when reflections trigger:
```typescript
interface GuardrailsConfig {
  reflection: {
    enabled: boolean;
    patterns: ("implementation" | "no-delegation" | "parallel" | "large-list")[];
    triggerMode: "immediate" | "deferred" | "off";
  };
}
```

### 2. Research Tool Limits
Add configurable limits for research before todolist required:
```typescript
interface GuardrailsConfig {
  research: {
    maxToolsBeforeTodolist: number;  // 0 = strict, -1 = unlimited
  };
}
```

### 3. Skill Load Caching
Cache skill loads across sessions to reduce redundant loading:
```typescript
const globalSkillCache = new Map<string, { timestamp: number; loaded: Set<string> }>();
```

### 4. Analytics & Metrics
Track plugin effectiveness:
```typescript
interface GuardrailsMetrics {
  todosCreated: number;
  reflectionsTriggered: Map<PatternType, number>;
  blockedActions: Map<ToolName, number>;
  successfulDelegations: number;
}
```

### 5. Custom Reflection Messages
Allow projects to define custom reflection prompts:
```typescript
// .opencode/guardrails.json
{
  "reflections": {
    "implementation": "Custom message for our team's workflow..."
  }
}
```
