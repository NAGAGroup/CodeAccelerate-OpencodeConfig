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

@juniordev is a surgical code editor. It makes exactly the changes specified to exactly the files named. It does not run tests, execute shell commands, or reason about downstream correctness.

@juniordev is suited for targeted edits to source code, configuration files, and scripts. For documentation files, use @documentation-expert instead.

## How to Write a Good Delegation Prompt

Your prompt should:
1. Name every file that needs to be changed.
2. Describe the exact change needed at each file — what to add, remove, or modify.
3. Explain why the change is needed so @juniordev can resolve ambiguities conservatively.
4. State any constraints — what must NOT be changed.
5. Keep scope tight. One logical change per dispatch.

## What @juniordev Reports Back

- Each file changed, with a one-sentence description of what changed.
- Any syntax or logic errors it noticed at the edit site (without fixing them).
- Any ambiguities it encountered and how it resolved them.

## Examples

Good — specific and complete:
> "In [file], change [thing] to [other thing]. This is needed because [reason]. Do not touch [other area]."

Good — named files with clear intent:
> "Add [feature] to [file A] and update the corresponding entry in [file B]. The two files must stay in sync."

Bad — too vague:
> "Update the configuration." — @juniordev needs to know exactly what to change.

Bad — includes shell operations:
> "Run the build after making the change." — shell operations are handled by @tailwrench.

Bad — asks for reasoning:
> "Figure out the best way to implement this." — @juniordev follows instructions, it does not design.
