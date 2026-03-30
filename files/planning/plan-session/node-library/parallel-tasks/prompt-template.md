# Parallel Tasks

Dispatch the following agents in parallel. Call all `task` tools sequentially — OpenCode runs them concurrently.

> **Critical:** Tasks must be fully independent — no task should depend on another's output. If tasks have dependencies, use a sequential chain of nodes instead.

## Task 1

**Agent:** {{TASK_1_AGENT}}

> **Agent selection:** Haiku-tier agents only: `@JuniorDev` (code edits), `@QuickDoc` (doc writes), `@ContextScout` (reads). Do NOT dispatch `@ContextInsurgent` or `@HeadWrench` here.
> For `@QuickDoc`: include the target file path, the format/template to follow, and point to a reference file to match style (e.g., "Match the style of `docs/existing-guide.md`").

**Target:** {{TASK_1_TARGET}}
**Goal:** {{TASK_1_GOAL}}
**Scope & Constraints:** {{TASK_1_SCOPE_AND_CONSTRAINTS}}

> **Field:** What this agent must NOT touch, must stay within, or special rules. E.g., "Edit only src/auth/; do not touch tests/". Include a conventions reference if the edit must match a specific file's style — e.g., "Match the pattern in `src/auth/session.ts`."

**Success criterion:** {{TASK_1_SUCCESS_CRITERION}}

> **Field:** Observable outcome — how the agent verifies the edit was applied. E.g., "File exports a new `refreshToken` function that TypeScript compiles without errors."

## Task 2

**Agent:** {{TASK_2_AGENT}}

> **Agent selection:** Haiku-tier agents only: `@JuniorDev` (code edits), `@QuickDoc` (doc writes), `@ContextScout` (reads). Do NOT dispatch `@ContextInsurgent` or `@HeadWrench` here.
> For `@QuickDoc`: include the target file path, the format/template to follow, and point to a reference file to match style (e.g., "Match the style of `docs/existing-guide.md`").

**Target:** {{TASK_2_TARGET}}
**Goal:** {{TASK_2_GOAL}}
**Scope & Constraints:** {{TASK_2_SCOPE_AND_CONSTRAINTS}}

> **Field:** What this agent must NOT touch, must stay within, or special rules. E.g., "Edit only src/auth/; do not touch tests/". Include a conventions reference if the edit must match a specific file's style — e.g., "Match the pattern in `src/auth/session.ts`."

**Success criterion:** {{TASK_2_SUCCESS_CRITERION}}

> **Field:** Observable outcome — how the agent verifies the edit was applied. E.g., "File exports a new `refreshToken` function that TypeScript compiles without errors."

## Task 3

**Agent:** {{TASK_3_AGENT}}

> **Agent selection:** Haiku-tier agents only: `@JuniorDev` (code edits), `@QuickDoc` (doc writes), `@ContextScout` (reads). Do NOT dispatch `@ContextInsurgent` or `@HeadWrench` here.
> For `@QuickDoc`: include the target file path, the format/template to follow, and point to a reference file to match style (e.g., "Match the style of `docs/existing-guide.md`").

**Target:** {{TASK_3_TARGET}}
**Goal:** {{TASK_3_GOAL}}
**Scope & Constraints:** {{TASK_3_SCOPE_AND_CONSTRAINTS}}

> **Field:** What this agent must NOT touch, must stay within, or special rules. E.g., "Edit only src/auth/; do not touch tests/". Include a conventions reference if the edit must match a specific file's style — e.g., "Match the pattern in `src/auth/session.ts`."

**Success criterion:** {{TASK_3_SUCCESS_CRITERION}}

> **Field:** Observable outcome — how the agent verifies the edit was applied. E.g., "File exports a new `refreshToken` function that TypeScript compiles without errors."

## Todo

> **Writing subagent prompts:** For each agent's task prompt, include: (1) exact file paths to read or edit; (2) the precise change to make (exact text to insert, or exact text to replace and its replacement); (3) a success criterion — how the agent knows the edit was applied correctly. Do not rely on the agent to infer file locations or edit content from vague descriptions.

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch {{TASK_1_AGENT}} to {{TASK_1_GOAL}} in {{TASK_1_TARGET}}
2. `task` — Dispatch {{TASK_2_AGENT}} to {{TASK_2_GOAL}} in {{TASK_2_TARGET}}
3. `task` — Dispatch {{TASK_3_AGENT}} to {{TASK_3_GOAL}} in {{TASK_3_TARGET}}

Call all three task tools before waiting for results — they run in parallel. Remove unused task sections if fewer than three agents are needed (adjust the todo array accordingly).

## Before advancing

If agent results were unexpected, conflicting, or raise questions about how to proceed, consider checking in with the user before calling `next_step()`. This is optional — if results are as expected, advance when ready.

## Sync requirement (fixed)

The number of task sections in this prompt must equal the number of `"task"` entries in the plan.json `todo` array for this node. The plugin enforces todo items in order — if the prompt has 3 task sections but the todo array has `["task","task"]`, the third task will never execute. Adjust both together.
