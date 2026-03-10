---
description: "Resume an active session. Provide session name to jump straight in, or omit to pick from a list."
agent: headwrench
---

$ARGUMENTS

## With a session name

1. Dispatch **@ContextScout** to onboard on the session:
   - Read `.opencode/sessions/$ARGUMENTS/index.md` and `spec.json`
   - Read the current (first incomplete) subtask file: `.opencode/sessions/$ARGUMENTS/subtask-NN-{name}.md`
   - Read all files under `.opencode/sessions/$ARGUMENTS/notes/`
   - Return: session goal, completed subtasks, current subtask objective/scope/constraints, and any relevant notes

2. Present the summary to the user:
   - Session goal
   - Completed subtasks (count and names)
   - Current subtask — full objective and key constraints
   - Relevant notes

3. Ask the user to confirm before executing. Do not begin the subtask until the user explicitly says to start.

## Without a session name

1. List all sessions from `.opencode/sessions/*/index.md` and their `spec.json`, showing:
   - Session name
   - Goal
   - Status
   - Progress (X of N subtasks complete)

2. Ask the user which session to continue.

3. Once the user picks, follow the **With a session name** flow above (dispatch ContextScout, present summary, wait for confirmation).
