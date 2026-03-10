---
description: "Modify the active session plan — add/remove subtasks, change scope, reorder, update routing or gates."
agent: headwrench
---

$ARGUMENTS

Read the active session's `index.md` and `spec.json`. Present the current plan, then apply the requested changes.

## Supported Changes

- Add or remove subtasks
- Change scope (in/out)
- Reorder subtasks
- Change agent routing for a subtask
- Add or remove gates
- Update constraints or patterns
- Modify protocol settings (circuit breaker threshold, etc.)

## After Changes

1. Update `index.md`
2. Update affected subtask files
3. Update `spec.json` if metadata changed
4. If routing changed significantly, optionally re-run @AgentDelegationExpert on affected subtasks
5. If scope changed significantly, optionally re-run @GatesExpert
6. Show a summary of what changed and confirm with the user
