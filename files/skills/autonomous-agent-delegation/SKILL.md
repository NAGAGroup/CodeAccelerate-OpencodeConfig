---
name: autonomous-agent-delegation
description: Teaches how to dispatch @autonomous-agent for fully autonomous execution of explicitly approved work.
---

# Delegating to @autonomous-agent

This skill teaches how to dispatch @autonomous-agent for fully autonomous execution on explicitly approved work. Load it only when the user has explicitly approved autonomous work in the current session.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "autonomous-agent", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the goal clearly, define acceptance criteria, list constraints and boundaries, include instructions to retrieve previous session knowledge from the appropriate Qdrant collection using qdrant_qdrant-find before starting, store progress notes during work and final outcome when complete, and specify what to report back (what was done, what works, what remains, any issues encountered).

## What @autonomous-agent Does

@autonomous-agent has full tool access with no restrictions or step limits. It can investigate code, make changes, run shell commands, modify configuration, and commit to git. It executes goals decisively without asking for clarification or pausing for user input. It is effective for long-running tasks, complex multi-phase work, and situations where iterative decision-making would benefit from autonomous judgment. It operates with complete autonomy on the stated goal.

## Rules for Good Dispatch Prompts

State the goal clearly and completely — what needs to be accomplished. Define acceptance criteria — what does "done" look like and when is the goal satisfied? State boundaries — what should the agent not do, what areas are off-limits, what constraints apply. Provide all context needed to work without asking questions. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @autonomous-agent to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store progress notes and findings to the same collection as work progresses and when complete. For long-running tasks, instruct periodic progress storage. The dispatch prompt must be self-contained and unambiguous. Dispatch @autonomous-agent only when the user has explicitly approved autonomous work in the current session — explicit user approval is required.

## Skill-Loading Instructions for @autonomous-agent

Include explicit skill-loading instructions in your dispatch prompt so @autonomous-agent loads necessary skills before starting work. Add these instructions near the top of the dispatch prompt:

- **Before reasoning through execution strategy:** Include "Load the sequential-thinking skill and use it to reason through your execution strategy, what the plan requires, and how to sequence the work before starting."
- **Before making file edits:** Include "Load the file-operations skill for reading and editing files."
- **Before searching code:** Include "Load the grepai skill for semantic code search and dependency tracing."
- **Before running shell commands:** Include "Load the shell-operations skill for running commands, tests, and builds."
- **Before storing progress:** Include "Load the qdrant-notes skill for persisting progress notes and findings to the plan session collection."

Skill-loading instructions should appear early in the dispatch prompt so the subagent loads skills before beginning work. This ensures @autonomous-agent reasons through its execution strategy before acting and has access to all necessary tools from the start, whether the task involves code investigation, implementation, shell operations, or knowledge persistence.

## Examples

**Good:** "Load the file-operations skill for file edits. Load the grepai skill for code search. Load the shell-operations skill for testing. Load the qdrant-notes skill for progress persistence. Goal: implement custom authentication providers. Acceptance criteria: new providers can be registered without modifying existing code. Constraints: do not break OAuth provider, preserve tests. Before starting, retrieve findings from Qdrant collection 'session-progress' using qdrant_qdrant-find. Store progress notes as you work. Report outcome when done."

**Bad — no acceptance criteria:** "Do whatever it takes to make it work." Define what "done" means and when the goal is satisfied.

**Bad — no boundaries:** "Fix the project." Scope must be explicit with clear constraints on what is in and out of scope.

**Bad — used without explicit approval:** Dispatching @autonomous-agent as a fallback when other agents fail or without explicit user approval. Autonomous execution requires explicit user approval — it is not a fallback strategy.

## When to Use @autonomous-agent

Dispatch @autonomous-agent only for goals that the user has explicitly approved for autonomous execution. Use it for complex multi-phase work, long-running tasks, or situations where iterative decision-making would benefit from autonomous judgment and full tool access. Always verify explicit user approval before dispatching — autonomous work is not a default choice or fallback.

## Dispatch Prompt Structure

A strong dispatch prompt includes all of these elements:

- **Goal statement:** Clear, specific objective that defines success
- **Acceptance criteria:** How to recognize when the goal is achieved; what "done" means
- **Scope boundaries:** What to change, what to leave alone, what areas are off-limits
- **Constraints:** Requirements that must be satisfied (performance, compatibility, style)
- **Context:** Background information that helps the agent understand the goal's importance
- **Qdrant instructions:** Collection name and instructions to retrieve and store session knowledge
- **Reporting:** What to report back (what was done, what works, what remains, issues)

The more specific and complete the prompt, the more reliably @autonomous-agent executes. Vague prompts lead to wasted effort and misaligned work.

## Understanding Autonomous Work

@autonomous-agent operates with full autonomy on the stated goal. It does not pause for user input or ask for clarification mid-work. It investigates, makes decisions, and executes. This is suitable when:

- The user has explicitly approved autonomous execution
- The goal and scope are well-defined and unambiguous
- The acceptance criteria are clear and measurable
- The agent can work for extended periods without interaction

Do not use @autonomous-agent for exploratory work, investigations, or decisions that require user input. Use scout agents for investigation, planning sessions for architectural decisions, and other agents for work requiring user guidance.

## Common Mistakes

**Dispatching without explicit user approval:** Autonomous work is a user decision, not a fallback when other approaches fail. Always confirm the user has explicitly approved autonomous execution.

**Vague goal statements:** "Make the system better" or "Fix the issues" are too imprecise. Autonomous agents need specific, measurable targets.

**Missing acceptance criteria:** Without clear "done" conditions, the agent may stop too early or work too long. Always define what success looks like.

**Forgetting Qdrant instructions:** When working within a plan session, omitting collection name and Qdrant instructions breaks knowledge continuity across the session.
