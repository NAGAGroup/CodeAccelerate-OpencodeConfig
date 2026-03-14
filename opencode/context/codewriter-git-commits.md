---
topic: codewriter-git-commits
tier: global
promoted_from: inbox
session: ~
created: 2026-03-13
last_reviewed: 2026-03-13
supersedes: ~
superseded_by: ~
---

# CodeWriter: Git Commit Limitation

When delegating to @CodeWriter in any project, the agent cannot run git commands.
HeadWrench must run the commit directly after verifying the written files.

**Pattern:** verify files look correct by reading them, then `git add ... && git commit -m "..."` directly.
