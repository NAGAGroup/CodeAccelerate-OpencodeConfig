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

### `add_node`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan to add the node to (required) |
| `nodeId` | Unique ID for the new node (required) |
| `component_name` | Component type from the node library, e.g. `'work-item'`, `'verify'`, `'plan-fail'` (required) |

### `add_child`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `parentId` | ID of the parent node (required) |
| `childId` | ID of the child node — must already exist in the DAG (required) |

### `delete_child`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `parentId` | ID of the parent node (required) |
| `childId` | ID of the child node to disconnect — node is not deleted, only the edge (required) |

### `delete_node`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `nodeId` | ID of the node to delete — all edges to and from it are removed; children become orphaned (required) |

### `show_dag_jsonl`

| Parameter | Description |
|-----------|-------------|
| `target` | Session plan name or raw path to plan.jsonl (required) |

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
3. Call `init_dag` to create the plan file with the execution-kickoff entry node
4. Create all remaining nodes with `add_node` — no wiring yet
5. Wire all edges with `add_child` — entry node first, then follow each path to the terminals
6. Call `get_dag_draft_diagram` after each structural change to verify the shape looks correct
7. Call `validate_dag` when construction is complete — fix any issues before finishing

## How to revise a DAG

1. Call `show_dag_jsonl` to read the current structure
2. Plan the target adjacency list in your reasoning — what the DAG should look like after revision
3. Identify the diff: nodes to add, edges to add, edges to remove, nodes to remove
4. Execute: new nodes with `add_node`, new edges with `add_child`, removed edges with `delete_child`, removed nodes with `delete_node` — after any `delete_node`, immediately rewire orphaned children before continuing
5. Call `get_dag_draft_diagram` after each change, `validate_dag` when done

## How to think through this skill

<|think|>
- Have I loaded the catalogue before designing — am I working from the actual available components, not memory?
- Have I planned the full adjacency list before calling any tool — do I know every node and every edge?
- Am I creating all nodes first and wiring second, or am I mixing the two and losing track of what exists?
- After a delete_node, have I immediately rewired the orphaned children before doing anything else?
- Does the draft diagram match the adjacency list I planned — are there any unexpected orphans or missing edges?
