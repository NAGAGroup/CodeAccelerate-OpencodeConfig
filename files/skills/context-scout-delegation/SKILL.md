---
name: context-scout-delegation
description: Delegate to @context-scout
---

# Delegating to @context-scout

## Tool Schema

```json
{
  "subagent_type": "string",
  "description": "string",
  "prompt": "string",
  "task_id": "string"
}
```

- `subagent_type`: The agent type to use. Use `"context-scout"`.
- `description`: A short 3–5 word label for logging. Not seen by the agent.
- `prompt`: The full task prompt sent to the agent. Must be self-contained.
- `task_id`: Only include when resuming a previous session. Omit otherwise.

Only these four arguments are accepted. Do not add others.

## What @context-scout Does

@context-scout is a read-only explorer. It surveys available materials and reports back in prose. It cannot make changes. It has access to reading tools and sequential thinking.

@context-scout is good at building broad understanding — mapping what exists, how parts relate, and what is unclear. It is not suited for deep targeted analysis of a single area.

## How to Write a Good Delegation Prompt

Your prompt should:
1. State the goal so @context-scout understands why it is investigating.
2. Describe what areas to explore in terms of concepts, not specific locations.
3. Ask for prose output, as one person briefing another.
4. Ask for an uncertainties section — what was looked at but could not be fully determined.
5. Tell @context-scout to load the `sequential-thinking` skill first.
6. Tell @context-scout NOT to include raw lists of materials or structure in its response.

## What to Ask @context-scout to Report

- The current state and relevant background.
- What exists and how the parts relate.
- What works and what does not.
- What was investigated but could not be fully determined.

The uncertainties section is the most important part. It shows what needs deeper investigation.

## Examples

Good — describes what to explore conceptually:
> "The goal is [X]. Explore how the current situation handles [concern] — what is responsible for [aspect], how it works, and what would need to change."

Good — scoped to what matters:
> "The goal is [X]. Focus on understanding [area] — how it works, what is involved, and where gaps might exist."

Good — requests genuine uncertainties:
> "Include anything you investigated but could not fully verify. Surface-level evidence without confirmed understanding is more useful than false confidence."

Bad — tells @context-scout where to look:
> "Read the materials in [specific location] and the resources in [specific folder]."

Bad — tells @context-scout what to find:
> "Confirm that [X] is true and identify which version is being used."

Bad — asks for structured data:
> "Return a table of all items with their properties."

Bad — no uncertainties requested:
> "Summarize the current state." — produces a confident inventory that hides gaps.
