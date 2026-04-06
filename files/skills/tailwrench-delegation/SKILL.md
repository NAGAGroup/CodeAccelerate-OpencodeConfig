---
name: tailwrench-delegation
description: Teaches how to dispatch @tailwrench for shell operations, verification checks, and git commands.
---

# Delegating to @tailwrench

Dispatch @tailwrench for shell commands, verification, builds, tests, and git operations using the task tool with subagent_type="tailwrench". Include a clear goal, specific commands in order, success criteria, what to report, and Qdrant instructions (retrieve before starting, store when done).

## How to Dispatch

Call the task tool with:
- subagent_type: "tailwrench"
- description: 3-5 word summary for logging
- prompt: Complete, goal-based instruction including what commands to run, what to report for each, success criteria, plan name (collection name) if in a plan session, and instructions to use qdrant_qdrant-find to retrieve prior results and qdrant_qdrant-store to save final results

## What @tailwrench Does

@tailwrench is a 30-step execution operator. It runs shell commands, builds, tests, verifications, and git commits. It follows instructions precisely but does NOT investigate, design, or troubleshoot. It reports findings directly. It cannot edit files or make architectural decisions.

## Rules for Good Dispatch Prompts

State the task clearly: verify, run, build, test, or commit. For verification, describe what to check and what passes. For commands, list them in order with reporting requirements for each. For commits, describe what changed and the scope. Write compact, specific language — @tailwrench has 30 steps and cannot pursue uncertain work. Use imperative language. Specify success criteria explicitly. Include plan name and Qdrant collection name if in a plan session. Instruct @tailwrench to retrieve prior results from Qdrant using qdrant_qdrant-find before starting and store final results after finishing using qdrant_qdrant-store.

## Skill-Loading Instructions for @tailwrench

Include explicit skill-loading instructions near the top of the dispatch prompt:

- **Before retrieving or storing verification results:** "Load the qdrant-notes skill for retrieving prior verification results and storing final outcomes to the plan session collection."
