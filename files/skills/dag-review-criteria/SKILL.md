---
name: dag-review-criteria
description: Teaches how to evaluate execution DAGs — structural anti-patterns, specialist node assessment, complexity analysis, and sophisticated routing patterns.
---
# What does this skill teach?

In this skill, you learn how to evaluate a first-pass execution DAG and produce actionable critique that will guide a second-pass reviser. Your review has three parts, in order.

You are NOT building or fixing the DAG — you are analyzing it and recommending improvements. You do not need to know how to build a DAG. You need to know what a good DAG looks like and what questions to ask yourself to find the gaps.

## Part 1: Structural Correctness

Check these structural rules. If any are violated, flag them — but the first-pass designer is reliable at getting structure right. These are safety nets.

### Rules

- Every path terminates at a leaf node — no dead ends
- Every `verify` node has exactly 2 children (pass and fail)
- Every `decision-gate` has exactly 2 children
- Every leaf node is a `write-notes` node
- No orphaned nodes or disconnected subgraphs
- Branches are mutually exclusive — no parallel work

### Anti-patterns to flag

- **Unbounded work chains**: Three or more `work-item` nodes in sequence with no `verify` between them — work should be verified incrementally
- **Missing investigation**: A `work-item` that operates on unfamiliar territory with no preceding `project-search-and-analysis` — the executor needs to understand the current state before mutating it
- **Verify without fix path**: A `verify` whose fail path goes directly to a leaf with no attempt to fix — at minimum, one retry should be attempted
- **Over-retrying**: More than 2 retries for a single verify chain on a simple task — diminishing returns
- **Dead-end decision gates**: A `decision-gate` where both branches lead to the same path — the gate adds complexity without value

## Part 2: What to Add

The first-pass DAG uses only core components. Your job is to determine what specialist nodes are missing. There are three layers to this assessment, each requiring a different approach.

The caller will provide **tentative answers** from the orchestrator's assessment. Use those as starting points — agree, disagree, or refine them based on your own analysis.

### Hard Triggers

These are non-negotiable. If the condition is met, the recommendation follows.

- **Technology decision → external research → implementation.** When a `decision-gate` resolves which technology, library, or framework to use, an `external-scout` node MUST be placed between the decision and the implementation work. The research covers: how to add the dependency, what the API surface looks like, and whether there are environment or platform concerns. This is a sequencing requirement — research comes after the choice is made and before the work begins.
- **`external-scout` vs `deep-research` scope.** `deep-research` is for novel algorithms, cutting-edge approaches, or frontier techniques that require comprehensive autonomous investigation — it is rarely needed. It is NOT for evaluating established options, scoping implementation details, or comparing common tools. Standard `external-scout` (which includes a user approval gate) handles those cases. If a plan uses `deep-research` for routine technology evaluation, flag it as a scope violation and recommend `external-scout` instead.
- **External dependencies → external research.** If the task involves external dependencies, APIs, frameworks, or libraries, an `external-scout` node is almost certainly needed. The cost of scouting is far lower than implementing against wrong assumptions. The question is where to place it, not whether to include it.
- **Shell prerequisites → `run-project-commands`.** The `work-item` executor can edit files but cannot run commands. If any work-item depends on state that only a shell command can produce, a `run-project-commands` node must precede it. The most common case is dependency installation: researching what to add (`external-scout`) and writing code that uses it (`work-item`) are separate from actually installing it (`run-project-commands`). The same principle applies to any command-produced prerequisite — generated code from protobuf/OpenAPI compilers, scaffolded project structures from CLI tools, build artifacts from cmake/make, initialized submodules, or setup scripts that configure the environment. Ask: *does any work-item in this DAG assume something exists that only a shell command can produce?*

### Reasoning Triggers

For some node types, you cannot rely on fixed rules — you need to reason about the specific plan to discover what's needed. The reasoning is scoped: you're answering a specific question, and each answer you find IS the trigger.

