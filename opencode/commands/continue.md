---
description: "Resume an active session. Provide session name to jump straight in, or omit to pick from a list."
agent: headwrench
---

$ARGUMENTS

## Pre-check — Session Status

Read `.opencode/sessions/$ARGUMENTS/spec.json` and check the `status` field before loading anything else.

- If `status` is `"completed"`: surface the following message and **stop** — do not load or reconstruct anything:

  > "Session `{name}` is already complete. No work remaining. Consider running `/context-audit` to review session notes for promotion candidates."

- If `status` is not `"completed"`: continue to the **With a session name** flow below.

## With a session name

1. **Reload session context** (5-tier order, no ContextScout delegation):
   1. Read `.opencode/sessions/{name}/spec.json` to resolve `currentSubtask`
   2. **Tier 2** — Load global context: read all files in `~/.config/opencode/context/`; skip any file with `active: false` or a `superseded_by:` value set
   3. **Tier 3** — Load project context: read all files in `.opencode/context/`; skip any file with `active: false` or a `superseded_by:` value set
   4. **Tier 4** — Load session notes: read `.opencode/sessions/*/notes/` for sessions whose `spec.json` has `status` of `in_progress` or `pending` only
   5. **Tier 5** — Load current subtask: read only the `subtask-NN-{name}.md` file identified by `currentSubtask` in `spec.json`

2. **Reconstruct the 3-layer todo stack:**
   - **Layer 1 — Session summary todo**: Create/update a todo containing: session name, goal, path to `index.md`, current subtask number and description. Include the compaction recovery phrase: "If context lost: read spec.json at `.opencode/sessions/{name}/spec.json`"
   - **Layer 2 — Subtask todos**: Extract `## Todolist` from the current subtask file and create one todo per item found there
   - **Layer 3 — Checkpoint todos**: Create the fixed 8-step checkpoint todos in order:
     1. WIP commit
     2. Update `index.md`
     3. Update `spec.json`
     4. Update session summary todo
     5. Write session notes
     6. Write inbox items
     7. Gate check
     8. Circuit breaker check

3. **Present the summary to the user:**
   - Session goal
   - Completed subtasks (count and names)
   - Current subtask — full objective and key constraints
   - Relevant notes

4. Ask the user to confirm before executing. Do not begin the subtask until the user explicitly says to start.

## Without a session name

1. List all sessions from `.opencode/sessions/*/index.md` and their `spec.json`, showing:
   - Session name
   - Goal
   - Status
   - Progress (X of N subtasks complete)

2. Ask the user which session to continue.

3. Once the user picks, follow the **With a session name** flow above (pre-check, reload context, reconstruct todos, present summary, wait for confirmation).
