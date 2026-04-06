```markdown
# DAG Design Guide

Teaches @dag-designer how to compose execution DAGs. You design work structure — component types, node names, and parent-child relationships. You do not write prompts, configure enforcement sequences, or delegate to subagents. Selecting a component assigns its prompt and enforcement automatically.

## Tools Overview

**Construction:** `add_node` to append a node. `set_parent` to move a node to a single new parent (removes from all current parents). `add_parent` to add an additional parent (enables convergence). `delete_node` to remove a single node (children are reparented to the deleted node's parent automatically).

**Inspection:** `show_dag` for full JSONL with enforcement sequences. `show_compact_dag` for collapsed ASCII diagram.

**Validation:** `validate_dag` to check schema, duplicate IDs, and prompt discoverability. Always run after completing or modifying a DAG.

**Context:** `get_planning_components_catalogue` for available component types. `get_dag_design_guide` for this document. Always load the catalogue before designing.

## Node IDs

Every ID must be unique across the entire DAG. Use descriptive names: `investigate-auth-state`, `verify-physics`, `commit-setup`. When reusing a component type, add distinguishing suffixes: `verify-setup`, `verify-physics`, `verify-final`. Never use `node-1`, `step-3`, or bare component names.

## Branching

Branching occurs when multiple nodes share the same parent via add_node calls, this is useful for decision gates where the two paths represent independent, non-converging execution paths.

## Convergence

Branching can be made convergent by adding multiple parents to a single node. This is useful for verification fixes where, once fixed, execution should resume back on the standard path. It's also useful after decision gates that decide extra work is necessary before resuming the same path.

## Deleting Nodes

When deleting nodes immediately run `show_compact_dag` and `show_dag` to reason about the post-deletion DAG structure and what nodes need to be re-parented following the deletion.

## Design Rules

- Investigate before work: place `project-search-and-analysis` before `work-item`
- Verify after each change: `work-item → verify`, never batch multiple work-items before one verify
- Commit after verified changes: `verify → commit`
- Compress at phase boundaries: `write-notes → compress → kickoff-refresher` — never skip the refresher
- Failure paths end in `plan-fail`, never `plan-success`
- Store design rationale to Qdrant after building — write intent, not prescriptive steps
- Run `validate_dag` when the DAG is complete
- You must call show_compact_dag frequently to visualize the plan as you build
```

