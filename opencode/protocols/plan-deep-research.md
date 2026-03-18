# plan-deep-research.md — Deep Research Session Type

The Deep Research session type plans and executes a structured multi-round research investigation as a full HW session. The session has `index.md`, `spec.json`, and subtask files — just like Generic or Debug sessions. Each subtask is a single focused `@DeepResearcher` invocation. Gates between rounds let the user review findings and steer direction before the next round begins.

> **This is not a research-during-planning step.** The research IS the session. `@DeepResearcher` is not invoked during planning — it is the execution agent for every research subtask.

## Flow

1. **Phase 1** — Run `plan-init.md` (orientation; skip session type selection — already determined)
2. **Shared steps** — Run `plan-shared.md` (skip Step 5 — the research IS the session)
3. **Research Q&A** — See below
4. **Subtask decomposition** — See below
5. **Apply delegation** — Load agent-delegation-expert skill
6. **Finalization** — Run `plan-end.md`

## Research Q&A

Use the `question` tool to ask 1–3 targeted questions to scope the research plan. Do not ask about anything already clear from the user's description.

Focus questions on:

- **Topic boundary** — what is in scope and what is explicitly out of scope?
- **Depth vs. breadth** — deep dive on one thing, or survey across several options?
- **Decision criteria** — what does the user need to know to make a decision? (e.g., API constraints, performance characteristics, library maturity, licensing)
- **Initial rounds** — how many distinct research questions does the user want to start with? (you can suggest 1–3 based on the topic; more can be added at gates)

Keep it to 1–3 questions. Do not ask for information you already have.

## Subtask Decomposition

### Research Round Subtasks

Each research round is one subtask. A round has a single focused research question that `@DeepResearcher` can fully address in one invocation.

**Naming convention:** `subtask-NN-research-round-N-{slug}.md`
**Examples:** `subtask-01-research-round-1-trpc-vs-rest.md`, `subtask-02-research-round-2-bundle-size.md`

Each research round subtask must have:

- **Objective** — The specific research question being answered. One focused question only. Include what the output should cover (e.g., trade-offs, constraints, maturity, code examples).
- **Scope** — What areas, sources, or angles to investigate. Known constraints (versions, platforms, existing stack).
- **Constraints** — Output format, depth/breadth trade-off, things to avoid or not assume.
- **Todolist** — 4 items (see template below):
  1. Construct scoped research prompt from the subtask Objective and any prior round notes
  2. Dispatch `@DeepResearcher` with the prompt
  3. Write round findings to `notes/round-NN-findings.md`
  4. `[🚫 GATE]` Surface findings summary to user; wait for direction before proceeding

- **Delegation** — Always `@DeepResearcher` for research rounds

### Synthesis Subtask

The **last subtask is always a synthesis subtask** — HW-direct, no DeepResearcher invocation.

**Naming convention:** `subtask-NN-synthesis.md`

The synthesis subtask:
- Reads all `notes/round-NN-findings.md` files accumulated during the session
- Compiles a `notes/research-brief.md` with: session goal, research scope, all findings (in round order), open questions, recommended next steps
- No gate — this is the terminal subtask

**Delegation:** HW-direct (reading session notes and writing a brief — no subagent needed).

### Dynamic Rounds

The initial plan contains the rounds identified in Q&A plus the synthesis subtask. At each gate, the user may direct:

- **Continue to synthesis** — proceed to the synthesis subtask as planned
- **Add another round** — insert a new research subtask before synthesis and continue
- **Redirect the current angle** — note the redirect in session notes; proceed to synthesis or next round per user direction

Document the dynamic round rule in `index.md` under **Patterns & Constraints**: "Additional research rounds may be inserted at gates based on user direction."

### Sizing Rules

- One research question per subtask. Do not bundle multiple questions into one round.
- If a topic is too broad for one invocation, split it into two focused rounds (e.g., Round 1: API surface; Round 2: performance characteristics).
- Minimum 2 subtasks (at least one research round + synthesis). Maximum initial rounds: 5 (more can be added at gates).
- Every research round ends with a `[🚫 GATE]` except the synthesis subtask.

## Applying Delegation

After subtask decomposition is complete, load the **agent-delegation-expert skill** (`~/.config/opencode/skills/agent-delegation-expert/SKILL.md`) and apply its routing rules.

For Deep Research sessions:
- All research round subtasks → `@DeepResearcher`
- Synthesis subtask → HW-direct (no subagent)

Write assignments into each subtask's `## Delegation` section before writing files.

## Execution Behavior (for reference — not planning steps)

When the session runs:

1. Read the current research round subtask file
2. Construct a scoped research prompt from the subtask Objective, Scope, and any relevant `notes/round-NN-findings.md` from prior rounds
3. Dispatch `@DeepResearcher` via the Task tool
4. When results return, write `notes/round-NN-findings.md`
5. Hit the Gate: surface a findings summary to the user and wait for direction
6. User directs: continue to synthesis, add a round, or redirect
7. At checkpoint, update `spec.json` and `index.md`, and transition to the next subtask

For the synthesis subtask, read all round notes directly and write `notes/research-brief.md` without dispatching any subagent.
