# Git Context Collection

Call `task` to dispatch @HeadWrench to collect git history and branch state using raw command output.

**Todo:** `["task"]`

> (1) Dispatch @HeadWrench subagent to execute git commands: `git log --oneline -10`, `git status`, `git diff --stat HEAD~3..HEAD`.
> (2) Return all output verbatim with no summarizing, no interpretation.
> (3) If the repository is not a git repo, report this fact and return.
> (4) Do NOT read source files or perform analysis.
> (5) Scope: git commands only — no filesystem exploration.
> (6) Output constraint: raw command output only, no commentary.

Call `next_step()` after the task completes.
