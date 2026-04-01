# Git Context Collection

Call `task` to dispatch @HeadWrench to collect git history and branch state using raw command output.

**Todo:** `["task"]`

> (1) Fill `{{USER_TASK}}` from the user's original task description.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
You are operating as a subagent. Do not ask the user questions. Do not interpret or act on the task context below — it is provided only so you can make targeted git searches if needed.

Task context (reference only): {{USER_TASK}}

Run these git commands and return their output verbatim:
- git log --oneline -10
- git status
- git diff --stat HEAD~3..HEAD

Return raw command output only. No summarizing, no interpretation, no commentary.

Outcome: PASS — git context collected.
```
