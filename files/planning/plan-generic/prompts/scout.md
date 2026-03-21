# Scout — Codebase Context Gathering

Dispatch **2–4 @ContextScout agents in parallel**, each targeting a different relevant area of the codebase based on the task description gathered in task-intake and clarify.

## Dispatch Guidelines

Assign each scout a focused, non-overlapping target. Good targets include:
- **Entry points** — where the feature or change begins (routes, handlers, CLI entrypoints)
- **Affected files** — files most likely to change based on the task description
- **Test patterns** — how existing tests are structured; what testing conventions are in use
- **Existing conventions** — related code that establishes patterns to follow (naming, structure, error handling)

## Prompt Each Scout With

- Specific file paths or glob patterns to read (derived from the task context)
- A focused question: what are they looking for?
- What to return: relevant file contents, patterns observed, open questions

## Constraints

- Dispatch all scouts simultaneously in a single response (parallel, not sequential)
- Do NOT synthesize findings here — wait for all scouts to return, then call `next_step()`
- Do NOT start decomposing — that comes after synthesize

## Advance

**Call `next_step()`** to advance.
