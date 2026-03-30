# Parallel Tasks

Dispatch the following agents in parallel. Call all `task` tools sequentially — OpenCode runs them concurrently.

## Task 1

**Agent:** {{TASK_1_AGENT}}
**Target:** {{TASK_1_TARGET}}
**Goal:** {{TASK_1_GOAL}}
**Constraints:** {{TASK_1_CONSTRAINTS}}

## Task 2

**Agent:** {{TASK_2_AGENT}}
**Target:** {{TASK_2_TARGET}}
**Goal:** {{TASK_2_GOAL}}
**Constraints:** {{TASK_2_CONSTRAINTS}}

## Task 3

**Agent:** {{TASK_3_AGENT}}
**Target:** {{TASK_3_TARGET}}
**Goal:** {{TASK_3_GOAL}}
**Constraints:** {{TASK_3_CONSTRAINTS}}

## Todo

1. `task` — Dispatch {{TASK_1_AGENT}} to {{TASK_1_GOAL}} in {{TASK_1_TARGET}}
2. `task` — Dispatch {{TASK_2_AGENT}} to {{TASK_2_GOAL}} in {{TASK_2_TARGET}}
3. `task` — Dispatch {{TASK_3_AGENT}} to {{TASK_3_GOAL}} in {{TASK_3_TARGET}}

Call all three task tools before waiting for results — they run in parallel. Remove unused task sections if fewer than three agents are needed (adjust the todo array accordingly).

## Before advancing

If agent results were unexpected, conflicting, or raise questions about how to proceed, consider checking in with the user before calling `next_step()`. This is optional — if results are as expected, advance when ready.
