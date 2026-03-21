# Scout — Codebase Context Gathering for Collaborative Planning

Dispatch **2–4 @ContextScout agents in parallel**, each targeting a different relevant area of the codebase to gather context that will help the planning agent facilitate effective collaborative sessions.

## Dispatch Guidelines

Assign each scout a focused, non-overlapping target. Good targets include:
- **Project structure** — overall layout, key directories, and architectural boundaries
- **Relevant existing features** — similar functionality or related components that may inform the planning discussion
- **Development conventions** — coding patterns, naming standards, and workflow practices in use
- **Existing documentation** — READMEs, architecture documents, or process guides that provide context

## Prompt Each Scout With

- Specific file paths or glob patterns to read (derived from the planning session preparation)
- A focused question: what contextual information do they need to gather to help the planning agent?
- What to return: relevant file contents, observed patterns, conventions noted, and open questions about the codebase

## Constraints

- Dispatch all scouts simultaneously in a single response (parallel, not sequential)
- Do NOT synthesize findings here — wait for all scouts to return, then call `next_step()`
- Do NOT start solving or decomposing the problem — that comes after synthesis in the planning process

## Advance

After all scouts have returned their findings, call `next_step()` to proceed to the next step in the collaborative planning workflow.