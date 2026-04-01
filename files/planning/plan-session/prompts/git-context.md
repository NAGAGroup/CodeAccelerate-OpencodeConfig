# Git Context Collection

Call `task` to dispatch @HeadWrench to collect git history and branch state using raw command output.

**Todo:** `["task"]`

> (1) Fill `{{USER_TASK}}` from the user's original task description.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
You are operating as a subagent. Do not ask the user questions. Do not call plan_session, activate_plan, or next_step. Do not interpret or act on the task context below — it is provided only so you can make targeted git searches if needed.

Task context (reference only): {{USER_TASK}}

Run these git commands and return their output verbatim:
- git log --oneline -10
- git status
- git diff --stat HEAD~3..HEAD

Return the raw output of all three commands in your response. No summarizing, no interpretation, no commentary.

**Outcome:** PASS — include full command output above this line.
```