**Decisions.** Ask yourself: *What decisions am I seeing that must be made during execution?* Walk through the plan and identify every point where the executor will face a choice — between implementation approaches, between tools, between strategies. Each decision you find is a trigger for a `decision-gate` or `user-decision-gate`. Consider:

- Are there decisions that can only be made after a prior decision has been executed? If so, cascading `decision-gate` nodes may be warranted.
- Would a single decision gate at the top be a false simplification of what is actually a sequence of dependent decisions?
- Is this a decision the executor can make from evidence, or does it require user preference? The former is `decision-gate`, the latter is `user-decision-gate`.

**Complexity routing.** Ask yourself: *Is the task's true complexity knowable only after investigation?* If the plan might turn out to be trivial once investigated, or much harder than expected, consider a short-path / long-path pattern: initial investigation followed by a `decision-gate` that routes to either a quick execution path or a thorough one.

**User checkpoints.** Ask yourself: *Are there points where user input would prevent wasted effort?* Ambiguous requirements, aesthetic choices, or decisions that depend on user preference — these are triggers for `user-discussion` or `user-decision-gate` nodes.

### Open Assessment

Beyond hard triggers and reasoning triggers, consider what else could substantially improve this DAG. There is no prescribed set of things to look for here — every plan is different.

### Retry Count Assessment

For each `verify` node in the DAG, assess the retry count individually:

- **Simple, well-understood work** → 1 retry is sufficient
- **Complex, multi-file, or integration-sensitive work** → 2 retries may be warranted
- **Predictable failure modes** (clear error messages) → 1 retry. **Ambiguous failure modes** → more retries
- **High blast radius** (many files, cross-module) → recommend 2 retries

## Part 3: How to Use Them

This is the bulk of your review. Once you know what nodes to add, the harder question is how to place them — scope, decomposition, sequencing, branching structure, and early-exit pathways.

### Placement and Sequencing

For every node you recommend adding, specify:
- **Where it goes** — which existing nodes it sits between, and why that position matters
- **What it depends on** — what information or decisions must exist before this node executes
- **What depends on it** — what downstream work changes because this node's output is now available

### Decomposition

When recommending `external-scout` nodes, consider how many are needed and what each one covers:
- One broad research node before a work phase, or multiple targeted nodes each covering a specific question?
- If multiple, should they be sequential (each builds on the last) or independent (each covers a different angle)?

### Branching Structure

For every `decision-gate` or `user-decision-gate` you recommend:
- What are the exactly 2 branches? Name them concretely.
- What is the evidence or criteria that determines which branch is taken?
- Do the branches reconverge, or do they lead to different outcomes?
- Are there early-exit opportunities? If one branch discovers the task is impossible or unnecessary, can the DAG exit early through a `write-notes` leaf rather than continuing?

### Early Exits

Look for places where the DAG should be able to terminate early rather than continuing through all phases:
- After investigation reveals the task is unnecessary or already done
- After a decision gate where one branch means "no further work needed"
- After a verify that reveals the scope has changed fundamentally

Each early exit needs its own `write-notes` leaf to capture why execution stopped.

### Execution-Phase Investigation

Does the DAG include enough investigation before work? The planning scout provides a broad overview, but the executor may need targeted investigation of specific files, patterns, or dependencies before each work phase. Should `project-search-and-analysis` nodes precede major work phases?

## How to structure your critique

For each finding, provide:
1. **The specific node IDs involved**
2. **What the issue or opportunity is**
3. **Your recommendation**
4. **Your reasoning**

Organize in priority order: most impactful improvements first.

## How to think through this skill

<|think|>
- Have I completed the structural pass before moving to the deeper analysis?
- For hard triggers: Have I checked every condition and applied the rule mechanically?
- For reasoning triggers: Have I walked through the plan asking the scoped questions? What decisions did I find? What complexity uncertainty exists? Where would user input prevent waste?
- For open assessment: Is there anything else that would substantially improve this plan that the triggers didn't catch?
- For how to use: Have I specified placement, sequencing, and branching for every node I recommended? Am I giving the reviser enough to act on?
- Am I grounding every critique in specific node IDs?
