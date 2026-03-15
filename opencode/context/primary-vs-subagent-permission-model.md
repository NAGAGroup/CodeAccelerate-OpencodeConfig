---
topic: permission-model
tier: global
promoted_from: inbox
session: agent-permissions-and-insurgent
created: 2026-03-10
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
---

# Primary Agent vs Subagent Permission Model

**Observed:** 2026-03-10  
**Session:** agent-permissions-and-insurgent

## Pattern

In OpenCode, `mode: primary` agents (like HeadWrench) have a different permission model from `mode: subagent` agents. Primary agents appear to have broad default capabilities (bash, file ops, etc.) and the permission block is used only to **explicitly grant or deny specific capabilities** rather than to declare a complete capability set.

Subagents (`mode: subagent`) use the permission block as a **whitelist** — only explicitly allowed capabilities are available.

## Implication

When reading a primary agent's permission block, don't interpret the absence of a bash entry as "no bash access." The primary agent likely has bash access by default unless explicitly denied.

When auditing or reviewing permissions, primary agents should be noted separately from subagents.

## Open Question

This is inferred from behavior, not from official documentation. The OpenCode permission model for `mode: primary` vs `mode: subagent` should be verified against OpenCode source/docs to confirm this interpretation.
