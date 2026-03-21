# Scout — Research Context Gathering

Dispatch **2–4 @ContextScout agents in parallel**, each targeting a different relevant area of the codebase or project to gather context that informs the research direction.

## Dispatch Guidelines

Assign each scout a focused, non-overlapping target. Good targets include:
- **Project structure** — overall layout, key directories, and important files
- **Relevant documentation** — READMEs, design docs, API docs, or comments that explain the system
- **Existing patterns** — how similar features or research tasks have been approached in the codebase
- **Configuration and setup** — build systems, dependencies, and environment details that affect research

## Prompt Each Scout With

- Specific file paths, directories, or documentation to examine (derived from the research task)
- A focused question: what context do they need to gather to inform the research?
- What to return: relevant file contents, observed patterns, key findings, and open questions

## Constraints

- Dispatch all scouts simultaneously in a single response (parallel, not sequential)
- Do NOT synthesize findings here — wait for all scouts to return, then call `next_step()`
- Do NOT start decomposing — that comes after synthesis

## Advance

After all scouts have returned their findings, call `next_step()` to proceed to the research-intake phase.