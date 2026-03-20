# Research: OpenCode Plugin API Enforcement Capabilities

**Date:** 2026-03-19
**Subtask:** 01 (Slot B)
**Status:** Research complete; approach pending user gate

## Hook Catalog (Enforcement-Relevant)

| Hook | Enforcement | Notes |
|------|-------------|-------|
| `chat.message` | **YES** — throw to block | Fires before AI execution; can check file existence |
| `tool.execute.before` | **PARTIAL** — throw to block direct tools | Does NOT fire for subagent tool calls (issue #5894) |
| `chat.params` | **PARTIAL** — modify LLM params | No max_iter; temperature/top_p only |
| `permission.asked` | **YES** — deny permissions | Blocks sensitive operations |
| `experimental.chat.system.transform` | **PARTIAL** — inject system prompt | Does NOT receive user message text |
| `session.idle`, `tool.execute.after`, `stop`, others | **NO** | Fire-and-forget event listeners |

## Critical Answers

**Q: Can a plugin block message execution until a file artifact exists?**
→ **Partially YES via `chat.message`.**
- `chat.message` fires before AI receives the message
- Plugin can check for `.opencode/sessions/*/spec.json` on disk and throw to block
- This IS the planning enforcement mechanism — check plan artifact before allowing agent execution
- Limitation: does not distinguish between /plan commands (which SHOULD be allowed) and implementation commands (which SHOULD be blocked if no plan exists)
- Workaround: check message text in `chat.message` hook; if message starts with `/plan`, bypass the check

**Q: Can a plugin enforce max_iter?**
→ **NO.** No hook, config, or parameter supports proactive iteration limits.
- `tool.execute.before` can reactively count calls and throw, but: requires external state, fragile across compaction, does NOT fire for subagent tool calls
- Not viable for robust enforcement

## Planning Enforcement Design (Feasible)

```typescript
// Pseudocode for planning-enforcement plugin
plugin.on("chat.message", async ({ sessionID, message }) => {
  const messageText = message?.parts?.[0]?.text ?? "";
  
  // Bypass for /plan commands
  if (messageText.startsWith("/plan")) return;
  
  // Bypass for build agent (escape hatch)
  // agent field may not be populated here — use session state
  
  // Check for plan artifact
  const planExists = await checkPlanArtifactExists(sessionID);
  if (!planExists) {
    throw new Error("No plan found for this session. Run /plan to create one before proceeding.");
  }
});
```

**Key constraint:** The `chat.message` hook receives `{sessionID, agent?, model?, messageID?, variant?}` — agent field may be optional/null. The plan artifact check must be robust to missing agent info.

**DCP reference:** DCP plugin uses `chat.message` for context pruning — confirms this hook is reliable in practice.

## Decision Pending
User must approve enforcement approach at Gate 1. Options:
1. **`chat.message` enforcement** — check plan artifact before AI executes; bypass for /plan commands and build agent
2. **System prompt only** — inject enforcement instructions via `experimental.chat.system.transform` (softer, not blocking)
3. **No plugin enforcement** — rely entirely on HW system prompt conventions
