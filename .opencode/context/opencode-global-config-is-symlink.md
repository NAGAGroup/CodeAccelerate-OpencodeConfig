---
topic: config-symlink
tier: local
promoted_from: inbox
session: improve-planning-system
created: 2026-03-12
last_reviewed: 2026-03-13
supersedes: ~
superseded_by: ~
---

# ~/.config/opencode is a Symlink to ./opencode

`~/.config/opencode/` is a symlink to `./opencode/` in the CodeAccelerate-OpencodeConfig project. Both paths resolve to the same files.

Prefer using `./opencode/` (project-relative) paths in session plans, subtask files, and agent prompts for clarity and portability.
