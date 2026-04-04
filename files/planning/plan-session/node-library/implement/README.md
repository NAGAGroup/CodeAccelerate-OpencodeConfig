# Implement — Prompt Creation

This component dispatches a juniordev subagent to make small, targeted code changes. The juniordev is an intelligent agent — it explores the codebase, reasons through the implementation, makes the edit, and reports what it did. You describe the GOAL of the changes being made and WHY they are. Optionally, if you have are 100% certain you have enough contextual knowledge, you can add implementation task information as well. The executing agent that runs this prompt decides the remaining contextual info and implementation task, if you decide not to add it here, to give the juniordev the full breadth and depth it needs to complete the task successfully. The information decided during execution is all the information you didn't have at planning time — the findings from earlier execution steps, the results of any scouts, and the evolving understanding of the task as the agent reasons through it.

## Parameters

- **`DESCRIPTION`** (required) — a short label for the task dispatch. This is passed as the `description` field in the `task()` call, not embedded in the subagent prompt. One line.
- **`IMPLEMENTATION_TASK`** (optional) — the conceptual change description. Describe what needs to change and why — never specify exact code, line numbers, or restrict which files to edit. If you understand the task well enough, fill this now. If the executing agent needs to compose this from findings gathered during execution, leave it unfilled — the executing agent will fill it before dispatching.

**Todo:**
1. `sequential-thinking_sequentialthinking` — reason through what to provide and what to leave for the executing agent
2. `write_prompt` — write the prompt with your arguments

---
**REASONING TASK**

Use the `sequential-thinking_sequentialthinking` tool to decide what to include before calling `write_prompt`. Do not write your reasoning as text — you must call the tool.

- What is the change this node needs to make? Can you describe it clearly right now, or does it depend on findings from earlier execution steps?
- If you can describe it: compose an IMPLEMENTATION_TASK that says WHAT needs to change and WHY, without specifying HOW. The juniordev reasons through the implementation — do not write code for it, specify line numbers, or restrict it to specific files.
- If the change depends on execution context you don't have yet: leave IMPLEMENTATION_TASK unfilled. The executing agent will compose it from what it learns during execution.
- What is a clear, short DESCRIPTION for this task?

Then call:
```
write_prompt(plan_name, "implement", node_id, {
  DESCRIPTION: "<short task label>",
  IMPLEMENTATION_TASK: "<conceptual change description>"  // omit if leaving for executing agent
})
```

Arguments:
- `plan_name` — the plan this node belongs to. Same value you passed to `init_dag`.
- `"implement"` — the component name. Always `"implement"` for this component.
- `node_id` — a unique ID for this node. Use something descriptive like `"impl-<what-is-being-changed>"`. This becomes the prompt filename (`{node_id}.md`).
- `DESCRIPTION` — short task label. Displayed as the subagent's description in the `task()` call. One line, human-readable. Example shape: `"<verb> <what>"`.
- `IMPLEMENTATION_TASK` — (optional) what needs to change and why. Conceptual, not line-level. The juniordev uses this to reason through and decide how to implement. Omit entirely if the executing agent needs to compose this from execution context.

---

✓ Good: planning agent knows enough to describe the change — fills IMPLEMENTATION_TASK
```
write_prompt(plan_name, "implement", node_id, {
  DESCRIPTION: "<short task label>",
  IMPLEMENTATION_TASK: "<what needs to change — conceptual, not line-level>\n\n<why this change is needed>"
})
```

✓ Good: change depends on execution findings — leaves IMPLEMENTATION_TASK for executing agent
```
write_prompt(plan_name, "implement", node_id, {
  DESCRIPTION: "<short task label>"
})
```

✗ Bad: specifies exact code, line numbers, or file restrictions — the juniordev reasons through implementation
```
write_prompt(plan_name, "implement", node_id, {
  DESCRIPTION: "<label>",
  IMPLEMENTATION_TASK: "In `<path>` on line <N>, change `<old>` to `<new>`"
})
```

✗ Bad: vague IMPLEMENTATION_TASK that doesn't give the juniordev enough to reason about
```
write_prompt(plan_name, "implement", node_id, {
  DESCRIPTION: "<label>",
  IMPLEMENTATION_TASK: "Fix the bug"
})
```

✗ Bad: restricts which files the juniordev can touch
```
write_prompt(plan_name, "implement", node_id, {
  DESCRIPTION: "<label>",
  IMPLEMENTATION_TASK: "Only edit `<path>`. <description of change>"
})
```
