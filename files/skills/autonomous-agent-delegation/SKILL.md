---
name: autonomous-agent-delegation
description: Teaches how to dispatch @autonomous-agent for fully autonomous execution of explicitly approved work.
---

# Delegating to @autonomous-agent

Dispatch @autonomous-agent only when the user has explicitly approved autonomous work.

## How to Dispatch

Call task tool with: `subagent_type="autonomous-agent"`, description (3-5 words), goal-based prompt stating goal, acceptance criteria, constraints, boundaries, and reporting requirements.

## What @autonomous-agent Does

- Full tool access with no restrictions or step limits
- Investigates code, makes changes, runs commands, modifies configuration, commits to git
- Executes goals decisively without asking for clarification

## Rules
- State goal clearly and completely
- Define acceptance criteria explicitly
- List boundaries and constraints
- Provide all context needed to work without asking questions
- Include plan name (Qdrant collection) if working within a plan session
- Prompt must be self-contained and unambiguous
