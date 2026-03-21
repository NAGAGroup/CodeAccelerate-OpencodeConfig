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

- Do not form hypotheses yet.
- Do not write any files.

## Advance

Call `next_step()`.
