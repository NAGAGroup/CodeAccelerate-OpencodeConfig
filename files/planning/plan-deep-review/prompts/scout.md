# Scout — Deep Code Review Context Gathering

Dispatch **2–4 @ContextScout agents in parallel**, each targeting different aspects of the code within `review_scope` and based on `review_flags`. Each scout returns **structured findings** organized by category.

## Parallel Dispatch Strategy

Split scouts by:
- **Directory/module** if scope is broad (e.g., one scout per major package or service)
- **Concern type** if multiple flags are specified (e.g., one scout for bugs, one for performance, one for architecture)
- **Always dispatch at least 2 scouts** for coverage and redundancy

Optionally, if the scope is complex or multi-file reasoning is needed, dispatch **one @ContextInsurgent agent alongside the scouts** for deep analysis.

## Prompt Each Scout With

For each scout, provide:
- Specific file paths or glob patterns within `review_scope`
- Focused review questions: what concerns should they prioritize?
- What to return: **structured findings** (see categories below)

## Structured Finding Categories

Each scout must organize findings by category:

- **Bugs**: Specific bugs, logic errors, null-safety issues, race conditions, boundary violations
- **Quality**: Code smells, duplication, naming inconsistencies, cyclomatic complexity, readability issues
- **Architecture**: Coupling, separation of concerns, design pattern violations, layering violations
- **Performance**: N+1 queries, unnecessary allocations, blocking calls, inefficient algorithms, cache issues
- **Security**: Injection risks, authentication/authorization issues, sensitive data exposure, privilege escalation
- **Docs**: Missing docstrings, stale comments, undocumented public APIs, unclear intent

Return findings as a structured list or table with:
- Category
- Severity (critical, high, medium, low)
- Location (file, line range if available)
- Description
- Suggested fix (optional)

## Constraints

- Dispatch all scouts **simultaneously in a single response** (parallel, not sequential)
- Do NOT synthesize or analyze findings here — scouts report observations, not conclusions
- Do NOT start filtering or prioritizing — that happens at `synthesize`
- Scouts return findings to HeadWrench; they do not perform additional reasoning
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
