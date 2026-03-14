---
description: "Start a new session with full planning workflow: ContextScout (parallel) → optional ContextInsurgent synthesis → optional DeepResearcher → session type → Q&A → checkpoint approval → HW drafts plan → AgentDelegationExpert → approval → finalize."
agent: headwrench
---

Immediately, before doing anything else create a todolist for the phases.

Run the full planning workflow for a new session.

## USER SESSION DESCRIPTION

$ARGUMENTS

## Phase 1 — Situational Awareness

**Step 1a — Quick orientation (HW direct):** Glob/grep the project yourself for high-level layout: directory structure, key config files, language/framework signals. This takes seconds and gives you enough to dispatch targeted scouts.

**Step 1b — Parallel ContextScout dispatch:** Dispatch one or more @ContextScout agents in parallel — one per distinct concern relevant to the task. Each scout covers its slice of:
- Codebase structure (layout, languages, frameworks, build system)
- Prior sessions and their outcomes
- Active context from Tier 2 (`~/.config/opencode/context/`) and Tier 3 (`.opencode/context/`) — skip files with `active: false` or `superseded_by:` set
- Active session notes from Tier 4 (`.opencode/sessions/*/notes/` for in_progress/pending sessions only)
- Do **not** read `.opencode/inbox/` — the inbox is a write-only staging queue; agents never read it

**Step 1c — ContextInsurgent synthesis (when needed):** After the scouts return, synthesize their reports. If the task involves complex multi-file relationships, architectural interdependencies, or findings that need deep sequential reasoning, delegate to @ContextInsurgent to produce a single structured analysis. ContextInsurgent is read-only. Use its output as the situational awareness foundation for Q&A and plan drafting.

## Phase 1.5 — Research (Optional, User-Gated)

Ask the user: is there documentation, an API, or a library that needs researching before planning?
If yes, delegate to @DeepResearcher with the specific topic. This step requires **explicit user opt-in** — never dispatch DeepResearcher automatically.

## Phase 2 — Session Type Detection

Ask exactly one question:

> "What kind of session is this?"

Options:
- **Generic** (default) — feature work, refactors, new systems
- **Debug** — investigating a bug or failure
- **Collaborative** — user wants to work alongside HW, not just direct it

Record the selected session type in your Q&A context and use it to branch Phase 3.

## Phase 3 — Q&A

If no session description was given, ask the user to provide details.

Interview the user using the **standard Q&A** below (all session types):
- **Done criteria** — how will we know this is complete?
- **Scope** — what's in, what's out?
- **Reference vs legacy** — which existing code should be followed as a pattern, which should be ignored?
- **Patterns and invariants** — anything that must not change?
- **Uncertainties** — what's unclear or risky?
- **Build and test commands** — how do we build and test?
- **Git workflow** — branching strategy, commit conventions?
- **Circuit breaker threshold** — how many consecutive failures before stopping? (default: 3)
- **CI/infrastructure** — anything relevant?

Then apply conditional additions based on session type:

- **Generic** — no additional questions; behavior is unchanged from today.
- **Debug** — add:
  - **Symptom** — what's failing, and what error/unexpected behavior is seen?
  - **Start point** — when did this begin, and what is the last known good state?
  - **Prior attempts** — what has already been tried?
  - **Suspected components** — what areas seem most likely involved?
  - **Repro test exists?** — is there an existing reproduction test?
  - **Regression test after fix?** — should HW add one?
- **Collaborative** — add:
  - **Involvement level** — approve every subtask, review changes, or mostly hands-off?
  - **User-owned decisions** — which decisions should the user make personally (architecture, API shape, etc.)?
  - **Pause cadence** — should HW pause before each subtask to discuss scope?

After Q&A, use **Sequential Thinking** to synthesize the answers — reason through scope trade-offs, dependencies between subtasks, and any unresolved ambiguities before moving to plan drafting.

## Phase 3.5 — Checkpoint Protocol Approval

Show the user the contents of `~/.config/opencode/protocols/checkpoint.md` and ask:

> "Does this checkpoint procedure work for this session, or would you like to customize it?"

- If approved as-is: no action needed now. Subtask footers will reference the global protocol.
- If customizations requested: record them. You will write a session-local override at `.opencode/sessions/{session-name}/protocols/checkpoint.md` during Phase 7.

**This step is mandatory** — checkpoint protocol governs how progress is tracked between subtasks, and it cannot be changed after subtask files have been written.

## Phase 4 — Draft Session Plan

Use **Sequential Thinking** to reason through the subtask breakdown before writing — consider ordering, dependencies, gate placement, and parallelism opportunities.

Then write the session plan yourself following `~/.config/opencode/protocols/session-plan-schema.md`. Use:
- Q&A answers
- ContextScout/ContextInsurgent report
- DeepResearcher findings (if any)
- Session name (derive from the goal if not provided)

**Constraint**: Build and test steps are never assigned to CodeWriter. If the session requires building or testing, those are HeadWrench-owned steps — either inline or as explicit HeadWrench subtasks.

Create the session directory at `.opencode/sessions/{session-name}/` and write:
- `index.md` — living human-readable plan
- `spec.json` — machine-readable orchestrator state
- One `subtask-NN-{name}.md` per subtask — isolated, fully-specified task files following the format in `~/.config/opencode/protocols/session-plan-schema.md`

## Phase 5 — Apply Agent Routing

Load the **agent-delegation-expert** skill and apply its delegation rules to the drafted plan:
- Assign agent routing per subtask
- Assign model per subtask
- Identify parallel delegation opportunities within subtask scope
- Identify any new custom agents needed (with rationale)

Write the assignments into the `## Delegation` section of each `subtask-NN-{name}.md` file. Assignments go in subtask files only — never in `spec.json` or `index.md`.

## Phase 6 — Present to User

Present to the user:
- Plan overview (goal, subtasks, gates)
- Delegation assignments (agents and models assigned to each subtask)
- Any proposed new custom agents

Ask for approval. If the user requests changes, revise the plan and loop back to Phase 4 and/or Phase 5 as needed.

## Phase 7 — Finalize

Once approved:
- Delegation assignments have already been written into subtask `## Delegation` sections during Phase 5
- If checkpoint customizations were requested in Phase 3.5, write the session-local override at `.opencode/sessions/{session-name}/protocols/checkpoint.md`
- Create the **session summary todo** (Layer 1 only) containing: session name, goal, path to `index.md`, first subtask number and description
- Do not create Layer 2 (subtask todos) or Layer 3 (checkpoint todos) here; create both at execution start when the user says "start"
- If new custom agents are needed, delegate to @SubagentBuilder in parallel with finalization
- **Commit the session files**: stage and commit all files under `.opencode/sessions/{session-name}/` to the repo with a commit message of the form `plan: add session {session-name}`

## Phase 8 — Execution Bootstrap

Give a brief final overview: session name, goal, number of subtasks, key gates. Then tell the user:

Instruct the user to send `start` when they're ready or to open new session and run `/activate-session {session-name}`.

**Do not begin executing subtasks until the user explicitly says to start.**

When the user explicitly says to start:
1. Call the activate_session tool and read `.opencode/sessions/{session-name}/index.md` once for orientation.
2. Load the first subtask file (`subtask-NN-{name}.md`), determined by `spec.json` `currentSubtask`.
3. Extract the `## Todolist` section from the subtask file and create Layer 2 todos.
4. Create the 8 fixed checkpoint todos as Layer 3.
5. Begin executing the first subtask with all 3 layers active.
