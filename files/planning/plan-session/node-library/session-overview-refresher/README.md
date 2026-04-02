# Session Overview Refresher Prompt Creation

This node goes immediately after every `compress` node. After compression, the executing agent loses the behavioral contract and task context from memory. This prompt re-establishes both.

The TASK_CONTEXT you provide here should be the same content you used in the session-overview — the executing agent needs the same briefing to get back on track. If a notes file was created during execution, tell the agent to read it so it can rebuild detailed context beyond what fits in the TASK_CONTEXT.

**Todo:**
1. `sequential-thinking_sequentialthinking` — decide what to include in the TASK_CONTEXT. Consider: is the original session-overview briefing still accurate, or has execution revealed new information? Has a notes file been created that the agent should read after compression?
2. `write_prompt` — write the refresher prompt with your TASK_CONTEXT

---
**REASONING TASK**

Use the `sequential-thinking_sequentialthinking` tool to compose the TASK_CONTEXT before calling `write_prompt`. Do not write it as text — you must call the tool.

- What was the original task briefing from the session-overview? Is it still accurate?
- Has anything changed during execution that the agent needs to know about?
- Was a notes file created during execution (e.g. by a `write-notes` node earlier in the plan)? If so, include a read instruction so the agent can rebuild detailed context.
- Are there any completed steps the agent should be aware of to avoid re-doing work?

Then call:
```
write_prompt(plan_name, "session-overview-refresher", node_id, {
  TASK_CONTEXT: "<your composed briefing>"
})
```

---

✓ Good: includes read instruction for notes file when one exists
```
write_prompt(plan_name, "session-overview-refresher", node_id, {
  TASK_CONTEXT: "<task briefing paragraph>\n\nA notes file was written during execution with detailed findings. Read it before proceeding:\n`read {{SESSION_PATH}}/notes/execution-notes.md`"
})
```

✓ Good: no notes file exists, TASK_CONTEXT is self-contained
```
write_prompt(plan_name, "session-overview-refresher", node_id, {
  TASK_CONTEXT: "<task briefing paragraph with all context the agent needs>"
})
```

✗ Bad: copies the session-overview TASK_CONTEXT verbatim without considering what changed during execution

✗ Bad: a notes file was created by an earlier node but the refresher doesn't mention it — the agent won't know to read it

✗ Bad: skips sequential thinking and writes a vague TASK_CONTEXT from memory
