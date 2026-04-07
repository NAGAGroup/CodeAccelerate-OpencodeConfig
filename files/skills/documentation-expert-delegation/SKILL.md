---
name: documentation-expert-delegation
description: Teaches how to dispatch @documentation-expert for writing and editing documentation files.
---

# Delegating to @documentation-expert

Dispatch @documentation-expert for documentation goals using the task tool.

## How to Dispatch

Call task tool with: `subagent_type="documentation-expert"`, description (3-5 words), goal-based prompt with documentation goal, purpose, scope, and constraints.

## What @documentation-expert Does

- Goal-oriented documentation agent
- Investigates existing documentation and project conventions
- Produces or updates documentation (Markdown, configuration, prompt files)
- Reads code as reference, does not edit code

## Rules
- State documentation goal and why it matters
- Describe what documentation should accomplish: audience, purpose, scope
- Point to existing files or conventions to match for style
- State scope boundaries
- Let agent investigate and decide what files need to change
- Do not prescribe exact file paths or specific wording
