---
description: "Activate an execution plan produced by a planning session"
---

Activate an execution plan. The plan name is: `$ARGUMENTS`

## Step 1 — Resolve Plan Name

If `$ARGUMENTS` is provided, use it directly as the plan name.

If no arguments were provided:
1. Scan `.opencode/session-plans/` for all directories
2. For each directory found, read its `plan.json` and extract `id`, `goal`, `status`, and `session_type`
3. Present the list to the user and ask which plan to activate

## Step 2 — Activate the Plan

> ⚠️ **MANDATORY EXECUTION PROTOCOL — NOT OPTIONAL**
>
> You MUST call `activate_plan({ plan_name: "<name>" })` to activate the plan. Do not attempt to read or execute plan.json yourself. The tool handles DAG state initialization and prompt injection.

Call `activate_plan({ plan_name: "<resolved-name>" })` immediately.
