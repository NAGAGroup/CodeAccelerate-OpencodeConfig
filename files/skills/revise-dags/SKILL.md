---
name: revise-dags
description: Teaches how to revise an existing execution DAG — inserting nodes, extending retries, rerouting paths, and incorporating specialist components from the full catalogue.
---

# What does this skill teach?

In this skill, you learn how to take an existing, structurally valid DAG and improve it based on reviewer feedback. You are modifying an existing structure, not building from scratch.

## Your job

Read the existing DAG, understand the reviewer's critique, plan your changes as a diff, and execute them precisely. Every change should be traceable to a critique point or a structural improvement you identified.

## How to start every revision

1. Call `get_planning_components_catalogue` with `variant="full"` — you have access to all specialist nodes
2. Call `get_compact_dag_draft` to read the current structure
3. Read the reviewer's critique carefully — map each point to a specific structural change
4. Plan all changes before touching the DAG

## Rules that must hold after revision

- Every `verify` node has exactly 2 children
- Every `decision-gate` and `user-decision-gate` has exactly 2 children
- Every leaf node is a `write-notes` node
- No cycles, no dead ends, no orphaned nodes

## Revision patterns

### Inserting a node mid-chain

When the reviewer says "insert X between A and B," use `insert_between`:
insert_between(plan_name, from="A", new_node="X", to="B")

This atomically removes the A→B edge and adds A→X→B. **Never** manually delete an edge and add two new ones when `insert_between` works — that risks leaving stale edges or creating >2 children.

### Extending a retry chain

To increase retries from 1 to 2 on a verify chain like:
work → verify → [next-phase, fix-1]
fix-1 → retry-1 → [next-phase, failure-notes]

1. Add the new nodes: `fix-2` (work-item), `retry-2` (verify)
2. Delete the edge: `retry-1 → failure-notes`
3. Wire: `retry-1 → fix-2`, `fix-2 → retry-2`, `retry-2 → [next-phase, failure-notes]`

The failure-notes leaf moves to the end of the new chain.

### Rerouting a failure path

To change where a failure exits — for example, routing to `user-discussion` instead of terminating:

1. Add the new target node if it doesn't exist
2. Delete the edge from the failure leaf to its current terminal
3. Wire the failure leaf to the new target
4. Ensure the new path still terminates at a `write-notes` leaf

### Adding a specialist node to a new branch

When adding a node that creates a new decision point (e.g., adding `user-decision-gate` after a work phase):

1. Add the gate node and both branch targets
2. Use `insert_between` to place the gate where the reviewer specified
3. Wire the gate's second branch to its target
4. Ensure both branches terminate at `write-notes` leaves

## Revision procedure

### Step 1: Plan the diff

<|think|>
After reading the DAG and the critique, write out:
- Nodes to add (with component types)
- Insertions: which node goes between which existing pair
- Retry extensions: which chains need more depth
- Edge removals: which connections need to change
- Edge additions: which new connections are needed

### Step 2: Add all new nodes

Call `add_nodes_to_dag` once with all new nodes. Do not wire anything yet.

### Step 3: Execute structural changes

For each change:
1. Use `insert_between` for mid-chain insertions
2. Use `delete_edge` + `connect_nodes` only when `insert_between` doesn't apply (e.g., extending retry chains, rerouting failure paths)
3. Call `get_compact_dag_draft` after each change to verify

### Step 4: Set entry and exit points

1. Call `set_entry_point` with the first work node
2. Call `set_exit_point` for every leaf node
3. Call `validate_dag`

## How to think through this skill

<|think|>
- Am I modifying an existing DAG, not rebuilding it?
- Have I mapped every critique point to a specific structural change?
- Am I using `insert_between` for mid-chain insertions instead of manual delete+add?
- After each change, did I check `get_compact_dag_draft` to verify the structure?
- Are all leaves still `write-notes` nodes after my changes?
- Did I plan the full diff before making any changes?
