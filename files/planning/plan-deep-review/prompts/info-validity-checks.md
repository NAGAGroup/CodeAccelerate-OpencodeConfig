# INFO: Review Validity Checklist

Before finalizing, verify your review DAG will be well-formed:

## Checklist

- [ ] **Entry node exists** — DAG has clear starting point
- [ ] **All nodes reachable from entry** — No orphaned review steps
- [ ] **At least one terminal path** — All paths lead to finalize
- [ ] **Coverage is clear** — Each review criterion/area has an assessment step
- [ ] **No unnecessary loops** — Review is mostly linear; loops only if findings trigger deeper evaluation
- [ ] **Gates are justified** — If present, gates are based on assessment findings
- [ ] **Assessment steps are scoped** — Each step evaluates specific criteria or areas
- [ ] **Synthesis step exists** — Review findings are integrated into a report
- [ ] **Report structure defined** — What will the review output contain?
- [ ] **Prompts will be written** — Each node will have a prompt file

## If You Fail Any Check

Go back and refine. Call the appropriate `next_step()` to loop.

## If You Pass All Checks

Call `next_step()` to review review-specific principles.
