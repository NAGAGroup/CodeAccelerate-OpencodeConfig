---
name: dag-tools
description: Teaches how to build, modify, review, and validate execution DAGs using DAG manipulation and design tools.
---

# What does this skill teach?

In this skill, you learn how to build, modify, validate, and visualize execution DAGs using the DAG manipulation tools.

## Related Tools

### `get_planning_components_catalogue`

| Parameter | Description |
|-----------|-------------|
| *(none)* | Returns the full CATALOGUE.md listing all available node component types |


### `init_dag`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name for the new session plan — lowercase, hyphens only, no spaces (required) |

Creates a new DAG with the given name.

### `add_nodes_to_dag`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan to add nodes to (required) |
| `nodes` | Dictionary mapping nodeId → component_name, e.g. `{ "investigate": "external-scout", "implement": "work-item" }` (required) |

Adds all nodes in a single batch call. Use this after `init_dag` to create all work nodes at once.

### `add_node`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan to add the node to (required) |
| `nodeId` | Unique ID for the new node (required) |
| `component_name` | Component type from the node library, e.g. `'work-item'`, `'verify'` (required) |

Adds a single node. Prefer `add_nodes_to_dag` for creating multiple nodes at once.

### `connect_nodes`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `edges` | Dictionary mapping from-nodeId to to-nodeId (or array of to-nodeIds for fan-out), e.g. `{"work-A": "verify-A", "verify-A": ["fix-A", "work-B"]}` (required) |

Wires multiple directed edges in a single batch call. All referenced nodes must already exist in the DAG.

### `insert_between`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `from` | ID of the upstream (parent) node (required) |
| `new_node` | ID of the node to insert — must already exist in the DAG (required) |
| `to` | ID of the downstream (child) node (required) |

Atomically inserts `new_node` between `from` and `to`. Removes the edge `from → to` and adds `from → new_node → to` in one operation. Use this when adding a node mid-chain to avoid accidentally creating orphans or extra children. The node must already exist (create it first with `add_node` or `add_nodes_to_dag`).

### `set_entry_point`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `node_id` | ID of the node that should execute first when the plan starts (required) |

Sets where execution begins. Call this once in the final wiring step (Stage 3).

### `set_exit_point`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `node_id` | ID of the leaf node to mark as an exit point (required) |
| `type` | Exit type: `'success'` or `'failure'` (required) |

Marks a leaf node as a plan exit. Call this for every leaf node in the final wiring step (Stage 3). Use `'success'` for happy-path exits and `'failure'` for retry-exhaustion/error exits.

### `delete_edge`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `from` | ID of the source (parent) node (required) |
| `to` | ID of the target (child) node to disconnect — node is not deleted, only the edge (required) |

### `delete_node`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `nodeId` | ID of the node to delete — all edges to and from it are removed; children become orphaned (required) |

### `get_compact_dag_draft`

| Parameter | Description |
|-----------|-------------|
| `target` | Session plan name or raw path to plan.jsonl (required) |

Returns the DAG in a compact format showing connected nodes, orphaned groups, and entry/exit status. Use this to inspect structure during design.

### `get_dag_draft_diagram`

| Parameter | Description |
|-----------|-------------|
| `target` | Session plan name or raw path to plan.jsonl (required) |

### `present_dag_diagram`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Session plan name — throws if the DAG has structural errors (required) |

### `validate_dag`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Session plan name — throws on any structural issue (required) |
