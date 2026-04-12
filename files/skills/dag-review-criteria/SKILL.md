---
name: dag-review-criteria
description: Criteria for reviewing prose phase plans — ownership, research coverage, structure, and completeness.
---
<rules>
Always work through all four questions in order.
Always ground every finding in the specific phase it concerns — reference phase IDs.
Never manufacture issues — include only findings with real impact.
</rules>

<review>

Question 1 — Ownership.
Does the plan correctly assign who decides what?
- User preference, creative choices, or scope that isn't fully defined → user-discussion.
- Executor can decide from accumulated evidence → agentic-decision-gate.
Flag any agentic gate making a decision that belongs to the user: creative direction, preference between options, anything the user hasn't explicitly delegated to the executor.

Question 2 — Research prerequisites.
For every work phase, all three of the following must immediately precede it in this order:
1. project-survey covering the area of the codebase this phase touches.
2. external-research if the phase involves, uses, or configures any external library, API, tool, or package manager. This is a hard requirement — training data is not sufficient, and this must appear throughout the plan as new external dependencies are encountered, not only at the start.
3. internal-research targeting specific questions this work phase needs answered before implementation begins.
Missing any of these before a work phase is a hard finding. Over-researching is always preferable to under-researching.

Question 3 — Structure.
- Does every branching phase (agentic-decision-gate, user-discussion with branches) have at least 2 direct child phases?
- Do branches split immediately from the gate — not deferred? A gate that continues sequentially before the branching occurs is wrong.
- Is every leaf phase a write-notes or early-exit?

Question 4 — Completeness.
What is obviously missing from the plan? Flag:
- Dependency installation or environment setup before work phases that need it.
- User involvement phases where scope is clearly undefined or creative.
- Idea or concept selection where the user needs to decide what to build.
- Source cleanup or other prerequisites stated by the user.
- Research gaps relative to what work phases actually depend on.

</review>
