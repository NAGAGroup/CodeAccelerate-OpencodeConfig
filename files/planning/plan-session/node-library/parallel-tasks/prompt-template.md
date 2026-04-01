# Parallel Tasks

Dispatch multiple independent tasks in a single turn.

**Todo:** `["task", "task"]`

**Zone 1 — Fixed execution spec:**

> (1) All tasks run concurrently — call all `task` tools sequentially in one response turn. (2) Each task is fully independent: no task reads output from another, no task depends on another completing first. (3) If tasks share target files or depend on each other, use sequential nodes instead. (4) After all tasks return, call `next_step()` immediately — do not wait or verify results yourself. (5) Output: dispatch prompts for each task with exact file paths, observable outcomes (not process descriptions), scope constraints, and success criteria.

**Zone 2 — Planning agent fills per task:**

**Task 1:**
- {{TASK_1_AGENT}}: agent name. ✓ "@JuniorDev" or "@QuickDoc" ✗ "a dev agent"
- {{TASK_1_TARGET}}: repo-relative file path(s). ✓ "src/kernels/matmul.cpp" ✗ "the kernel module"
- {{TASK_1_GOAL}}: observable outcome. ✓ "Add `computeL2Norm()` function and declare it in include/kernels/matmul.hpp" ✗ "Fix the norm logic"
- {{TASK_1_CONSTRAINTS}}: scope boundaries, style references. ✓ "Match error handling in src/kernels/reduction.cpp; do not modify generated CMake files" ✗ "Keep style consistent"
- {{TASK_1_SUCCESS_CRITERION}}: testable endpoint. ✓ "Function is declared in header and project compiles without errors" ✗ "Task 2 will use this"

**Task 2:** (same fields as Task 1, with {{TASK_2_*}} placeholders)
- {{TASK_2_AGENT}}, {{TASK_2_TARGET}}, {{TASK_2_GOAL}}, {{TASK_2_CONSTRAINTS}}, {{TASK_2_SUCCESS_CRITERION}}

**Zone 3 — Fixed constraints:**

Tasks must be genuinely independent — no shared state, no output-chaining. Update the `todo` array via `modify_node` if you add or remove tasks; the todo count must match the number of task sections. Do not name tasks with bold headers in dispatch prompts; use imperative directives instead. Omit `task_id` from dispatch prompts unless resuming a prior session (then use exact `ses_*` string). Call `next_step()` after all tasks return.
