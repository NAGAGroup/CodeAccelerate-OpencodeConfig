---
name: dag-review-criteria
description: Criteria for reviewing prose phase plans — ownership, research coverage, structure, and completeness.
---
<rules>
Always work through all five criteria in order.
Always ground every finding in the specific phase it concerns — reference phase IDs.
Always make findings actionable — recommend specific content for missing phases, not just flag their absence.
Never manufacture issues — include only findings with real impact.
</rules>

<review>

Criterion 1 — Schema and structure.
Does the plan follow the planning-schema phase block format well enough to be compiled? Flag obvious violations: invalid phase types, missing from: fields on non-first phases, wrong field names. Do not over-focus on formatting — the goal is structural translatability, not perfection.

Criterion 2 — Ownership.
Does the plan correctly assign who decides what?
- User preference, creative choices, or undefined scope → user-discussion.
- Executor can decide from accumulated evidence → agentic-decision-gate.
Flag any agentic gate making a decision that belongs to the user.

Criterion 3 — Work phase scope.
Is each work phase targeted enough to be completed in one focused implementation session? Flag any work phase that combines multiple independent goals, mixes setup with implementation, or would reasonably require multiple distinct coding sessions. Recommend specifically how it should be split.

Criterion 4 — Research and setup prerequisites.
This is the most critical criterion. For each work phase — after any splits from Criterion 3 — evaluate what must appear directly before it and provide specific recommendations for each missing or insufficient phase. For the following, order matters. This is non-negotiable, each step influences how the next operates, so out of order pre-work phases will not produce the intended result. This means project-survey->external-research->internal-research->project-commands->work, for each and every work phase.

1. project-survey (required before every work phase):
Recommend specific survey topics relevant to this work phase. What areas of the codebase does the executor need to understand before starting? Be specific to the phase's goal.

2. external-research (required if the work phase touches any external library, API, CLI tool, package manager, or build dependency):
Recommend specific research questions. What integration patterns, API behavior, build system setup, related package manager info or current best practices do subsequent phases need before starting? Assume training data is stale — specific questions must be answered via web research.

3. internal-research (required before every work phase):
Recommend specific investigation questions about the project. What existing code structure, conventions, or decisions must be understood before implementing this phase?

4. project-commands (required if any of the following are true: a new external dependency must be installed, build configuration must be updated, scaffolding or environment setup is needed):
Recommend specific goals for the project-commands phase. What shell operations must succeed before this work phase can begin?

Criterion 5 — Commits and write-notes.
Are commits present after complex, risky, or integration-heavy work phases? Are write-notes present after major decisions or at meaningful plan checkpoints? Does every leaf phase end in write-notes or early-exit? Flag missing checkpoints and recommend where they should be added.

</review>
