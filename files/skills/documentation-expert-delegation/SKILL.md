---
name: documentation-expert-delegation
description: Delegate to @documentation-expert
---

# Delegating to @documentation-expert

## How to Call the task Tool

Call the `task` tool with exactly these three fields:

- `subagent_type`: always the string `"documentation-expert"`
- `description`: a short 3–5 word label (for logging only, not seen by the agent)
- `prompt`: your full delegation prompt as a single string

Example call:

```
task(
  subagent_type="documentation-expert",
  description="Write release notes",
  prompt="Write [file] as a [type of document]. It should cover [topics]. Use [reference file] for formatting conventions. Do not create any additional files."
)
```

Do not include `task_id`. Omit it entirely.

## What @documentation-expert Does

@documentation-expert is a focused document writer and editor. It writes or edits exactly the file named in the task — Markdown files, config files, and prompt files. It does not touch code files.

@documentation-expert is suited for writing new documents, updating existing ones, and maintaining consistent formatting. For code or script files, use @juniordev instead.

## How to Write a Good Delegation Prompt

Your prompt should:
1. Name the exact file to write or edit.
2. Describe what the document should contain or what needs to change.
3. Point to any existing files to use as formatting references.
4. Explain the purpose of the document so conventions can be applied correctly.
5. State any constraints — tone, structure, length, what must NOT be changed.

## What @documentation-expert Reports Back

- The file written or edited, with a one-sentence description of what changed.
- The formatting schema followed.
- Any ambiguities encountered and how they were resolved.

## Examples

Good — named file with clear content requirements:
> "Write [file] as a [type of document]. It should cover [topics]. Use [reference file] for formatting conventions."

Good — targeted edit:
> "Update the [section] of [file] to reflect [new state]. Keep all other sections unchanged."

Bad — multiple files at once:
> "Update all the documentation files." — @documentation-expert handles one file per dispatch.

Bad — asks for code changes:
> "Update the configuration and also fix the script." — code changes go to @juniordev.

Bad — too vague:
> "Improve the documentation." — @documentation-expert needs a specific file and what to write.
