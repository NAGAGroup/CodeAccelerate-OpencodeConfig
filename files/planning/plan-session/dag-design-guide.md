# DAG Design Guide

Teaches @dag-designer how to compose execution DAGs. You design work structure — component types, node names, and parent-child relationships. You do not write prompts, configure enforcement sequences, or delegate to subagents. Selecting a component assigns its prompt and enforcement automatically.

## Tools Overview

**Construction:** `add_node` to append a node. `set_parent` to move a node to a single new parent (removes from all current parents). `add_parent` to add an additional parent (enables convergence). `delete_node` to remove a single node (children are reparented to the deleted node's parent automatically).

**Inspection:** `show_dag` for full JSONL with enforcement sequences. `show_compact_dag` for collapsed ASCII diagram.

**Validation:** `validate_dag` to check schema, duplicate IDs, and prompt discoverability. Always run after completing or modifying a DAG.

**Context:** `get_planning_components_catalogue` for available component types. `get_dag_design_guide` for this document. Always load the catalogue before designing.

## Node IDs

Every ID must be unique across the entire DAG. Use descriptive names: `investigate-auth-state`, `verify-physics`, `commit-setup`. When reusing a component type, add distinguishing suffixes: `verify-setup`, `verify-physics`, `verify-final`. Never use `node-1`, `step-3`, or bare component names.

## Execution Model: Sequential Only

**All execution is sequential. There is no parallelism.** At any point in time, exactly one node is executing. The DAG is a directed graph of sequential steps, not a parallel workflow.

Branches are not parallel paths — they are mutually exclusive execution paths. When a decision gate chooses branch A, branch B becomes permanently unreachable in that execution. Only one path through the DAG executes.

## Branching

Branches represent alternative execution paths where only one will ever run. A decision gate evaluates evidence and chooses one branch; the other is unreachable from that point forward.

**Use branches for:**
- **Execution decisions** — the outcome of a verification or check determines which path to take (pass vs. fail)
- **User decisions** — the user chooses between options that lead to meaningfully different work
- **Verification failure retries** — a fix path that rejoins the main path after the fix passes verification

**Never use branches to represent work that should happen in parallel.** If two things both need to happen, they are sequential nodes on the same path, not branches.

**Example — verification failure retry:**
```
work-item → verify → decision-gate
                         ├─ (pass) → commit
                         └─ (fail) → fix-work → verify-fix → commit  [convergence]
```
The fix path and the pass path converge at `commit`. Both branches eventually reach the same next step.

**Example — extra work decision:**
```
decision-gate
    ├─ (needs-migration) → run-migration → verify-migration → deploy  [convergence]
    └─ (no-migration) → deploy
```
One path requires extra steps before reaching the shared `deploy` node. The other skips straight to it.

## Convergence

Convergence is when two branches rejoin at a shared node. Use `add_parent` to wire a second parent onto the convergence node.

**When to converge:**
- A fix-and-retry path that rejoins the main path after the fix passes verification
- A slow path (extra work required) and a fast path (no extra work) that both continue with the same subsequent steps

**The convergent node does the same work regardless of which path arrived.** It does not need to know which branch was taken.

## Deleting Nodes

When deleting nodes immediately run `show_compact_dag` and `show_dag` to reason about the post-deletion DAG structure and what nodes need to be re-parented following the deletion.

## Problem Decomposition, Not Task Decomposition

Design the DAG as a shape of work types and decision points — not as a script of specific actions. The planner's job is to identify what kinds of work are needed and in what order, not to prescribe what files to edit or what code to write.

**Problem decomposition (correct):** "We need to understand the current auth state before changing it, then implement the change, then verify it works. If verification fails, we need a path to fix and re-verify."

**Task decomposition (wrong):** "Edit auth.js line 42, add the JWT library, update the middleware to call validateToken()."

The executor discovers the specifics. The planner shapes the structure. Node IDs and component choices encode the planner's intent — the executor reads that structure and the planning notes to understand what each node is for.

## Design Rules

- Investigate before work: place `project-search-and-analysis` before `work-item`
- Verify after each change: `work-item → verify`, never batch multiple work-items before one verify
- Commit after verified changes: `verify → commit`
- Compress at phase boundaries: `write-notes → compress → kickoff-refresher` — never skip the refresher
- Failure paths end in `plan-fail`, never `plan-success`
- Store design rationale to Qdrant after building — write intent, not prescriptive steps
- Run `validate_dag` when the DAG is complete
- Call `show_compact_dag` frequently to visualize the plan as you build
