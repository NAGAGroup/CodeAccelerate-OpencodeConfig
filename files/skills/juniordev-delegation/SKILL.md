---
name: juniordev-delegation
description: Delegate to @juniordev
---

# Delegating to @juniordev

## How to Call the task Tool

Call the `task` tool with exactly these three fields:

- `subagent_type`: always the string `"junior-dev"`
- `description`: a short 3–5 word label (for logging only, not seen by the agent)
- `prompt`: your full delegation prompt as a single string

Example call:

```
task(
  subagent_type="junior-dev",
  description="Update config value",
  prompt="In [file], change [thing] to [other thing]. This is needed because [reason]. Do not touch any other area of the file. Read the file before editing."
)
```

Do not include `task_id`. Omit it entirely.

## What @juniordev Does

@juniordev is a goal-oriented implementer. It investigates the codebase using probe tools to understand context, then makes targeted changes to achieve the stated goal. It does not run shell commands, execute tests, or reason about architectural correctness.

@juniordev is suited for targeted edits to source code, configuration files, and scripts. For documentation files, use @documentation-expert instead.

## How to Write a Good Delegation Prompt

Your prompt should:
1. State the goal clearly — what needs to be achieved and why.
2. Provide relevant context and rationale — what the change is for.
3. Describe scope boundaries — what areas to change and what to leave alone.
4. Point to any reference files or existing patterns to follow.
5. State constraints — what must NOT be changed.

## What @juniordev Reports Back

- Each file changed, with a one-sentence description of what changed.
- Any syntax or logic errors it noticed at the edit site (without fixing them).
- Any ambiguities it encountered and how it resolved them.

## Examples

Good — goal-oriented with context:
> "Enable verbose logging in the debug configuration. Currently, log level is set to 'info' in [file]. Change it to 'debug' and update the corresponding environment variable. This will help troubleshoot connection issues in development."

Good — goal with scope and constraints:
> "Add a new authentication provider to the login flow. Reference the existing OAuth pattern in [file A]. The change should be scoped to [module B] only. Do not modify any test files or existing authentication methods."

Bad — too vague about scope:
> "Refactor the authentication module." — @juniordev needs to know what specific aspect to change and why.

Bad — includes shell operations:
> "Add the feature and run the test suite." — shell operations are handled by @tailwrench.

Bad — asks for reasoning or design:
> "Make the codebase more performant." — @juniordev implements goals, not architectural decisions.
