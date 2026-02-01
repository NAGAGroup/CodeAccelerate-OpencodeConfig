---
name: skill-invocation-policy
description: Core rules for skill usage in OpenCode
---

## The Rule

If there's even a 1% chance a skill might apply to your task, invoke it using the `skill` tool.

**This is not negotiable.** Skills evolve and provide critical guidance.

## When to Load Skills

- **Before starting work** - Check for task-specific skills
- **When uncertain** - Load the skill to verify approach
- **When delegating** (tech_lead only) - Load delegation skill first

## How to Access Skills

Use: `skill({name: 'skill-name'})`

The skill content will be loaded - follow its instructions directly.

## Common Rationalizations (Don't Fall for These)

- [ISSUE] "This is simple, I don't need a skill"
- [ISSUE] "I need context first, I'll check skills later"
- [ISSUE] "I remember this skill from before"

Reality: Check skills FIRST, always.
