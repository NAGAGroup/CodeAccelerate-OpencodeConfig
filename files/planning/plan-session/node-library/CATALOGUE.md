# Node Library Catalogue

This catalogue documents all reusable node templates for project DAGs. Each node is a building block the planning agent composes into a DAG during the `propose-structure` and `propose-decomposition` phases.

## How to use this catalogue

During planning, HeadWrench reads this file to understand what nodes exist and when to use them. The `node-library/` directory ships with the planning scaffolds and is copied locally when a planning session activates. Node templates live in subdirectories — each contains:

- `plan.json` — the node schema (id, prompt, todo; `next` is omitted and set dynamically)
- `README.md` — when to use this node, decisions the planning agent must resolve
- `prompt-template.md` — scaffold the planning agent fills in when writing the node's prompt

---

## Structural Primitives

DAGs are composed from three primitives:

**Sequence** — Nodes chained linearly. One completes, the next begins. Use when steps have a fixed order.

**Branch** — A node with multiple `next` entries, each with a `when` condition. The DAG forks based on a user decision (`question` todo) or agent output (`bash` exit code). Use when the path forward can't be determined until runtime.

**Iteration (Unrolled)** — A build-test-fix pattern repeated N times, with an exit branch after each cycle. There is no looping primitive — iteration is implemented as a repeated sequence of nodes with a branch to exit or retry. Plan the maximum cycle count upfront; the user or agent picks the exit branch when success is reached.

---

## Node Reference

### Entry / Terminal

| Node | Todo | Use when |
|---|---|---|
| [`session-overview`](#session-overview) | `[]` | Always the entry node. Orients HW before execution begins. |
| [`output-success`](#output-success) | `[]` | Terminal: plan succeeded. |
| [`output-failure`](#output-failure) | `[]` | Terminal: plan failed after exhausting retries or hitting a hard stop. |

### Exploration

| Node | Todo | Use when |
|---|---|---|
| [`scout-parallel`](#scout-parallel) | `["task","task","task"]` | Need broad codebase coverage before acting. Three scouts run in parallel. |
| [`analyze-deep`](#analyze-deep) | `["task"]` | Need multi-file reasoning that haiku can't handle. One ContextInsurgent. |

### Decision

| Node | Todo | Use when |
|---|---|---|
| [`decision-gate`](#decision-gate) | `["question"]` | User must choose a path at runtime. |
| [`sequential-thinking`](#sequential-thinking) | `["sequential-thinking_sequentialthinking"]` | HW needs to reason through a non-obvious decision before acting. |

### Execution

| Node | Todo | Use when |
|---|---|---|
| [`parallel-tasks`](#parallel-tasks) | `["task","task","task"]` | Multiple independent edits or dispatches can run concurrently. |
| [`verification-check`](#verification-check) | `["task"]` | Need to run build, tests, or lint and verify results. |
| [`conditional-branch`](#conditional-branch) | `[]` | Branch on a condition inferable from prior context (exit code, agent output, file check). Plugin presents branches; HW calls `next_step`. |
| [`compression-node`](#compression-node) | `["task"]` | Context window is large; synthesize scout/agent output before proceeding. |

### Escape Hatch

| Node | Todo | Use when |
|---|---|---|
| [`generic`](#generic) | flexible | None of the above fit. Custom todo sequence. |

---

## Node Details

### `session-overview`
Entry node. No todo — auto-advances immediately. The prompt orients HeadWrench on the session goal, what will happen, and what success looks like. Always the first node in every project DAG.

### `scout-parallel`
Dispatches three `@ContextScout` agents in parallel via three sequential `task` calls (plugin enforces sequential calls; scouts run concurrently inside OpenCode). Each scout covers a different area: affected files, architecture/patterns, and dependencies/boundaries. Planning agent specifies each scout's target in the prompt. Do not send scouts into .opencode/ session directories — completed sessions are stale and may conflict with the actual codebase.

### `analyze-deep`
Dispatches one `@ContextInsurgent` to perform deep multi-file reasoning. Use after `scout-parallel` when scout output needs synthesis, or when a task requires understanding complex cross-file logic. One `task` call — expensive, serial. Do not instruct ContextInsurgent to read .opencode/ session directories — completed sessions are stale.

### `sequential-thinking`
HeadWrench calls the `sequential-thinking` MCP tool directly to reason through a non-obvious decision. Use before branching decisions, architectural choices, or debug hypotheses. The prompt frames the decision and expected output. No agent dispatch.

### `decision-gate`
Presents a choice to the user and branches based on their answer. The prompt must instruct HW to use the `question` tool with options that map to branch `when` conditions. One `question` call; `next` is an array of branches.

### `parallel-tasks`
Dispatches multiple `@JuniorDev` (or other haiku) agents in parallel for independent work. Three `task` calls by default — adjust count to match the number of independent subtasks. Planning agent defines each task's scope and target files.

### `verification-check`
Dispatches HW as a subagent to run build/test commands and verify results. The planning agent fills in the exact commands and acceptance criteria during DAG authoring. One `task` call. Typically followed by a branch (`decision-gate` or `conditional-branch`) on pass/fail.

### `conditional-branch`
No todo — auto-advances to the plugin's branch prompt. The prompt describes the condition and what each branch means. HW evaluates the condition from prior context and calls `next_step` with the correct branch. Use when the decision is machine-readable and requires no new tool calls.

### `compression-node`
Dispatches `@ContextInsurgent` to synthesize and compress accumulated context. Use when scout output or multi-step agent work has filled the context window and key findings need crystallization before proceeding. One `task` call — the agent calls the `compress` tool internally. Source material for compression should come from codebase exploration, not .opencode/ session directories.

### `output-success`
Terminal node. No todo. The prompt tells HW what to communicate to the user on success: summary, artifacts produced, next steps.

### `output-failure`
Terminal node. No todo. The prompt tells HW what to communicate on failure: what was attempted, what failed, and recovery options.

### `generic`
Escape hatch. No fixed todo — the planning agent defines the todo array and prompt freely. Use when no template fits. Document the rationale in the prompt.

---

## Iteration Pattern

Loops are implemented as unrolled sequences. Example: a build-fix-verify cycle with two retries looks like:

```
verification-check → decision-gate
  ├── pass → output-success
  └── fail → parallel-tasks (fix) → verification-check-2 → decision-gate-2
        ├── pass → output-success-2
        └── fail → output-failure
```

Each branch terminates with its own node instance — `output-success` and `output-success-2` are separate nodes in the tree that happen to contain the same kind of content. The DAG is a tree, not a graph; nodes cannot be shared or referenced by ID across branches.

The planning agent decides the maximum cycle depth during `propose-structure`. Ask the user if uncertain. Deeper loops mean more nodes; two cycles is a reasonable default for most fix loops.

---

## Node ID Conventions

- Use kebab-case: `implement-auth`, `run-tests`
- Repeated nodes get a numeric suffix: `verify-<N>`, `fix-<N>`
- Terminal nodes (`output-success`, `output-failure`) follow the same rule — each branch needs its own instance: `output-success`, `output-success-2`, `output-failure`, etc.
- Entry node is always `session-overview`
- The DAG is a tree — nodes cannot be shared across branches. Every path must have its own complete subtree.
