---
name: dag-review-criteria
description: Teaches how to evaluate execution DAGs — structural anti-patterns, specialist node assessment, complexity analysis, and sophisticated routing patterns.
---
<overview>
Run Part 1 first — it is mechanical and fast. Part 2 is the bulk of your review and requires reasoning about what the plan is actually trying to do. Your output is a prioritized list of findings grounded in specific node IDs. You never touch the DAG.
</overview>

<part name="1-structural-validation">
These are mechanical checks. Any failure here is a hard stop — report it and do not proceed to Part 2 until the reviser fixes it.

Every verify node has exactly 2 children: a pass path and a fail path.
Every decision-gate and user-decision-gate has exactly 2 children.
Every leaf node is a write-notes node. No other component type may be a leaf.
No dead ends — every node has at least one outgoing edge except write-notes leaves.
No orphaned nodes — every node is reachable from the entry point.
No cycles — no node appears on a path back to itself.
No unbounded work chains — a work-item or project-search-and-analysis that feeds directly into another work-item with no verify between them is a risk flag (not always wrong, but flag it).
No verify-without-retry — a verify whose fail path leads directly to write-notes with no fix attempt is a weak pattern unless the failure is truly unrecoverable.
</part>

<part name="2-deep-analysis">
Run all nine exercises below. Each has a minimum viable trigger question. If the answer to any trigger question is yes, that is a finding. Report findings with the specific node IDs involved, where the missing node should go, what it depends on, and what depends on it.

Exercise 1 — Research question inventory.
What distinct questions does this plan need answered from external sources? Each answerable question cluster is a trigger for one external-scout node. Scope each scout narrowly — one question per node. If answering question A changes how you would search for B, they are sequential scouts. If they are independent, they can be separate scouts (though still sequential in the DAG — flag the ordering rationale).

Exercise 2 — Research currency.
Would any scout's answer be wrong if it had run six months ago? If yes, the scout must explicitly target current information — latest versions, recent breaking changes, current best practices. Flag this as a scout description requirement for the reviser.

Exercise 3 — Decision gates.
At what points will the executor face a choice between approaches, tools, or strategies? Each choice is a trigger for a decision-gate or user-decision-gate. Ask: are there decisions that only become meaningful after a prior decision has been executed? Those need cascading gates, not a single gate at the top. Is the choice based on evidence the executor can gather, or does it require user preference? Evidence-based is decision-gate; user preference is user-decision-gate.

Exercise 4 — Complexity routing.
Is the true scope of this plan knowable only after an investigation step? If the plan might turn out to be trivially simple (already done, simpler than expected) or much harder (scope explodes), an investigation node followed by a decision-gate routing to a short path versus a long path prevents wasted effort in both directions. The short path needs its own write-notes exit.

Exercise 5 — User involvement.
Explicit trigger: did the user's prompt signal they want checkpoints, approval gates, or to make choices? Implicit trigger: does any decision in this DAG have high blast radius, be hard to reverse, or represent a significant architectural direction? Would a reasonable user want to know this decision is being made before it happens? Use user-decision-gate for binary choices, user-discussion for "here is what I am about to do."

Exercise 6 — Shell prerequisites.
Does any work-item assume state that only a shell command can produce? Dependency installation, build artifacts, scaffolded structures, generated code, initialized submodules — all require a run-project-commands node placed before the work-item that consumes the result.

Exercise 7 — Commit placement.
After every successful verify on a meaningful unit of work, there should be a commit node before the next phase. Meaningful means: if everything from this point forward failed, would you want to roll back to here? Flag any stretch of verify-work-verify-work with no commit between phases.

Exercise 8 — Execution-phase investigation.
Does any work-item operate on territory the executor cannot be assumed to know? Project structure, existing patterns, module internals, file locations — if a work phase touches unfamiliar territory, a project-search-and-analysis node should precede it. The planning scout gives a broad overview; execution-time investigation is targeted and specific.

Exercise 9 — Retry depth.
Is the default single retry sufficient for each verify node? Some operations are brittle and warrant a second retry. Some are deterministic enough that a single retry is overkill. Flag both over-retried and under-retried chains with reasoning.
</part>

<output-format>
Report findings in two sections: Structural Findings (Part 1 results) and Deep Analysis (Part 2 results). For each finding: name the node IDs involved, state what is missing and why it matters, state where the missing node goes and what it connects to. Order findings by impact — the most consequential gaps first.
</output-format>
