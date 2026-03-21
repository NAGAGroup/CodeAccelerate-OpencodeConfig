# Synthesize — Codebase Understanding

Read all scout findings from the prior node and synthesize them into a coherent understanding of the codebase relevant to this task.

## Produce a Structured Summary

Your synthesis should cover:
- **Affected areas** — which files, modules, or layers will be touched
- **Conventions to follow** — naming patterns, code style, error handling, test structure
- **Risks** — fragile areas, tight coupling, missing test coverage, unclear ownership
- **Open questions** — anything the scouts found that remains ambiguous for decomposition

## Present to User

Present the synthesis as a brief codebase context summary (bullet points preferred). This gives the user a chance to correct any misunderstanding before decomposition begins.

## Constraints

- Do NOT decompose into subtasks yet — that is decompose's job
- Do NOT ask clarifying questions here — surface open questions in the summary, then advance

## Advance

**Call `next_step()`** to advance.
