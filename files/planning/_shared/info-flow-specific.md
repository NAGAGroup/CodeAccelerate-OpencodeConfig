# Info: Flow-Specific Considerations — {{DAG_TYPE}}

{{#if isGeneric}}
## For Generic Planning Sessions

Generic planning is for features, refactors, and migrations. Key reminders:

- **Q&A loop is critical** — clarify → assess → clarify cycles gather the context needed for good decomposition
- **Subtask granularity** — aim for 3-9 subtasks; fewer than 3 is too simple, more than 9 needs splitting
- **Parallel work** — group independent parallel tasks into single nodes; parallel happens *within* a node
- **User gates** — typically only at review-gate; auto flow is fine for most sessions
{{/if}}

{{#if isDebug}}
## For Debug Planning Sessions

Debug planning is for bug investigations and incident response. Key reminders:

- **Hypothesis formation** — focus on forming testable hypotheses, not chasing symptoms
- **The diagnose → fix → verify loop** — this is the core of debug sessions
- **Evidence over assumption** — every claim should trace back to observed behavior
- **No premature gates** — let the investigation flow; gates can block discovery
{{/if}}

{{#if isCollaborative}}
## For Collaborative Planning Sessions

Collaborative planning is for open-ended exploration and design. Key reminders:

- **No forced gates** — the exploratory nature is the point; don't gate the creativity
- **Seed plan** — focus on the initial seed plan and living spec approach
- **User steering** — collaborative sessions are user-driven; follow their direction
- **Output artifacts** — plan.json + spec.md (living document, not static spec)
{{/if}}

{{#if isDeepResearch}}
## For Deep Research Sessions

Deep research is for research-centric exploration. Key reminders:

- **Research loop** — research-execute → accumulate → assess cycles build knowledge progressively
- **Research gate** — user approval at research-gate to steer the direction
- **Iteration planning** — each iteration should have a clear research question
- **Evidence synthesis** — accumulate findings before deciding to continue or exit
{{/if}}

{{#if isDeepReview}}
## For Deep Review Sessions

Deep review is for code review and inspection. Key reminders:

- **Review criteria** — define what "done" looks like for the review
- **The review loop** — review → assess → review cycles for thorough inspection
- **Gate at decision** — review-gate for user approval of findings
- **Evidence-based** — all findings should reference specific code/behavior
{{/if}}

## Advance

Call `next_step()` to proceed to schema reference.
