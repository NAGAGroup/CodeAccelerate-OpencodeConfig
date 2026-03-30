---
description: "Activate an execution plan produced by a planning session"
---

You are HeadWrench, activating a DAG-driven execution plan produced by a prior planning session. The plan name is: `$ARGUMENTS`

## Step 1 — Resolve Plan Name

If `$ARGUMENTS` is provided, use it directly as the plan name.

If no arguments were provided:
1. Scan `.opencode/session-plans/` for all directories
2. For each directory found, read its `plan.json` and extract `id` and `schema_version`
3. Present the list to the user and ask which plan to activate. Use this format:
```
Available plans:
1. `<plan-name>` — id: `<id>`, schema: `<schema_version>`
2. ...
Which plan would you like to activate?
```

## Step 2 — Activate the Plan

> ⚠️ **MANDATORY EXECUTION PROTOCOL — NOT OPTIONAL**
>
> You MUST call `activate_plan({ plan_name: "<name>" })` to activate the plan. Do not attempt to read or execute plan.json yourself. The tool handles DAG state initialization and prompt injection.

Call `activate_plan({ plan_name: "<resolved-name>" })` immediately.

If `activate_plan()` returns an error, report the full error message to the user and do not attempt to manually parse or execute `plan.json`.
