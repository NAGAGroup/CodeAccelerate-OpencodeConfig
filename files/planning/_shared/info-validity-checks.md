# Info: DAG Validity Checks — {{DAG_TYPE}}

Before writing plan.json, verify these invariants hold.

## Invariant 1: Every Loop Has an Exit

Every loop node must have at least one branch that does NOT loop back.

**Check**: For each node whose `next` points backward:
- Does it also have a forward branch?
- Can the loop exit, or is it trapped?

**Fix if violated**: Add a non-looping exit branch to the decision node.

## Invariant 2: Every Path Reaches a Terminal Node

Starting from `session-overview`, trace every possible path. Every path must eventually reach a terminal node (no `next` field).

**Check**: For each possible branch sequence:
- Is there a terminal node at the end?
- Can any path cycle forever?

**Fix if violated**: Add terminal nodes or break the cycle.

## Other Validity Checks

- [ ] **No self-referencing nodes**: A node cannot have itself as a `next` target
- [ ] **Schema_version present**: Top-level `schema_version: "1.0"` required
- [ ] **Entry node exists**: `entry` field must match a node ID
- [ ] **All prompt paths valid**: Every `prompt` field points to an existing file
- [ ] **Consistent node IDs**: Every node's `id` matches its key in `nodes`
- [ ] **No orphan nodes**: Every node is reachable from `entry`

## Checklist for {{DAG_TYPE}}

Run through this checklist mentally before finalizing:

```
✓ Loops identified (from info-loop-analysis)
✓ Each loop has exit branch
✓ All paths reach terminal
✓ No self-references
✓ Schema fields present
✓ Entry node exists
✓ Prompt paths valid
✓ Node IDs consistent
✓ No orphan nodes
```

## Advance

Call `next_step()` to summarize your decisions.
