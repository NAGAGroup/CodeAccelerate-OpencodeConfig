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

- You MUST dispatch all scouts simultaneously in a single response (parallel, not sequential).
- You MUST NOT synthesize findings here. Wait for all scouts to return, then call `next_step()`.
- You MUST NOT start solving or decomposing the problem — that comes after synthesis in the planning process.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

After all scouts have returned their findings, call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.