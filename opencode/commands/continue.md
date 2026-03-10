---
description: "Resume an active session. Provide session name to jump straight in, or omit to pick from a list."
agent: headwrench
---

$ARGUMENTS

If a session name was provided, read `.opencode/sessions/$ARGUMENTS/index.md` and `spec.json`. Find the first incomplete subtask. Report:
- Session goal
- Completed subtasks
- Current subtask and its objective
- Relevant notes from `.opencode/sessions/$ARGUMENTS/notes/`

Then begin executing the current subtask.

If no session name was provided, list all sessions from `.opencode/sessions/*/index.md` showing:
- Session name
- Goal
- Status
- Progress (X of N subtasks complete)

Ask the user which session to continue.
