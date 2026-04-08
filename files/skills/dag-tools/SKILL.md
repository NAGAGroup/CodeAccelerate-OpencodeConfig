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
| `from` | ID of the source (parent) node (required) |
| `to` | ID of the target (child) node — must already exist in the DAG (required) |

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

## How to build a DAG

1. Call `get_planning_components_catalogue` to load the component library
2. Plan the full adjacency list in your reasoning before calling any DAG tool — every node and every edge, end to end
3. Call `init_dag` to create the plan file — `execution-kickoff`, `plan-success`, and `plan-fail` are auto-added
4. Create all remaining nodes in one call with `add_nodes_to_dag`
5. Wire all edges with `connect_nodes` — entry node first, then follow each path to the terminals
6. Call `get_dag_draft_diagram` after each structural change to verify the shape looks correct
7. Call `validate_dag` when construction is complete — fix any issues before finishing

## How to revise a DAG

1. Call `get_compact_dag_draft` to read the current structure and identify orphaned groups
2. Plan the target adjacency list in your reasoning — what the DAG should look like after revision
3. Identify the diff: nodes to add, edges to add, edges to remove, nodes to remove
4. Execute: new nodes with `add_nodes_to_dag`, new edges with `connect_nodes`, removed edges with `delete_edge`, removed nodes with `delete_node` — after any `delete_node`, immediately rewire orphaned children before continuing
5. Call `get_dag_draft_diagram` after each change, `validate_dag` when done

## How to think through this skill

<|think|>
- Have I loaded the catalogue before designing — am I working from the actual available components, not memory?
- Have I planned the full adjacency list before calling any tool — do I know every node and every edge?
- Am I creating all nodes first with `add_nodes_to_dag` and wiring second, or am I mixing the two and losing track of what exists?
- After a delete_node, have I immediately rewired the orphaned children before doing anything else?
- Does the draft diagram match the adjacency list I planned — are there any unexpected orphans or missing edges?
