# Brief Web Research

> **Agent Boundary — Read Before Dispatching:**
> `@ContextScout` is for **internal codebase exploration ONLY**. It must never be used for external research.
> For any external lookup — web search, documentation, API references, library comparisons, community resources — dispatch `@ExternalScout`.

Gather targeted documentation before proposing the DAG structure. This is a **quick and cursory research pass** — NOT a deep or comprehensive investigation. Deep research belongs in dedicated research nodes within the generated project DAG, not here. Your role is to gather quick reference material to inform structure planning.

Based on your scout findings and the task description, you should have a good sense of where to look. Propose specific documentation sources as options.

## Todo

1. `question` — Use the **`question` tool** to ask the user which documentation to research. Based on your understanding of the task, propose specific documentation sources as options (e.g., official library/framework docs, API reference pages, GitHub repositories). Allow the user to type their own answer if none of the options fit.

**After the user answers:** immediately proceed to dispatch the researcher in the **same response** — do NOT pause or wait for a new user message before calling the `task` tool below.

2. `task` — Dispatch one **@ExternalScout** with research instructions. Tell the researcher: the overall planning task, exactly where to look, and what output format you need. Instruct them to follow this tool priority: **(1) Context7 first** — use `context7_resolve-library-id` to identify libraries and `context7_query-docs` to retrieve documentation; **(2) Exa second** — only search the web for content not covered by Context7. The output should be a brief structured summary (key findings, relevant APIs or patterns, caveats). Emphasize that this is a one-shot, quick pass — no follow-ups or deep dives.

## Important

- Research is quick and targeted. Do not dispatch multiple researchers or iterate.
- Deep or comprehensive research does NOT belong in this node — that belongs in dedicated research nodes you include in the generated project DAG.
- If the brief findings suggest deeper investigation is needed, note this in the `propose-structure` node so it can be properly scoped as a research component.
- The researcher's output feeds directly into your `propose-structure` reasoning alongside the scout findings.
