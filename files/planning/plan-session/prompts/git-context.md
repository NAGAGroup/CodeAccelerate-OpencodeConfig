# Git Context Collection

Call `task` to dispatch @HeadWrench to collect git history and branch state using raw command output.

**Todo:** `["task"]`

> (1) Fill `{{USER_TASK}}` from the user's original task description.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
Task context: {{USER_TASK}}

Run these git commands and return their output verbatim:
- git log --oneline -10
- git status
- git diff --stat HEAD~3..HEAD

Return raw command output only. No summarizing, no interpretation, no commentary.

Outcome: PASS — git context collected.
```
