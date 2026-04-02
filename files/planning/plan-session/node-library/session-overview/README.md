# Session Overview Prompt Creation

This is the first node of every plan. The executing agent was not part of the planning session — it has no knowledge of the task, the findings, or the decisions made. This prompt is its only briefing. Everything it needs to know must be in the TASK_CONTEXT you provide.

**Todo:**
1. `sequential-thinking_sequentialthinking` — compose the TASK_CONTEXT by reviewing your planning notes
2. `write_prompt` — write the session overview prompt with your TASK_CONTEXT

---
**REASONING TASK**

Use the `sequential-thinking_sequentialthinking` tool to compose the TASK_CONTEXT before calling `write_prompt`. Do not write it as text — you must call the tool.

- What is the user's goal? State it directly — the executing agent has no other source for this.
- What did the investigation phase discover that constrains or informs the work? Include specific file paths, line numbers, config values — not summaries.
- What scope decisions were made during user discussion? What's in, what's out, and why?
- Are there assumptions from the planning notes that the executing agent should be aware of?

Then call:
```
write_prompt(plan_name, "session-overview", "session-overview", {
  TASK_CONTEXT: "<your composed briefing>"
})
```

---

✓ Good: composes TASK_CONTEXT via sequential thinking with specific evidence from planning
`sequential-thinking_sequentialthinking({ thought: "<reviews planning notes, extracts key findings, scope decisions, and constraints>", ... })`
`sequential-thinking_sequentialthinking({ thought: "<composes TASK_CONTEXT with specific files, lines, user decisions>", ..., nextThoughtNeeded: false })`
`write_prompt(plan_name, "session-overview", "session-overview", { TASK_CONTEXT: "<composed briefing>" })`

✗ Bad: skips sequential thinking and writes a vague TASK_CONTEXT from memory
`write_prompt(plan_name, "session-overview", "session-overview", { TASK_CONTEXT: "<one sentence restating the user's original request>" })`

✗ Bad: writes the TASK_CONTEXT as prose between tool calls instead of composing it in sequential thinking
