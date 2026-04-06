---
name: autonomous-agent-delegation
description: Teaches how to dispatch @autonomous-agent for fully autonomous execution of explicitly approved work.
---

# Delegating to @autonomous-agent

Load this skill only when the user has explicitly approved autonomous work in the current session.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "autonomous-agent", a short description (3-5 words) for logging, and a complete goal-based prompt. The prompt must state the goal, define acceptance criteria, list constraints and boundaries, include instructions to retrieve previous session knowledge from Qdrant using qdrant_qdrant-find before starting, store progress notes during work and final outcome when complete, and specify reporting requirements (what was done, what works, what remains, issues encountered).

## What @autonomous-agent Does

@autonomous-agent has full tool access with no restrictions or step limits. It investigates code, makes changes, runs shell commands, modifies configuration, and commits to git. It executes goals decisively without asking for clarification or pausing for user input. Dispatch @autonomous-agent only when the user has explicitly approved autonomous work.

## Rules for Good Dispatch Prompts

State the goal clearly and completely. Define acceptance criteria—what does "done" look like? State boundaries—what should not be changed, what areas are off-limits, what constraints apply. Provide all context needed to work without asking questions. When working within a plan session, include the plan name (Qdrant collection name) and instruct @autonomous-agent to use qdrant_qdrant-find to retrieve accumulated session knowledge before starting, store progress notes as work progresses, and store final outcome when complete. The dispatch prompt must be self-contained and unambiguous.

## Skill-Loading Instructions for @autonomous-agent

Include explicit skill-loading instructions near the top of the dispatch prompt:

- **Before reasoning through execution strategy:** "Load the sequential-thinking skill and use it to reason through your execution strategy, what the plan requires, and how to sequence the work before starting."
- **Before making file edits:** "Load the file-operations skill for reading and editing files."
- **Before searching code:** "Load the grepai skill for semantic code search and dependency tracing."
- **Before running shell commands:** "Load the shell-operations skill for running commands, tests, and builds."
- **Before storing progress:** "Load the qdrant-notes skill for persisting progress notes and findings to the plan session collection."
