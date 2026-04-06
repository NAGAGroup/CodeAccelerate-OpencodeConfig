# Delegating to @autonomous-agent

This skill teaches how to dispatch @autonomous-agent for fully autonomous execution on explicitly approved work. Load it only when the user has explicitly approved autonomous work in the current session.

## How to Dispatch the Agent

Call the task tool with subagent_type autonomous-agent:

```
task(
  subagent_type="autonomous-agent",
  description="Autonomous feature implementation",
  prompt="Goal: implement support for custom authentication providers in the system. Acceptance criteria: new providers can be registered and used without modifying existing provider code. Constraints: do not break existing OAuth provider, preserve all existing tests. Before starting, retrieve any previous session knowledge from Qdrant collection 'session-progress' using qdrant_qdrant-find. Store progress notes as you work and the final outcome when complete. Report what was done, what works, what remains, and any issues encountered."
)
```

**Parameters:**
- `subagent_type`: always the string "autonomous-agent"
- `description`: 3–5 word label for logging
- `prompt`: your full goal-based dispatch prompt

## What @autonomous-agent Does

@autonomous-agent has full tool access with no restrictions or step limits. It can investigate code, make changes, run shell commands, modify configuration, and commit to git. It executes goals decisively without asking for clarification or pausing for user input. It is effective for long-running tasks, complex multi-phase work, and situations where iterative decision-making would benefit from autonomous judgment. It operates with complete autonomy on the stated goal.

## Rules for Good Dispatch Prompts

State the goal clearly and completely — what needs to be accomplished. Define acceptance criteria — what does "done" look like and when is the goal satisfied? State boundaries — what should the agent not do, what areas are off-limits, what constraints apply. Provide all context needed to work without asking questions. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @autonomous-agent to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store progress notes and findings to the same collection as work progresses and when complete. For long-running tasks, instruct periodic progress storage. The dispatch prompt must be self-contained and unambiguous. Dispatch @autonomous-agent only when the user has explicitly approved autonomous work in the current session — explicit user approval is required.

## Examples

**Good:** "Goal: implement custom authentication providers. Acceptance criteria: new providers can be registered without modifying existing code. Constraints: do not break OAuth provider, preserve tests. Before starting, retrieve findings from Qdrant collection 'session-progress' using qdrant_qdrant-find. Store progress notes as you work. Report outcome when done."

**Bad — no acceptance criteria:** "Do whatever it takes to make it work." Define what "done" means and when the goal is satisfied.

**Bad — no boundaries:** "Fix the project." Scope must be explicit with clear constraints on what is in and out of scope.

**Bad — used without explicit approval:** Dispatching @autonomous-agent as a fallback when other agents fail or without explicit user approval. Autonomous execution requires explicit user approval — it is not a fallback strategy.

## When to Use @autonomous-agent

Dispatch @autonomous-agent only for goals that the user has explicitly approved for autonomous execution. Use it for complex multi-phase work, long-running tasks, or situations where iterative decision-making would benefit from autonomous judgment and full tool access. Always verify explicit user approval before dispatching — autonomous work is not a default choice or fallback.
