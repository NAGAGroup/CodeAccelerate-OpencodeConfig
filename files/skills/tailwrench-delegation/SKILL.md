---
name: tailwrench-delegation
description: Delegate to @tailwrench
---

# Delegating to @tailwrench

## How to Call the task Tool

Call the `task` tool with exactly these three fields:

- `subagent_type`: always the string `"tailwrench"`
- `description`: a short 3–5 word label (for logging only, not seen by the agent)
- `prompt`: your full delegation prompt as a single string

Example call:

```
task(
  subagent_type="tailwrench",
  description="Run build and verify",
  prompt="Run [build command]. Report the full output and whether it succeeded. A pass means exit code 0 with no errors. If it fails, report the exact error. Do not attempt to fix anything."
)
```

Do not include `task_id`. Omit it entirely.

## What @tailwrench Does

@tailwrench is a powerful operator with full tool access. It runs shell commands, executes builds, performs verification checks, and creates git commits. It follows instructions exactly and does not improvise.

Use @tailwrench for: running tests or build commands, verifying outputs, installing dependencies, and creating git commits. Do not use it for file editing (use @juniordev or @documentation-expert) or open-ended exploration (use @context-scout or @context-insurgent).

## How to Write a Good Delegation Prompt

Your prompt should:
1. State the task clearly — verify, run commands, or commit.
2. For verification: describe what to check and what a passing result looks like.
3. For commands: list the exact commands to run and in what order.
4. For commits: describe what was changed so it can write a meaningful message.
5. State what to report back.

## What @tailwrench Reports Back

- What was done (task summary).
- Outcome: pass, fail, or completed.
- Evidence: command output, test results, commit hash, or relevant observations.
- Any issues encountered.

## Examples

Good — verification with clear pass criteria:
> "Run [test command] and report whether it passes. A pass means all tests exit with code 0. Report the full output."

Good — commit with context:
> "Stage all changes to [files] and commit with a message that reflects [what was done]. Report the commit hash."

Good — command sequence:
> "Run [command A] then [command B]. Report the output of each. Stop if either fails."

Bad — open-ended:
> "Fix whatever is broken." — @tailwrench follows instructions, it does not investigate or design.

Bad — file editing:
> "Update the config file and then run the build." — file editing goes to @juniordev first; then dispatch @tailwrench separately for the build.
