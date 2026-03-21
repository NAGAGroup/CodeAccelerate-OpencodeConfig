# INFO: Debug Validity Checklist

Before finalizing, verify your investigation DAG will be well-formed:

## Checklist

- [ ] **Entry node exists** — DAG has clear starting point (reproduce or overview)
- [ ] **All nodes reachable from entry** — No orphaned investigation steps
- [ ] **At least one terminal path** — All investigation paths lead to finalize
- [ ] **Diagnosis loops have ≥2 nodes** — Loops include evaluation nodes
- [ ] **Evaluation nodes branch** — Every diagnosis loop has evaluation node with exit condition
- [ ] **Loop visit counters set** — Diagnosis loops have `remaining_visits` configured
- [ ] **Hypothesis gates are clear** — Each gate explains which hypothesis is likely based on evidence
- [ ] **Diagnosis steps are scoped** — Each step tests one or two hypotheses
- [ ] **Dependencies explicit** — If a step needs output from another, that's clear
- [ ] **Prompts will be written** — Each node will have a prompt file

## If You Fail Any Check

Go back and refine. Call the appropriate `next_step()` to loop.

## If You Pass All Checks

Call `next_step()` to review debug-specific principles.
