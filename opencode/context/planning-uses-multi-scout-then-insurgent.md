---
topic: planning-uses-multi-scout-then-insurgent
tier: global
promoted_from: inbox
session: opencode-config-audit
created: 2026-03-13
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
---

# Planning Workflow: Multi-ContextScout → ContextInsurgent

For the planning workflow, ContextInsurgent use is mandatory (not optional). The correct sequence:

1. HW globs/greps the project to get a rough layout
2. HW delegates to **multiple ContextScouts in parallel** — each covering a different area of the codebase
3. HW uses the combined ContextScout findings to delegate to **ContextInsurgent** for deep synthesis

This is the one workflow where ContextInsurgent is mandatory. In all other workflows, HW may use ContextScout(s) first and only escalate to ContextInsurgent if extra reasoning power is genuinely needed.

ContextInsurgent no longer requires ask-only user confirmation before delegation.
