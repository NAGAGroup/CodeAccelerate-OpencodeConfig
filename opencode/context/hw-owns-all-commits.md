---
topic: hw-owns-all-commits
tier: global
promoted_from: inbox
session: opencode-config-audit
created: 2026-03-13
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
---

# HeadWrench Owns All Git Commits

Implementation agents (session-local or otherwise) must NOT include `git commit` in their task execution. Git operations (add, commit, push) are **exclusively HeadWrench's responsibility**.

**Rationale**: Subagent bash permissions intentionally block git commands. Any commit instruction in an agent's prompt creates a false expectation that is silently impossible to fulfill — and if git were ever enabled in subagent bash, it would allow unreviewed commits bypassing HW oversight.

**Pattern**: After verifying written files look correct, HW runs `git add -A && git commit -m "..."` directly.
