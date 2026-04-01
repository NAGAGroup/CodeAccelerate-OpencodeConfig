# Scouts 2 + 3 — Targeted Exploration

Call `task` twice in a single response to dispatch Scout 2 and Scout 3 in parallel.

**Todo:** `["task", "task"]`

From Scout 1's output and the user's task, decide what two distinct angles of investigation will best inform the plan. Write a targeted prompt for each scout — specific file paths, specific questions. Do not forward Scout 1's output verbatim; use it to make each prompt concrete.

**Scout 2**

> (1) Write a focused prompt for the first investigation angle.
> (2) Include specific file paths derived from Scout 1 output. Do not ask the scout to re-derive what to read.
> (3) Use this structure as the `prompt` field:

```
You are a subagent. The primary agent is planning a solution to this user task and has delegated this investigation to you. Do not ask the user questions.

User task: {{USER_TASK}}

Read these files:
{{FILES}}

{{SPECIFIC_QUESTION}}

Call `read` on each file directly. Do NOT use grep. Do NOT read .opencode/.

Glob syntax if needed: ✓ glob("**/*.ext") ✗ glob("a.ext,b.ext")

Return: specific findings with file:line citations. State "Nothing found" if nothing is relevant.
```

**Scout 3**

> (1) Write a focused prompt for the second investigation angle.
> (2) Include specific file paths derived from Scout 1 output. Do not ask the scout to re-derive what to read.
> (3) Use this structure as the `prompt` field:

```
You are a subagent. The primary agent is planning a solution to this user task and has delegated this investigation to you. Do not ask the user questions.

User task: {{USER_TASK}}

Read these files:
{{FILES}}

{{SPECIFIC_QUESTION}}

Call `read` on each file directly. Do NOT use grep. Do NOT read .opencode/.

Glob syntax if needed: ✓ glob("**/*.ext") ✗ glob("a.ext,b.ext")

Return: specific findings with file:line citations. State "Nothing found" if nothing is relevant.
```

Call `next_step()` after both tasks complete.
