# Parallel Tasks

Dispatch the following agents in parallel. Call all `task` tools sequentially — OpenCode runs them concurrently.

> **Critical:** Tasks must be fully independent — no task should depend on another's output. If tasks have dependencies, use a sequential chain of nodes instead.

## Task 1

**Agent:** {{TASK_1_AGENT}}

> **Agent selection:** Haiku-tier agents only: `@JuniorDev` (code edits), `@QuickDoc` (doc writes), `@ContextScout` (reads). Do NOT dispatch `@ContextInsurgent` or `@HeadWrench` here.

**Target:** {{TASK_1_TARGET}}
**Goal:** {{TASK_1_GOAL}}
**Scope & Constraints:** {{TASK_1_SCOPE_AND_CONSTRAINTS}}

> **Field:** What this agent must NOT touch, must stay within, or special rules. E.g., "Edit only src/auth/; do not touch tests/". Leave blank if none.

## Task 2

**Agent:** {{TASK_2_AGENT}}

> **Agent selection:** Haiku-tier agents only: `@JuniorDev` (code edits), `@QuickDoc` (doc writes), `@ContextScout` (reads). Do NOT dispatch `@ContextInsurgent` or `@HeadWrench` here.

**Target:** {{TASK_2_TARGET}}
**Goal:** {{TASK_2_GOAL}}
**Scope & Constraints:** {{TASK_2_SCOPE_AND_CONSTRAINTS}}

> **Field:** What this agent must NOT touch, must stay within, or special rules. E.g., "Edit only src/auth/; do not touch tests/". Leave blank if none.

## Task 3

**Agent:** {{TASK_3_AGENT}}

> **Agent selection:** Haiku-tier agents only: `@JuniorDev` (code edits), `@QuickDoc` (doc writes), `@ContextScout` (reads). Do NOT dispatch `@ContextInsurgent` or `@HeadWrench` here.

**Target:** {{TASK_3_TARGET}}
**Goal:** {{TASK_3_GOAL}}
**Scope & Constraints:** {{TASK_3_SCOPE_AND_CONSTRAINTS}}

> **Field:** What this agent must NOT touch, must stay within, or special rules. E.g., "Edit only src/auth/; do not touch tests/". Leave blank if none.

## Todo

1. `task` — Dispatch {{TASK_1_AGENT}} to {{TASK_1_GOAL}} in {{TASK_1_TARGET}}
2. `task` — Dispatch {{TASK_2_AGENT}} to {{TASK_2_GOAL}} in {{TASK_2_TARGET}}
3. `task` — Dispatch {{TASK_3_AGENT}} to {{TASK_3_GOAL}} in {{TASK_3_TARGET}}

Call all three task tools before waiting for results — they run in parallel. Remove unused task sections if fewer than three agents are needed (adjust the todo array accordingly).

## Before advancing

If agent results were unexpected, conflicting, or raise questions about how to proceed, consider checking in with the user before calling `next_step()`. This is optional — if results are as expected, advance when ready.
