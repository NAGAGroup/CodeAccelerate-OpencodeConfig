# Node: context-gather — /plan-debug

Your role in this node is to gather codebase context relevant to the bug before hypothesis formation begins.

## Steps

1. **Dispatch ContextScouts in parallel** — one per relevant concern. Typical concerns:
   - The code path triggered by the reproduction steps
   - Recent changes to files in that code path (git log if available)
   - Related tests and their current status
   - Error messages, stack traces, or log output (if provided by the user)
   Tailor each scout to the specific bug. Do not use generic scouts.

2. **Synthesize findings** — After all scouts return:
   - Identify the modules, functions, or data paths most likely involved
   - Note any obvious recent changes or known fragile areas
   - If the codebase relationships are complex → delegate to ContextInsurgent for deeper analysis

3. **Present a brief context summary** to the user — 3–6 bullet points covering: relevant files, code path, recent changes, and anything suspicious.

## Constraints

- You MUST NOT form hypotheses yet. Stop immediately if you find yourself doing so.
- You MUST NOT write any files. Do not modify the codebase in any way.
- You MUST NOT propose fixes or diagnose root causes.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
