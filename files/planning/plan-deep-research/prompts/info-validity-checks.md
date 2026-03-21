# INFO: Research Validity Checklist

Before finalizing, verify your research DAG will be well-formed:

## Checklist

- [ ] **Entry node exists** — DAG has clear starting point
- [ ] **All nodes reachable from entry** — No orphaned research steps
- [ ] **At least one terminal path** — All research paths lead to finalize
- [ ] **Research loops have ≥2 nodes** — Loops include synthesis/evaluation nodes
- [ ] **Evaluation nodes branch** — Every research loop has evaluation with exit condition
- [ ] **Loop visit counters set** — Evidence-gathering loops have `remaining_visits` configured
- [ ] **Angle gates are clear** — Gates explain which angles to explore based on preliminary findings
- [ ] **Research steps are scoped** — Each step investigates defined angles
- [ ] **Evidence paths are explicit** — Sources and synthesis flow are clear
- [ ] **Prompts will be written** — Each node will have a prompt file

## If You Fail Any Check

Go back and refine. Call the appropriate `next_step()` to loop.

## If You Pass All Checks

Call `next_step()` to review research-specific principles.
