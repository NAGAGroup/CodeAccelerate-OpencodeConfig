# Scout Node Library

Read the node library to understand what building blocks are available for composing DAGs. This is **pure information gathering** — no decomposition happens here. The findings feed directly into `sequential-thinking`, where HeadWrench will use this knowledge alongside the codebase and research context to design the complete plan.

> **Writing the scout's prompt:** The scout's prompt MUST instruct it to return file contents verbatim — not summarized. Include this exact instruction in the prompt you write: "Return file contents verbatim. Do NOT summarize, restructure, or add section headers like 'Codebase Overview' or 'Key Decisions'. The planning agent needs the raw content — summarizing destroys the information."

> **Exception: Session node library reads permitted here.** This is the ONE node where @ContextScout IS permitted to read from `{{SESSION_PATH}}/node-library/`. The node library is live planning infrastructure for the current active session, not a stale prior session artifact. The standard ContextScout restriction (no `.opencode/` reads) does not apply to the node library directory in this node.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `read` — HeadWrench reads `{{SESSION_PATH}}/node-library/CATALOGUE.md` directly using the read tool. HW gets the CATALOGUE content in its own context without delegating to @ContextScout. This ensures the exact node type names and todo arrays are available to HW without summarization loss.

2. `task` — HeadWrench dispatches @ContextScout to read only the relevant README files for node types relevant to the task at hand (e.g., if the task involves complex multi-file edits, read `{{SESSION_PATH}}/node-library/parallel-tasks/README.md` and `{{SESSION_PATH}}/node-library/verification-check/README.md`; if it involves complex reasoning, read `{{SESSION_PATH}}/node-library/analyze-deep/README.md` and `{{SESSION_PATH}}/node-library/compression-node/README.md`). When uncertain which node READMEs to read, at minimum read `compression-node/README.md` and `sequential-thinking/README.md` — these are relevant to almost every complex task. Do NOT ask ContextScout to read CATALOGUE.md — HeadWrench already has that from step 1.

**Important:** ContextScout must return README file contents verbatim — no summarization. Do NOT mix in codebase content. Do NOT explore the project repository. The scout's ONLY job is to read and return the planning infrastructure README files exactly as written.

**Rationale:** HeadWrench reading CATALOGUE.md directly is more reliable than asking ContextScout to return it verbatim (scouts tend to summarize). ContextScout only handles the README files, which are smaller and less prone to summarization loss.

The scout's output is the node library context that sequential-thinking will use. There is nothing to decompose yet — just bring the knowledge in.

After the scout returns the README contents, call `next_step()` to advance to the research gate.
