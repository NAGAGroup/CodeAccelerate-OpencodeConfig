---
name: documentation-expert-delegation
description: Teaches how to dispatch @documentation-expert for writing and editing documentation files.
---

# Delegating to @documentation-expert

Dispatch @documentation-expert for documentation goals using the task tool.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "documentation-expert", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the documentation goal clearly, explain why it matters, describe what the documentation should accomplish (audience, purpose, scope), provide context about existing conventions or reference materials to match, and state constraints.

## What @documentation-expert Does

@documentation-expert is a goal-oriented documentation agent. It investigates existing documentation, understands project conventions, and produces or updates documentation to achieve the stated goal. It reads code as reference material but does not edit code. It handles Markdown files, configuration files, and prompt files.

## Rules for Good Dispatch Prompts

- State the documentation goal and why it matters
- Describe what the documentation should accomplish — audience, purpose, scope
- Point to existing files or conventions to match for style reference
- State scope boundaries — what areas are in scope and what to leave alone
- Let @documentation-expert investigate and decide what files need to change
- Do not prescribe exact file paths or specific wording — the agent investigates and decides
