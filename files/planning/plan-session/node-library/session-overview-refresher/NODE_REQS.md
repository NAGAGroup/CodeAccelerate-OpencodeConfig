# Session Overview Refresher — Node Requirements

This node goes immediately after every `compress` node. Use `add_node` to attach it to the compress node.
```
add_node(target, parent_id, node_id, ["sequential-thinking_sequentialthinking"], ["read"])
```

- **target** — the plan name. Same value you passed to `init_dag`.
- **parent_id** — the node ID of the compress node this refresher follows.
- **node_id** — a unique ID for this node. Use something descriptive like `"session-refresher-1"` or `"session-refresher-after-impl"`.

The single todo item ensures the agent reasons through the refresher context before advancing. The `read` tool is unlocked so the agent can read a notes file if the TASK_CONTEXT instructs it to — but it's not required. If no notes file exists, the agent just reasons through the TASK_CONTEXT and advances.

---

✓ Good: unlocked read allows the agent to read notes if instructed, without forcing it
`add_node(target, "compress-1", "session-refresher-1", ["sequential-thinking_sequentialthinking"], ["read"])`

✗ Bad: putting `read` in the todo array — this forces the agent to read even when there's no notes file
`add_node(target, "compress-1", "session-refresher-1", ["read", "sequential-thinking_sequentialthinking"], [])`

✗ Bad: no unlocked tools — the agent can't read the notes file even if the TASK_CONTEXT tells it to
`add_node(target, "compress-1", "session-refresher-1", ["sequential-thinking_sequentialthinking"], [])`
