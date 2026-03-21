# INFO: Collaboration Validity Checklist

Before finalizing, verify your collaboration DAG will be well-formed:

## Checklist

- [ ] **Entry node exists** — DAG has clear starting point
- [ ] **All nodes reachable from entry** — No orphaned design steps
- [ ] **At least one terminal path** — All paths lead to finalize
- [ ] **Dialogue loops have ≥2 nodes** — Loops include user feedback nodes
- [ ] **User gates are clear** — Gates explain what the user is deciding
- [ ] **Loop visit counters set** — Feedback loops have `remaining_visits` configured
- [ ] **Design steps are scoped** — Each step produces a deliverable
- [ ] **User input is explicit** — Clear feedback points at each step
- [ ] **Artifact is defined** — Output of collaboration is clear
- [ ] **Prompts will be written** — Each node will have a prompt file

## If You Fail Any Check

Go back and refine. Call the appropriate `next_step()` to loop.

## If You Pass All Checks

Call `next_step()` to review collaboration-specific principles.
