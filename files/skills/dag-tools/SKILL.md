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

Auto-adds three protected terminal nodes: `execution-kickoff` (entry), `plan-success`, and `plan-fail`. These cannot be added or deleted manually.

### `add_nodes_to_dag`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan to add nodes to (required) |
| `nodes` | Dictionary mapping nodeId → component_name, e.g. `{ "investigate": "research", "implement": "work-item" }` (required) |

Adds all nodes in a single batch call. Use this after `init_dag` to create all work nodes at once. The protected terminal nodes (`execution-kickoff`, `plan-success`, `plan-fail`) cannot be added via this tool.

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

The protected terminal nodes (`execution-kickoff`, `plan-success`, `plan-fail`) cannot be deleted.

### `get_compact_dag_draft`

| Parameter | Description |
|-----------|-------------|
| `target` | Session plan name or raw path to plan.jsonl (required) |

Returns the DAG as JSONL with connected nodes first, followed by orphaned groups each prefixed with `// orphaned group N`. Use this to inspect structure and spot disconnected nodes during design.

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


