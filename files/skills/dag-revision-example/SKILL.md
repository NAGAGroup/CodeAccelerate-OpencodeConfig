---
name: dag-revision-example
description: Worked example of DAG revision — inserting nodes mid-chain, extending retry paths, rerouting edges, and avoiding orphans.
---
# DAG Revision Example

This skill provides worked examples of revising an existing DAG. You are not building from scratch — the DAG already exists. Your job is to modify it based on reviewer feedback.

## Starting state

Assume a first-pass DAG that looks like this:

```
(research-framework) → (select-framework) → (notes-framework-selected)
(notes-framework-selected) → (plan-blueprint) → (verify-blueprint) → [fix-blueprint, notes-blueprint-approved]
(fix-blueprint) → (verify-blueprint-retry) → [notes-blueprint-approved, notes-blueprint-failure]
(notes-blueprint-approved) → (research-hookup) → (verify-hookup) → [fix-hookup, notes-hookup-success]
(fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, notes-hookup-failure]
(notes-hookup-success) → (implement) → (notes-complete)
```

## Revision operations

### Pattern 1: Insert a node mid-chain with `insert_between`

**Goal:** Insert an `external-scout` node between `select-framework` and `notes-framework-selected`.

This is the most common revision operation. Use `insert_between` — it atomically removes the old edge and adds the new path in one call. Never do this manually with `delete_edge` + `connect_nodes` — that creates intermediate orphan states and is error-prone.

```
# Step 1: Create the new node
add_node(plan_name="my-plan", nodeId="scout-framework-recipes", component_name="external-scout")

# Step 2: Insert it atomically between the two existing nodes
insert_between(plan_name="my-plan", from="select-framework", to="notes-framework-selected", new_node="scout-framework-recipes")

# Result:
# (select-framework) → (scout-framework-recipes) → (notes-framework-selected)
```

### Pattern 2: Insert a node before a branching point

**Goal:** Insert a `user-decision-gate` between `scout-framework-recipes` and `notes-framework-selected`.

Same pattern — `insert_between` works on any existing edge:

```
add_node(plan_name="my-plan", nodeId="gate-framework-choice", component_name="user-decision-gate")
insert_between(plan_name="my-plan", from="scout-framework-recipes", to="notes-framework-selected", new_node="gate-framework-choice")

# Result:
# (scout-framework-recipes) → (gate-framework-choice) → (notes-framework-selected)
#
# But wait — user-decision-gate needs exactly 2 children (it's a binary decision).
# The insert gave it 1 child (notes-framework-selected). We need to add the second branch.
# For a decision gate, one branch continues and the other typically routes back for more research.
connect_nodes(plan_name="my-plan", edges='{"gate-framework-choice": "research-framework"}')

# Result:
# (gate-framework-choice) → [notes-framework-selected, research-framework]
```

### Pattern 3: Extend a retry path (add more retries to an existing verify-retry chain)

**Goal:** Increase the hookup retry depth from 1 to 2.

The existing chain is:
```
(research-hookup) → (verify-hookup) → [fix-hookup, notes-hookup-success]
(fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, notes-hookup-failure]
```

To add a second retry, you need to intercept the failure exit from `verify-hookup-retry` and route it through a new fix-verify cycle instead:

```
# Step 1: Create the new retry nodes
add_nodes_to_dag(plan_name="my-plan", nodes='{"fix-hookup-2": "work-item", "verify-hookup-retry-2": "verify", "notes-hookup-failure-2": "write-notes"}')

# Step 2: Remove the old failure edge from verify-hookup-retry to notes-hookup-failure
delete_edge(plan_name="my-plan", from="verify-hookup-retry", to="notes-hookup-failure")

# Step 3: Wire the new retry cycle
connect_nodes(plan_name="my-plan", edges='{"verify-hookup-retry": "fix-hookup-2", "fix-hookup-2": "verify-hookup-retry-2", "verify-hookup-retry-2": ["notes-hookup-success", "notes-hookup-failure-2"]}')

# Step 4: The old notes-hookup-failure is now orphaned — delete it since it's been replaced
delete_node(plan_name="my-plan", nodeId="notes-hookup-failure")

# Result:
# (fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, fix-hookup-2]
# (fix-hookup-2) → (verify-hookup-retry-2) → [notes-hookup-success, notes-hookup-failure-2]
```

> **Key insight:** When extending retry paths, always: (1) create new nodes first, (2) remove the old failure edge, (3) wire the new cycle, (4) clean up the orphaned old failure node.

### Pattern 4: Reroute a failure path through a new node

**Goal:** Route `notes-blueprint-failure` through a `user-discussion` node before terminating.

```
# Step 1: Create the new nodes
add_nodes_to_dag(plan_name="my-plan", nodes='{"discuss-blueprint-failure": "user-discussion", "notes-blueprint-failure-final": "write-notes"}')

# Step 2: Disconnect the old failure leaf from its parent
delete_edge(plan_name="my-plan", from="verify-blueprint-retry", to="notes-blueprint-failure")

# Step 3: Wire the new failure path: parent → discussion → final write-notes
connect_nodes(plan_name="my-plan", edges='{"verify-blueprint-retry": "discuss-blueprint-failure", "discuss-blueprint-failure": "notes-blueprint-failure-final"}')

# Step 4: Clean up the old orphaned failure node
delete_node(plan_name="my-plan", nodeId="notes-blueprint-failure")

# Result:
# (verify-blueprint-retry) → [notes-blueprint-approved, discuss-blueprint-failure]
# (discuss-blueprint-failure) → (notes-blueprint-failure-final)
```

### Pattern 5: Insert a prerequisite node before an existing node (multiple parents)

**Goal:** Add a `run-project-commands` node before `research-hookup`. But `research-hookup` has a parent (`notes-blueprint-approved`).

Use `insert_between` — it handles this cleanly:

```
add_node(plan_name="my-plan", nodeId="install-deps", component_name="run-project-commands")
insert_between(plan_name="my-plan", from="notes-blueprint-approved", to="research-hookup", new_node="install-deps")

# Result:
# (notes-blueprint-approved) → (install-deps) → (research-hookup)
```

## Common mistakes to avoid

1. **Never use `delete_edge` + `connect_nodes` when `insert_between` works.** The manual two-step creates intermediate orphan states that confuse later operations. `insert_between` is atomic.

2. **Always `get_compact_dag_draft` after each structural change.** Don't batch multiple changes and check once at the end — verify incrementally so you catch problems early.

3. **Clean up orphaned nodes immediately.** When you `delete_edge` and a node becomes unreachable, either reconnect it or `delete_node` it before continuing. Don't leave orphans accumulating.

4. **Don't re-set entry/exit points during revision.** The headwrench agent clears these before delegating to you. Focus on the structural changes. Entry and exit points are set after you're done.

## Thinking through this skill

<|think|>
- For each critique point, which pattern above applies? Most revision operations are one of these five patterns.
- Am I using `insert_between` for mid-chain insertions instead of manual delete+connect?
- Am I checking `get_compact_dag_draft` after each structural change?
- Am I cleaning up orphaned nodes immediately after they become unreachable?
- Have I written my target adjacency list before making changes?
