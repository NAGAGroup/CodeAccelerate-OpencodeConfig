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

## Linear Sequence

Call `add_node` once per node. Each becomes the single child of its parent.

add_node(plan_name="demo", parentId="execution-kickoff", nodeId="investigate-structure", component_name="project-search-and-analysis")
add_node(plan_name="demo", parentId="investigate-structure", nodeId="implement-feature", component_name="work-item")
add_node(plan_name="demo", parentId="implement-feature", nodeId="verify-feature", component_name="verify")
add_node(plan_name="demo", parentId="verify-feature", nodeId="commit-feature", component_name="commit")
add_node(plan_name="demo", parentId="commit-feature", nodeId="done", component_name="plan-success")

Result:

execution-kickoff → investigate-structure → implement-feature → verify-feature → commit-feature → done

## Branching

Call `add_node` multiple times with the same `parentId`. Each call adds a branch. Branches must have ≥2 options.

add_node(plan_name="demo", parentId="investigate-config", nodeId="use-json", component_name="work-item")
add_node(plan_name="demo", parentId="investigate-config", nodeId="use-yaml", component_name="work-item")

# build out each branch
add_node(plan_name="demo", parentId="use-json", nodeId="verify-json", component_name="verify")
add_node(plan_name="demo", parentId="use-yaml", nodeId="verify-yaml", component_name="verify")

Result:

investigate-config
  ├── use-json → verify-json
  └── use-yaml → verify-yaml

Store a Qdrant note on the branch parent explaining when to take each branch by exact node ID.

## Convergence

Nodes can have multiple parents. Use `add_parent` to make branches rejoin at a shared node. The shared node executes when either path reaches it. Cycles are not allowed.

Example — both branches converge to a shared commit:

# build the branch
add_node(plan_name="demo", parentId="investigate-config", nodeId="use-json", component_name="work-item")
add_node(plan_name="demo", parentId="investigate-config", nodeId="use-yaml", component_name="work-item")
add_node(plan_name="demo", parentId="use-json", nodeId="verify-json", component_name="verify")
add_node(plan_name="demo", parentId="use-yaml", nodeId="verify-yaml", component_name="verify")

# create the shared node on one branch
add_node(plan_name="demo", parentId="verify-json", nodeId="commit-config", component_name="commit")

# converge the other branch into it
add_parent(target="demo", nodeId="commit-config", new_parent_id="verify-yaml")

# continue from the shared node
add_node(plan_name="demo", parentId="commit-config", nodeId="done", component_name="plan-success")

Result:

investigate-config
  ├── use-json → verify-json ──┐
  └── use-yaml → verify-yaml ──┴── commit-config → done

## Convergence for Retries

A common pattern: verify, branch on pass/fail, fix on failure, then converge back to a shared commit.

# main path
add_node(plan_name="demo", parentId="execution-kickoff", nodeId="implement-auth", component_name="work-item")
add_node(plan_name="demo", parentId="implement-auth", nodeId="verify-auth", component_name="verify")

# branch: pass or fail
add_node(plan_name="demo", parentId="verify-auth", nodeId="check-auth-result", component_name="decision-gate")
add_node(plan_name="demo", parentId="check-auth-result", nodeId="commit-auth", component_name="commit")
add_node(plan_name="demo", parentId="check-auth-result", nodeId="fix-auth", component_name="work-item")

# retry path: fix → re-verify → converge to shared commit
add_node(plan_name="demo", parentId="fix-auth", nodeId="verify-auth-retry", component_name="verify")
add_parent(target="demo", nodeId="commit-auth", new_parent_id="verify-auth-retry")

# terminal
add_node(plan_name="demo", parentId="commit-auth", nodeId="done", component_name="plan-success")

Result:

implement-auth → verify-auth → check-auth-result
  ├── (pass) ─────────────────────┐
  └── (fail) → fix-auth → verify-auth-retry ──┴── commit-auth → done

Store a Qdrant note on `check-auth-result` explaining the pass/fail branch conditions.

## Deleting a Node

`delete_node` removes a single node. Its children are automatically reparented to the deleted node's parent.

Example — removing `step-b` from `step-a → step-b → step-c → step-d`:

delete_node(target="demo", nodeId="step-b")

Result: step-a → step-c → step-d

## Inserting a Forgotten Node

To insert a node between two existing nodes, add the new node to the parent, then reparent the old child onto the new node.

Example — inserting `investigate-state` between `commit-setup` and `implement-physics`:

add_node(plan_name="demo", parentId="commit-setup", nodeId="investigate-state", component_name="project-search-and-analysis")
set_parent(target="demo", nodeId="implement-physics", new_parent_id="investigate-state")

Result: commit-setup → investigate-state → implement-physics → ...

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
