---
name: context-insurgent-delegation
description: Delegate to @context-insurgent
---

# Delegating to @context-insurgent

## How to Call the task Tool

Call the `task` tool with exactly these three fields:

- `subagent_type`: always the string `"context-insurgent"`
- `description`: a short 3–5 word label (for logging only, not seen by the agent)
- `prompt`: your full delegation prompt as a single string

Example call:

```
task(
  subagent_type="context-insurgent",
  description="Trace error handling logic",
  prompt="Investigate how [specific mechanism] works. Trace the logic from [entry point] to [outcome] and explain what controls [behavior]. Report findings in prose with specific supporting evidence. End with what you examined but could not fully verify. Do not include file trees or line-number lists."
)
```

Do not include `task_id`. Omit it entirely.

## What @context-insurgent Does

@context-insurgent is a deep multi-file analyst. It traces cross-file logic, synthesizes findings across many sources, and reasons through non-obvious conclusions. It cannot make changes.

@context-insurgent is suited for targeted analysis where you already know what area to investigate. It goes deep into one area rather than surveying broadly. For broad surveys, use @context-scout instead.

## How to Write a Good Delegation Prompt

Your prompt should:
1. Name the specific area or question to investigate.
2. Describe what you need to understand — relationships, logic flow, root causes.
3. Ask for prose findings with specific supporting evidence.
4. Ask for an uncertainties section — what could not be fully verified.
5. Tell @context-insurgent NOT to include raw file trees or line-number lists.

## What to Ask @context-insurgent to Report

- The specific answer to the investigation question.
- How it reached that conclusion — what evidence it traced.
- What was examined but could not be fully verified.

## Examples

Good — narrow and specific:
> "The goal is [X]. Investigate how [specific mechanism] works — trace the logic from [entry point] to [outcome] and explain what controls [behavior]."

Good — root cause analysis:
> "Something is going wrong with [aspect]. Trace why — what is responsible, what calls it, and what conditions produce the problem."

Bad — too broad for insurgent:
> "Explore the codebase and tell me what exists." — use @context-scout instead.

Bad — tells insurgent what to find:
> "Confirm that [X] is implemented correctly." — insurgent discovers, it does not confirm.

Bad — asks for structured data:
> "Return a table of all implementations." — ask for prose findings.
