---
name: autonomous-agent-delegation
description: Delegate to @autonomous-agent
---

# Delegating to @autonomous-agent

## How to Call the task Tool

Call the `task` tool with exactly these three fields:

- `subagent_type`: always the string `"autonomous-agent"`
- `description`: a short 3–5 word label (for logging only, not seen by the agent)
- `prompt`: your full delegation prompt as a single string

Example call:

```
task(
  subagent_type="autonomous-agent",
  description="Autonomous feature implementation",
  prompt="Goal: [X]. Acceptance criteria: [Y]. Do not [Z]. Write progress notes to [path] as you go. Report outcome when done."
)
```

Do not include `task_id`. Omit it entirely.

## What @autonomous-agent Does

@autonomous-agent is a fully autonomous executor with full tool access. It receives a goal, works to completion without interruption, and reports the outcome. It does not ask for clarification.

Use @autonomous-agent only when the user has explicitly approved fully autonomous execution. For all other work, use targeted subagents (@juniordev, @tailwrench, etc.) with specific instructions.

## How to Write a Good Delegation Prompt

Your prompt should:
1. State the goal clearly and completely.
2. Define acceptance criteria — what does "done" look like?
3. State the boundaries — what should the agent NOT do?
4. Provide any context it needs to work without you.
5. Remind it to write progress notes if the task is long-running.

The prompt must be self-contained. The agent will not ask questions.

## What @autonomous-agent Reports Back

- Goal (restatement).
- Outcome: completed, blocked, or partial.
- What was done (prose summary).
- What remains if not completed, and why.
- Any issues encountered.

## Examples

Good — complete goal with boundaries:
> "Goal: [X]. Acceptance criteria: [Y]. Do not [Z]. Write progress notes to [path] as you go."

Good — scoped autonomous task:
> "The user approved autonomous execution of [task]. Complete it fully. Report the outcome when done."

Bad — no acceptance criteria:
> "Do whatever it takes to make it work." — define what "done" means.

Bad — no boundaries:
> "Fix the project." — scope must be explicit.

Bad — without user approval:
> Using autonomous-agent as a fallback when other subagents fail. Use plan-fail instead.
