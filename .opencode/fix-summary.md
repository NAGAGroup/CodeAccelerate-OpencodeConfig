# Tech Lead Guardrails Plugin - Bug Fix Summary

## Date
January 31, 2026

## Issues Found

### Issue 1: Research Tools Bypass Todolist Requirement  
**Status**: Known, Design Decision

**Problem**: Tech_lead can use read/glob/grep tools indefinitely without creating a todolist.

**Evidence**: Session log shows tech_lead used read/glob multiple times before creating todolist.

**Current behavior** (lines 244-245 in plugin):
```typescript
const researchTools = ["read", "glob", "grep", "lsp"];
if (researchTools.includes(tool)) return; // Allows these without todolist
```

**Design trade-off**: We intentionally allow research before planning to enable exploration. Alternative approaches:
- **Option A**: Require todolist before ANY tool (strict)
- **Option B**: Allow N research tools, then require todolist (lenient)
- **Option C**: Keep current (research exempt, delegate on first work action)

**Decision**: Keeping Option C for now - allows natural exploration workflow.

---

### Issue 2: Todolist Not Recognized After Creation ✅ FIXED
**Status**: FIXED

**Problem**: After tech_lead created todolist, the next task() call was still blocked with "Todolist Required" error.

**Root Cause**: Incorrect data access in `tool.execute.after` hook

**The Bug** (line 196, 185):
```typescript
"tool.execute.after": async (input, output) => {
  if (input.tool === "skill") {
    const skillName = output.result?.name || input.args?.name;  // WRONG!
  }
  if (input.tool === "todowrite") {
    const todos = output.args?.todos || input.args?.todos;  // WRONG!
  }
}
```

**Why It Failed**:
The `tool.execute.after` hook signature is:
```typescript
"tool.execute.after"?: (
  input: { tool: string; sessionID: string; callID: string },
  output: {
    title: string
    output: string
    metadata: any  // <-- Tool results go here!
  },
) => Promise<void>
```

The tool results (from todowrite and skill tools) return:
```typescript
// todowrite returns:
{
  title: "5 todos",
  output: JSON.stringify(params.todos, null, 2),
  metadata: {
    todos: params.todos  // <-- HERE!
  }
}

// skill returns:
{
  title: "Loaded skill: junior_dev-task",
  output: "...",
  metadata: {
    name: skill.name,  // <-- HERE!
    dir
  }
}
```

There is NO `output.args` or `output.result` - those don't exist in the after hook!

**The Fix**:
```typescript
"tool.execute.after": async (input, output) => {
  if (input.tool === "skill") {
    const skillName = output.metadata?.name;  // CORRECT!
  }
  if (input.tool === "todowrite") {
    const todos = output.metadata?.todos;  // CORRECT!
  }
}
```

**How Plugin Hooks Work** (from OpenCode source):
```typescript
// Plugin.trigger calls each hook like this:
export async function trigger<Name, Input, Output>(
  name: Name, 
  input: Input, 
  output: Output
): Promise<Output> {
  for (const hook of hooks) {
    const fn = hook[name]
    await fn(input, output)  // Hook MODIFIES output in place
  }
  return output
}

// When a tool finishes executing:
const result = await tool.execute(params, ctx)  // Returns {title, output, metadata}
await Plugin.trigger(
  "tool.execute.after",
  { tool: "todowrite", sessionID, callID },
  result  // <-- result becomes the 'output' parameter
)
```

The `output` parameter in hooks is a mutable object that gets passed through all hooks. It's not the same as `input.args` from the `before` hook!

---

## Issue 3: No Meta-Reflection Shown ✅ FIXED
**Status**: FIXED

**Problem**: When todolist was created with 5 todos (no delegation keywords), Pattern 2 should have triggered reflection, but none appeared in logs.

**Root Cause**: `noReply: true` means "add message but DON'T trigger AI response"

**How noReply Works** (learned from oh-my-opencode):
- `noReply: true` → Message added to session, NO AI response triggered
- `noReply: false` → Message added to session, AI IMMEDIATELY responds

**Why We Need `noReply: false`**:
For meta-reflection to work, the agent MUST see and respond to the reflection prompt immediately. With `noReply: true`, the reflection would only appear in the next message's context, which is too late.

**Example from oh-my-opencode** (`background-agent/manager.ts`):
```typescript
await this.client.session.prompt({
  path: { id: task.parentSessionID },
  body: {
    noReply: !allComplete,  // FALSE when work done (trigger response)
    parts: [{ type: "text", text: notification }],
  },
})
```

They use `noReply: false` when they want the agent to acknowledge completion.

**The Fix**:
```typescript
await client.session.prompt({
  path: { id: sessionID },
  body: {
    noReply: false,  // Changed from true to false
    parts: [{ type: "text", text: `\n${message}\n` }],
  },
});
```

**Trade-off**: 
- Setting `noReply: false` means the reflection will trigger an AI response, which adds a message to the conversation
- This is intentional - we WANT the agent to pause and consider the reflection
- The reflection acts as a "checkpoint" that the agent must acknowledge before continuing

---

## Files Modified
- `/home/gta/CodeAccelerate-OpencodeConfig/opencode/plugins/tech-lead-guardrails.ts`
  - Line 185: Fixed skill metadata access
  - Line 196: Fixed todowrite metadata access

## Testing Required
1. Create new session with tech_lead
2. Tech_lead creates todolist
3. Tech_lead calls task tool
4. Verify: No false "Todolist Required" error
5. Verify: Reflection prompts appear for anti-patterns

## References
- OpenCode Plugin Documentation: https://opencode.ai/docs/plugins
- OpenCode Plugin Types: `/tmp/opencode-repo/packages/plugin/src/index.ts`
- Plugin Trigger Implementation: `/tmp/opencode-repo/packages/opencode/src/plugin/index.ts`
- Todo Tool: `/tmp/opencode-repo/packages/opencode/src/tool/todo.ts`
- Skill Tool: `/tmp/opencode-repo/packages/opencode/src/tool/skill.ts`
