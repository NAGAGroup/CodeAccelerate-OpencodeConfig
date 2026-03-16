# plan-deep-research.md — Deep Research Session Type

The Deep Research session type is for users who want to understand a topic, technology, API, or approach before deciding how to build something. The primary agent is `@DeepResearcher`. The output is a research brief, not a subtask plan.

## Flow

1. **Phase 1** — Run `plan-init.md` (orientation only — skip session type selection; session type is already determined as Deep Research)
2. **Research Q&A** — See below
3. **DeepResearcher dispatch** — See below
4. **Gate: user reviews findings** — See below
5. **Transition decision** — See below
6. **Finalization** — Run `plan-end.md` only if the user chooses to transition to a build session; otherwise write session notes and close

## Research Q&A

Use the `question` tool to ask 1–3 targeted questions to scope the research prompt. Do not ask about anything already clear from the user's description.

Focus questions on:

- **Topic boundary** — what is in scope and what is explicitly out?
- **Depth vs. breadth** — deep dive on one thing, or survey of options?
- **Decision criteria** — what does the user need to know to make a build decision? (e.g., API constraints, performance characteristics, library maturity, licensing)

Keep it to 1–3 questions. Do not ask for information you already have.

## DeepResearcher Dispatch

After Q&A, construct a scoped research prompt from the user's goal and the Q&A answers. The prompt must specify:

- The research topic and its boundaries
- The depth/breadth trade-off agreed in Q&A
- The decision criteria the findings must address
- Any known constraints (versions, platforms, existing dependencies)

Dispatch `@DeepResearcher` with this prompt. Wait for the research brief to return before proceeding.

## Gate: User Reviews Findings

After `@DeepResearcher` returns its brief, surface a summary to the user:

- Key findings (3–7 bullet points)
- Open questions or gaps in the research
- Recommended next steps based on findings

Then use the `question` tool to ask the user how they want to proceed. Present the options:

| Option | Description |
|--------|-------------|
| **Go deeper** | Dispatch another research round on a specific sub-topic from the findings |
| **Pivot topic** | Redirect research to a different angle or adjacent topic |
| **Transition to planning** | User is satisfied with findings and wants to start a build session |
| **Done** | Findings are sufficient; close the session without starting a build session |

Wait for explicit user selection before continuing.

## Transition Decision

**If the user selects "Go deeper" or "Pivot topic":**
- Construct a new scoped research prompt based on the user's direction
- Dispatch `@DeepResearcher` again with the refined prompt
- Return to the Gate step

**If the user selects "Transition to planning":**
- Write session notes (see Finalization below)
- Tell the user to run `/plan` and reference the research session notes as context
- Do not invoke `plan-end.md` for the research session itself — the research session is complete

**If the user selects "Done":**
- Write session notes and close the session

## Finalization

Write a session notes file to `.opencode/sessions/{name}/notes/research-brief.md` containing:

- Session goal (from the user's original description)
- Research scope (topic boundaries, depth/breadth trade-off, decision criteria)
- Full findings from all `@DeepResearcher` rounds (in order)
- Open questions or gaps not resolved
- Recommended next steps

Then run `plan-end.md` **only if** the user chose to transition to a build session and a subtask plan was drafted. If the session ends as a pure research output (no subtask plan), skip `plan-end.md` — write only the notes file and tell the user the session is complete.

## Key Constraints

- Never skip the Gate — the user must review findings before any transition
- Do not draft subtasks during the research session; subtask decomposition belongs to a follow-on `/plan` session
- If `@DeepResearcher` returns insufficient findings, surface the gaps at the Gate rather than patching them silently
- Loop depth is not capped — allow as many research rounds as the user requests
