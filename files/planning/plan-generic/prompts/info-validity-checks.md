# INFO: Validity Checklist

Before finalizing, verify your project DAG will be well-formed:

## Checklist

- [ ] **Entry node exists** — Your DAG has a clear starting node
- [ ] **All nodes reachable from entry** — No orphaned nodes
- [ ] **At least one terminal path** — All paths lead to a node with no `next` (finalize)
- [ ] **Loops have ≥2 nodes** — No single-node loops
- [ ] **Loop branching exists** — Every loop has a branching node that allows exiting
- [ ] **Loop visit counters set** — Looping nodes have `remaining_visits` configured
- [ ] **Gates have proper branching** — Each gate has 2+ `next` options with descriptions
- [ ] **Subtasks are scoped** — Each step is assignable to an agent
- [ ] **Dependencies are clear** — If subtasks have prerequisites, that's explicit
- [ ] **Prompts will be written** — Each node will have a prompt file

## If You Fail Any Check

Go back and refine. Call the appropriate `next_step()` to loop.

## If You Pass All Checks

Call `next_step()` to review generic-specific principles.
