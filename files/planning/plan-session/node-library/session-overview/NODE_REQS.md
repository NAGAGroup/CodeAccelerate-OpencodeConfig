# Session Overview — Node Requirements

This node is always the entry point of the plan. Use `init_dag` to create the plan with this node — do not use `add_node`.
```
init_dag(plan_name, "session-overview", ["sequential-thinking_sequentialthinking"], [])
```

The entry node ID is always `"session-overview"`. The single todo item ensures the executing agent reasons through the task briefing before advancing.

---

✓ Good: single todo enforcing the agent internalizes the briefing before moving on
`init_dag(plan_name, "session-overview", ["sequential-thinking_sequentialthinking"], [])`

✗ Bad: empty todo — the agent skips reasoning and advances immediately without internalizing the task
`init_dag(plan_name, "session-overview", [], [])`

✗ Bad: using `add_node` for the entry node
`add_node(target, "some-parent", "session-overview", ["sequential-thinking_sequentialthinking"], [])`
