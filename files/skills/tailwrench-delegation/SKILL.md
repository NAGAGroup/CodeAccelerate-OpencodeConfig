---
name: tailwrench-delegation
description: Teaches how to dispatch @tailwrench for shell operations, verification checks, and git commands.
---

# Delegating to @tailwrench

Dispatch @tailwrench for shell commands, verification, builds, tests, and git operations.

## How to Dispatch

Call task tool with: `subagent_type="tailwrench"`, description (3-5 words), goal-based prompt with commands, reporting requirements, and success criteria.

## What @tailwrench Does

- 30-step execution operator
- Runs shell commands, builds, tests, verifications, git commits
- Follows instructions precisely; does not investigate, design, or troubleshoot
- Cannot edit files or make architectural decisions

## Rules
- State task clearly: verify, run, build, test, or commit
- For verification, describe what to check and what passes
- For commands, list them in order with reporting requirements
- For commits, describe what changed and the scope
- Write compact, specific language
- Use imperative language
- Specify success criteria explicitly
