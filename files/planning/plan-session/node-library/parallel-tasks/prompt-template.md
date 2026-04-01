# Parallel Tasks

Dispatch multiple independent tasks in a single turn.

**Todo:** `["task", "task"]`

## Zone 1 — Fixed execution spec

1. Dispatch all tasks in a single response turn — todo array count = task count
2. Each task is independent — do not chain outputs
3. For each task, fill its `{{TASK_N_PROMPT}}` template and use it verbatim as that task's `prompt` field

**Task 1 template:**
```
{{TASK_1_PROMPT}}
```

**Task 2 template:**
```
{{TASK_2_PROMPT}}
```

## Zone 2 — Planning agent fills

**{{TASK_1_AGENT}}**
Exact agent name from the registry.
✓ Good: `@context-scout` or `@JuniorDev`
✗ Bad: "a scout agent"

**{{TASK_1_PROMPT}}**
The complete prompt for Task 1 — write it as a self-contained instruction block with specific file list, specific goal, and explicit return format.
✓ Good: "Edit src/auth/login.py and add `validate_token()` function. Register it in src/api/routes.py. Match error handling in src/auth/session.py. Return DONE when all tests pass."
✗ Bad: "Analyze the auth system"

**{{TASK_2_AGENT}}**
Exact agent name from the registry.
✓ Good: `@QuickDoc` or `@context-scout`
✗ Bad: "a dev agent"

**{{TASK_2_PROMPT}}**
The complete prompt for Task 2 — write it as a self-contained instruction block with specific file list, specific goal, and explicit return format.
✓ Good: "Update docs/api.md to document the new `validate_token()` function. Include signature, parameters, return type, and one example. Return DONE when file is saved."
✗ Bad: "Fix the docs"

## Zone 3 — Fixed constraints

Tasks must not share state or read output from each other. Update the `todo` array via `modify_node` if you add or remove tasks. Do not include `task_id` in dispatch prompts unless resuming a prior session.
