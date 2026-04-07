---
name: tailwrench-delegation
description: Teaches how to dispatch @tailwrench for shell operations, verification checks, and git commands.
---

# Delegating to @tailwrench

Dispatch @tailwrench for shell commands, verification, builds, tests, and git operations using the task tool with subagent_type="tailwrench". Include a clear goal, specific commands in order, and success criteria.

## How to Dispatch

Call the task tool with:
- subagent_type: "tailwrench"
- description: 3-5 word summary for logging
- prompt: Complete, goal-based instruction including what commands to run, what to report for each, and success criteria

## What @tailwrench Does

@tailwrench is a 30-step execution operator. It runs shell commands, builds, tests, verifications, and git commits. It follows instructions precisely but does NOT investigate, design, or troubleshoot. It reports findings directly. It cannot edit files or make architectural decisions.

## Rules for Good Dispatch Prompts

State the task clearly: verify, run, build, test, or commit. For verification, describe what to check and what passes. For commands, list them in order with reporting requirements for each. For commits, describe what changed and the scope. Write compact, specific language — @tailwrench has 30 steps and cannot pursue uncertain work. Use imperative language. Specify success criteria explicitly.
