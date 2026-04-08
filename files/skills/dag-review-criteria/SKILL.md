---
name: dag-review-criteria
description: Teaches how to evaluate execution DAGs — structural anti-patterns, specialist node assessment, complexity analysis, and sophisticated routing patterns.
---
# What does this skill teach?

In this skill, you learn how to evaluate a first-pass execution DAG and produce actionable critique that will guide a second-pass reviser. Your job is split into two parts: quick structural validation, then deep analysis of what the DAG is missing or could do better.

You are NOT building or fixing the DAG — you are analyzing it and recommending improvements. You do not need to know how to build a DAG. You need to know what a good DAG looks like and what questions to ask yourself to find the gaps.

## Part 1: Structural Validation (Quick Pass)

Check these structural rules. If any are violated, flag them — but do not spend the bulk of your review here. The first-pass designer is reliable at getting structure right. These are safety nets, not the main event.

### Rules

- Every path terminates at a leaf node — no dead ends
- Every `verify` node has exactly 2 children (pass and fail)
- Every `decision-gate` has exactly 2 children
- Every leaf node is a `write-notes` node
- No orphaned nodes or disconnected subgraphs
- Branches are mutually exclusive — no parallel work

### Anti-patterns to flag

- **Unbounded work chains**: Three or more `work-item` nodes in sequence with no `verify` between them — work should be verified incrementally
- **Missing investigation**: A `work-item` node that operates on unfamiliar territory with no preceding `project-search-and-analysis` — the executor needs to understand the current state before mutating it
- **Verify without fix path**: A `verify` node whose fail path goes directly to a `write-notes-failure` leaf with no attempt to fix — at minimum, one retry should be attempted unless the planning context explicitly explains why not
- **Over-retrying**: More than 2 retries for a single verify chain on a simple task — diminishing returns
- **Dead-end decision gates**: A `decision-gate` where both branches lead to essentially the same path — the gate adds complexity without value

## Part 2: Deep Analysis (The Main Event)

This is the bulk of your review. The first-pass DAG uses only core components. Your job is to assess whether the plan needs specialist nodes, more sophisticated routing, or structural improvements that the first-pass designer was not asked to consider.

The caller will provide **tentative answers** from the orchestrator's assessment of these questions. Use those as starting points — agree, disagree, or refine them based on your own analysis of the DAG structure and the planning context.

### External Research Assessment

Ask yourself these questions for every plan:

1. **Does the task involve external dependencies, APIs, frameworks, or libraries?** If yes, `research` or `deep-research` nodes are almost certainly needed. External scouting is cheap — err on the side of including it.
2. **How confident are the agents in their understanding of the external tools and technologies involved?** If there is any uncertainty — even mild — recommend a `research` node. The cost of scouting is far lower than the cost of implementing against wrong assumptions.
3. **Is the initial planning-phase research sufficient, or does execution need its own research?** The planning scout focuses on understanding the problem for planning purposes. Execution may need deeper, more targeted research focused on implementation specifics — API details, library behavior, configuration patterns.
4. **Are there assumptions from the planning phase that should be verified before committing to work?** If the scout or external-scout reported anything with low confidence, recommend a `research` node positioned before the work that depends on that assumption.

**Default stance:** If external dependencies are involved, recommend research. Period. The question is where to place it and whether `research` (with user gate) or `deep-research` (without gate) is appropriate.

### Complexity-Adaptive Routing

Ask yourself whether the DAG should include execution-phase investigation that determines the execution strategy:

1. **Is the task's true complexity knowable only after investigation?** Consider whether the DAG should include a **short path / long path** pattern: initial `project-search-and-analysis` phases that assess the real scope, followed by a `decision-gate` that routes to either a quick execution path (for simpler-than-expected cases) or a thorough path (for complex cases).
2. **Would a naive linear approach risk wasting effort?** If the task might turn out to be trivial once investigated, a complexity-adaptive routing pattern prevents unnecessary work. If it might turn out to be much harder than expected, the long path ensures adequate coverage.
3. **Are there multiple valid implementation approaches where the right choice depends on what the executor discovers?** This is a strong signal for a `decision-gate` that routes based on investigation findings.

### Cascading Decision Analysis

Ask yourself about nested decision patterns:

1. **Are there decisions that can only be made after a prior decision has been executed?** If so, cascading `decision-gate` nodes — where each builds on the findings of the previous path — may be warranted.
2. **Would a single decision gate at the top be a false simplification?** Sometimes what looks like one decision is actually a sequence of dependent decisions. Each narrows the execution strategy progressively.

### Retry Count Assessment

For each `verify` node in the DAG:

1. **How complex is the work being verified?** Simple, well-understood mutations → 1 retry is sufficient. Complex, multi-file, or integration-sensitive work → 2 retries may be warranted.
2. **How likely is the first fix attempt to succeed?** If the failure mode is predictable (e.g., a test failure with clear error messages), 1 retry is enough. If the failure mode is ambiguous or could require multiple approaches, recommend more retries.
3. **What is the blast radius of the work?** Changes that touch many files or cross module boundaries are harder to fix in one shot — recommend 2 retries.

### User Interaction Assessment

1. **Are there points in the execution where user input would prevent wasted effort?** If the task involves ambiguous requirements, aesthetic choices, or decisions that depend on user preference, recommend `user-discussion` or `user-decision-gate` nodes.
2. **Would the user benefit from reviewing intermediate results before proceeding?** Long-running plans that produce partial results should consider user checkpoints.
3. **Is autonomous work appropriate?** Only if the user explicitly approved it during planning. If not, do not recommend `autonomous-work`.

### Execution-Phase Investigation

1. **Does the execution DAG include enough investigation before work?** The planning scout provides a broad overview, but the executor may need targeted investigation of specific files, patterns, or dependencies before each work phase.
2. **Should `project-search-and-analysis` nodes precede major work phases?** Especially if the work depends on understanding current code structure, existing patterns, or integration points that the planning scout didn't explore in depth.

## How to structure your critique

For each finding, provide:
1. **The specific node IDs involved** — always ground your critique in the actual DAG structure
2. **What the issue or opportunity is** — describe concretely what you observed
3. **Your recommendation** — what you think the reviser should consider changing
4. **Your reasoning** — why this improvement matters for the execution outcome

Organize your critique in priority order: the most impactful improvements first.

## How to think through this skill

<|think|>
- Have I completed the quick structural pass before moving to deep analysis?
- Am I spending the bulk of my review on Part 2 (deep analysis), not Part 1 (structural validation)?
- For external research: Have I considered every external dependency and assessed confidence levels? Am I erring on the side of including research nodes?
- For complexity routing: Have I considered whether the task's true complexity is uncertain and whether a short/long path pattern would help?
- For retries: Am I assessing each verify chain individually based on the complexity of its associated work, not applying a blanket count?
- For user interaction: Have I identified points where user input would prevent wasted effort?
- Am I grounding every critique in specific node IDs with evidence?
- Am I recommending improvements, not proposing specific DAG restructurings? The reviser builds — I critique.
