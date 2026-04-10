---
name: dag-review-criteria
description: Teaches how to evaluate execution DAGs — structural anti-patterns, specialist node assessment, complexity analysis, and sophisticated routing patterns.
---
<rules>
Run Part 1 first — it is mechanical and fast. Any failure is a hard stop; do not proceed to Part 2 until the reviser fixes it.
Part 2 is the bulk of your work — spend the majority of your effort here.
Always ground every finding in specific node IDs with evidence.
Never touch the DAG — produce critiques and recommendations only.
Order findings by impact — most consequential gaps first.
</rules>

<example>
Part 1 — Structural Validation (mechanical checks):

Every verify node has exactly 2 children: a pass path and a fail path.
Every decision-gate and user-decision-gate has exactly 2 children.
Every leaf node is a write-notes node. No other component type may be a leaf.
No dead ends — every node has at least one outgoing edge except write-notes leaves.
No orphaned nodes — every node is reachable from the entry point.
No cycles — no node appears on a path back to itself.
No unbounded work chains — a work-item feeding directly into another work-item with no verify between them is a risk flag.
No verify-without-retry — a verify whose fail path leads directly to write-notes with no fix attempt is a weak pattern unless failure is truly unrecoverable.


Part 2 — Deep Analysis (nine exercises):

Exercise 1 — Research question inventory.
What distinct questions does this plan need answered from external sources? Each answerable question cluster is a trigger for one external-scout node. If answering A changes how you search for B, they are sequential scouts. If independent, flag the ordering rationale.

Exercise 2 — Research currency.
Would any scout's answer be wrong if it had run six months ago? If yes, the scout must explicitly target current information. Flag this as a scout description requirement for the reviser.

Exercise 3 — Decision gates.
At what points will the executor face a choice between approaches? Are there decisions that only become meaningful after a prior decision executes? Those need cascading gates. Is the choice evidence-based (decision-gate) or user preference (user-decision-gate)?

Exercise 4 — Complexity routing.
Is the true scope knowable only after investigation? If the plan might be trivially simple or much harder, route to a short path versus long path. The short path needs its own write-notes exit.

Exercise 5 — User involvement.
Explicit: did the user signal they want checkpoints or approval gates? Implicit: does any decision have high blast radius, be hard to reverse, or represent a significant architectural direction? Use user-decision-gate for binary choices, user-discussion for "here is what I am about to do."

Exercise 6 — Shell prerequisites.
Does any work-item assume state only a shell command can produce? Dependency installation, build artifacts, scaffolded structures — all require a run-project-commands node before the work-item that consumes the result.

Exercise 7 — Commit placement.
After every successful verify on a meaningful unit of work, there should be a commit node before the next phase. Flag any stretch of verify-work-verify-work with no commit between phases.

Exercise 8 — Execution-phase investigation.
Does any work-item operate on territory the executor cannot be assumed to know? If a work phase touches unfamiliar territory, a project-search-and-analysis node should precede it.

Exercise 9 — Retry depth.
Is the default single retry sufficient for each verify node? Flag both over-retried and under-retried chains with reasoning.
</example>
