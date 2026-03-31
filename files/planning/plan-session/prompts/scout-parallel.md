# Scouts 2 + 3 — Task-Targeted Exploration

## STOP — Do not work ahead

Your only job in this node is to dispatch Scouts 2 and 3 in a single response turn, then call `next_step()`. Do NOT synthesize findings, propose a plan, or begin any implementation work here.

## Todo

1. `task` — Dispatch @ContextScout for conventions and patterns (Scout 2). **Emit in same turn as task 2.**
2. `task` — Dispatch @ContextScout for dependencies and integration boundaries (Scout 3). **Emit in same turn as task 1.**

---

Scout 1's project map is in your context from the previous node. Use it — along with the user's task description — to write targeted prompts for Scouts 2 and 3, then dispatch both in the same response turn.

## Dispatch Instructions

**You MUST emit both `task` calls in a single response turn. Do NOT dispatch them in separate turns.**

✓ Correct: Include both Scout 2 and Scout 3 `task` tool calls in a single response.
✗ Wrong: Dispatch Scout 2, wait for result, then dispatch Scout 3.

**Your dispatch prompts MUST embed the user's task description verbatim AND Scout 1's complete output verbatim.** Do not paraphrase, summarize, or tell the scout to "use Scout 1's map" — paste the actual content directly into the prompt so the scout can read it.

> **VERBATIM COPY REQUIRED — copy the numbered instructions below word-for-word into your dispatch prompt. Do NOT paraphrase, summarize, or convert to prose.**
>
> **When dispatching @ContextScout (Scout 2), your task prompt must include these exact instructions:**
> (1) The user's task is: `<paste user task description verbatim here>`
> (2) Scout 1 returned this project map: `<paste Scout 1's complete output verbatim here>`
> (3) Using the file list above, identify and read the files most relevant to the task, then extract: naming conventions, structural patterns, coding style, and any existing implementations the task will need to fit alongside.
> (4) Return: file paths read plus specific patterns found (naming, structure, style) with file:line citations — not thematic summaries.
> (5) State 'Nothing found' if an area has no content.

> **VERBATIM COPY REQUIRED — copy the numbered instructions below word-for-word into your dispatch prompt. Do NOT paraphrase, summarize, or convert to prose.**
>
> **When dispatching @ContextScout (Scout 3), your task prompt must include these exact instructions:**
> (1) The user's task is: `<paste user task description verbatim here>`
> (2) Scout 1 returned this project map: `<paste Scout 1's complete output verbatim here>`
> (3) Using the file list above, identify files that define build dependencies, external libraries, public interfaces, or integration points relevant to the task — then read and summarize them.
> (4) Return: dependency names and versions, public API surfaces, build system constraints — with exact file references.
> (5) State 'No relevant boundaries found' if nothing applies.

✗ Bad: "Analyze the user's task and Scout 1's map" — this tells scouts to reference content they cannot see; they have no prior context.

## After Scouts 2 and 3 Return

MUST call `next_step()` after both scouts return. Do NOT synthesize findings, present results to the user, or start any planning work here.
