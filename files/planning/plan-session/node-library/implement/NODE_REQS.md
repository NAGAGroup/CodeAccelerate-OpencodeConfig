# Implement — Node Requirements

This node dispatches a juniordev to make a targeted code change. HeadWrench reasons through the dispatch and calls `task` to delegate to the juniordev. The juniordev's own tools (read, edit, bash, etc.) come from its agent definition — they are not specified here.
```
add_node(target, parent_id, node_id, ["sequential-thinking_sequentialthinking", "task"], [])
```

Arguments:
- **target** — the plan name. Same value you passed to `init_dag`.
- **parent_id** — the node ID of the step this node depends on. This is the node that must complete before this one can start.
- **node_id** — must match the `node_id` you passed to `write_prompt` for this node. This is how the DAG links the node to its prompt file.

The todo list contains the tools HeadWrench calls at this step — `sequential-thinking_sequentialthinking` to compose the dispatch and `task` to dispatch the juniordev. Unlocked tools are empty because the juniordev's permissions come from its agent definition, not from the DAG.

---

✓ Good: todo contains HW's tools, unlocked is empty
```
add_node(target, "<parent>", "<node_id>", ["sequential-thinking_sequentialthinking", "task"], [])
```

✗ Bad: subagent tools in unlocked — juniordev gets its tools from its agent definition, not the DAG
```
add_node(target, "<parent>", "<node_id>", ["sequential-thinking_sequentialthinking", "task"], ["read", "edit", "bash"])
```

✗ Bad: `task` missing from todo — HW can't dispatch the juniordev
```
add_node(target, "<parent>", "<node_id>", ["sequential-thinking_sequentialthinking"], [])
```

✗ Bad: node_id doesn't match what was passed to `write_prompt` — DAG can't find the prompt file
```
add_node(target, "<parent>", "<node_id-mismatch>", ...)  // write_prompt used a different node_id
```
