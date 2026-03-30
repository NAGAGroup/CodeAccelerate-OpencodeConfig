# Brief Web Research

> **Agent Boundary — Read Before Dispatching:**
> `@ContextScout` is for **internal codebase exploration ONLY**. It must never be used for external research.
> For any external lookup — web search, documentation, API references, library comparisons, community resources — dispatch `@ExternalScout`.

> **@ExternalScout known failure modes — Do NOT:** Reverse tool order (Exa before Context7 wastes credits on docs Context7 covers better). Return a bare list of links without synthesis. Conduct deep multi-source research — one focused quick pass only. Hallucinate library documentation when Context7 returns nothing — state "not found in Context7" and try Exa.

Gather targeted documentation before proposing the DAG structure. This is a **quick and cursory research pass** — NOT a deep or comprehensive investigation. Deep research belongs in dedicated research nodes within the generated project DAG, not here. Your role is to gather quick reference material to inform structure planning.

Based on your scout findings and the task description, you should have a good sense of where to look. Propose specific documentation sources as options.

 > **Writing the @ExternalScout prompt:** The scout's task prompt must include:
> (1) tool priority and exact names: use `context7_resolve-library-id` to identify library IDs, then `context7_query-docs` to retrieve documentation; use `exa_web_search_exa` only for content not covered by Context7 — always in this order;
> (2) input spec: the exact question or topic to research (a specific question, not a subject area), plus the overall planning task context;
> (3) return format: a brief structured summary with sections — Key Findings, Relevant APIs or Patterns, Caveats; cite specific versions; include code examples when they exist; synthesize into direct answers — do NOT return a list of links; if nothing useful is found, state that explicitly;
> (4) agent-specific constraints: this is a one-shot quick pass — do NOT iterate, do NOT conduct a deep multi-source investigation, do NOT exceed two research calls total; (5) termination condition: stop and return findings after the first successful retrieval — do not chase follow-up sources.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `question` — Use the **`question` tool** to ask the user which documentation to research. Based on your understanding of the task, propose specific documentation sources as options (e.g., official library/framework docs, API reference pages, GitHub repositories). Allow the user to type their own answer if none of the options fit.

   > **Writing the Q1 question prompt:** Structure the question call with: (1) question text: "What should ExternalScout research?"; (2) options: list 2–4 specific documentation sources derived from the task and scout findings — e.g., "Official [library name] docs", "GitHub repository for [framework]", "[API name] reference"; always include a final option "Let me type my own topic"; (3) set `multiple: false` so the user picks one research direction.

> **Sequencing rule:** After the user answers Q1, call the `task` tool IMMEDIATELY in the same response turn — do NOT emit a plain-text acknowledgment and wait for a new user message before dispatching. Same-turn dispatch is required.

2. `task` — Dispatch one **@ExternalScout** with research instructions. Tell the researcher: the overall planning task, exactly where to look, and what output format you need. Instruct them to follow this tool priority: **(1) Context7 first** — use `context7_resolve-library-id` to identify libraries and `context7_query-docs` to retrieve documentation; **(2) Exa second** — only search the web for content not covered by Context7. The output should be a brief structured summary (key findings, relevant APIs or patterns, caveats). Emphasize that this is a one-shot, quick pass — no follow-ups or deep dives.

## Important

- Research is quick and targeted. Do not dispatch multiple researchers or iterate.
- Deep or comprehensive research does NOT belong in this node — that belongs in dedicated research nodes you include in the generated project DAG.
- If the brief findings suggest deeper investigation is needed, note this in the `propose-plan` node so it can be properly scoped as a research component.
- If ExternalScout returns no useful findings, note this and proceed — the research gap itself is useful context.
- The researcher's output feeds directly into your `propose-plan` reasoning alongside the scout findings.

After the researcher reports back, call `next_step()` to advance to sequential thinking.
