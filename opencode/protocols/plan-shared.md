# plan-shared.md — Shared Q&A and Synthesis Steps

These steps are used by all session types after Phase 1 (plan-init.md) and before the type-specific decomposition phase.

## Step 1 — Base Q&A

Use the `question` tool to ask clarifying questions. Cover these categories:

- **Scope / done criteria** — What does "complete" look like? What is the expected output?
- **Constraints / invariants** — What must not change? Are there performance, compatibility, or style constraints?
- **Git workflow** — Should changes go directly to main, or a feature branch? Should HW create commits after each subtask (WIP) or only at the end?
- **Out-of-scope items** — Is anything explicitly excluded from this session?
- **Circuit breaker** — How many consecutive failures before HW stops and surfaces the problem? (default: 3)

Ask all base questions in a single `question` tool call when possible.

## Step 2 — Type-Specific Q&A

After the base Q&A, ask any type-specific questions:

- **Generic**: What is the logical subtask breakdown? Are there subtasks that require human review before proceeding (gates)?
- **Debug**: What are the reproduction steps? How do we know the bug is fixed (acceptance criteria)?
- **Collaborative**: What involvement level does the user want? (Review = user reviews each result; Approve = user approves before each start; Observe = HW runs autonomously)

## Step 3 — Sequential Thinking Synthesis

Before drafting the plan, use the **Sequential Thinking MCP** to reason through:

- Scope trade-offs and dependencies between proposed subtasks
- Ambiguities still unresolved after Q&A
- Gate placement — where human review is essential vs. where autonomous execution is safe
- Risks: what could go wrong, what needs a circuit breaker threshold

Do not skip this step for plans with more than 3 subtasks.

## Step 4 — Checkpoint Protocol Approval

Present the checkpoint protocol to the user:

> "The default checkpoint protocol (`~/.config/opencode/protocols/checkpoint.md`) runs 8 fixed steps after each subtask: WIP commit, update index.md, update spec.json, update session summary todo, write notes, write inbox, gate check, circuit breaker. Do you want to modify anything, or use the default as-is?"

If the user requests changes, note them as session-specific overrides in the session's `index.md` notes section. Do not modify the global checkpoint.md.

## Step 5 — Research Gate

> **Skip this step for Deep Research session type.** The research IS the session — `@DeepResearcher` is the execution agent for each subtask, not a planning aid. Proceed directly to `plan-deep-research.md`.

For all other session types, ask the user:

> "Does this session require external documentation or API research before planning? If yes, I'll invoke @DeepResearcher."

If yes, invoke **@DeepResearcher** with a focused research prompt. Wait for results before proceeding to plan writing.
If no, proceed immediately.

Continue to the type-specific protocol (plan-generic.md, plan-debug.md, plan-collaborative.md, or plan-deep-research.md).
