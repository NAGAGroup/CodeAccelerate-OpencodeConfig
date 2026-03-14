---
topic: ask-only-pattern
tier: local
promoted_from: inbox
session: agent-permissions-and-insurgent
created: 2026-03-10
last_reviewed: 2026-03-13
active: false
supersedes: ~
superseded_by: planning-uses-multi-scout-then-insurgent.md
---

# Pattern: Ask-Only Subagents

> ⚠️ **Review status**: This pattern is local-context only pending a decision on whether the ask-only approach is the right long-term model. Once the approach is confirmed, consider promoting to global context.

**Observed in:** agent-permissions-and-insurgent session, subtask 01

## Pattern

Some subagents are designated "ask-only" — HeadWrench must get user confirmation via the `question` tool before invoking them. This is enforced via HW system prompt instructions, NOT via permissions frontmatter.

The subagent itself does NOT get `question: allow`. The pattern is:
1. HW decides it needs the ask-only agent
2. HW calls `question` tool to confirm with user ("I'd like to invoke ContextInsurgent for deep exploration — approve?")
3. If approved, HW delegates to the agent
4. If declined, HW finds another approach

## Current Ask-Only Agents

- `subagents/context-insurgent` — deep exploration specialist with sequential thinking

## Why This Matters

This gives the user visibility and control over expensive or heavyweight agent invocations. The "ask-only" designation is documented in the agent's `description` field so SubagentBuilder and other agents know.
