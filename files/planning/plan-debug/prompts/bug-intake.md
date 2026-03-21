# Bug Intake

Your task is to **gather raw bug information only**. No questions.

## What to Gather

Capture exactly what the user provides about:
1. **Bug Symptoms** — Observable behavior, error messages, what went wrong
2. **Reproduction Path** — Steps that trigger the bug (if available)
3. **Affected Code Areas** — What code/modules the symptoms touch
4. **Environment** — System, version, configuration, timing
5. **Recent Context** — Recent changes, intermittent vs. consistent

Focus on gathering **raw information only**. Do not ask clarifying questions; all questions move to the `clarify` step where context exists.

## Output

Document exactly:
- Reported symptoms and error messages
- Reproduction steps (as provided)
- Affected code areas (as user mentions them)
- Environment details (as stated)
- Timing and consistency

Call `next_step()` when captured.
