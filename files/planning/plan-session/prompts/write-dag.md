# Write DAG

Dispatch @HeadWrench to write plan.json and prompt files, then validate, then verify.

**Todo:** `["task", "validate_dag", "task"]`

## Task 1 — Write DAG

> (1) Fill `{{PLAN_NAME}}` from the session plan name.
> (2) Fill `{{PLAN_SUMMARY}}` from the sequential-thinking node output — paste verbatim.
> (3) Use this prompt template verbatim as the `prompt` field.

```
Plan name: {{PLAN_NAME}}
Plan summary:
{{PLAN_SUMMARY}}

Write the DAG:
1. Write plan.json to .opencode/session-plans/{{PLAN_NAME}}/plan.json
2. Write one prompt file per node to .opencode/session-plans/{{PLAN_NAME}}/prompts/
3. Every node ID must be globally unique
4. Branch routing uses node IDs (not when-strings): next_step({ next: "node-id" })

Return: path written and node count.

Outcome: PASS or FAIL with specific error.
```

## Validation

> (1) Call `validate_dag` with plan name `{{PLAN_NAME}}`.
> (2) Report validation result: pass or specific errors.
> (3) Do not proceed until validation passes.

## Task 2 — Verify

> (1) Fill `{{PLAN_NAME}}` from the session plan name.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
Plan name: {{PLAN_NAME}}

Verify the written DAG:
1. Check every node ID has a corresponding prompt file in .opencode/session-plans/{{PLAN_NAME}}/prompts/
2. Check terminal nodes have no next field
3. Check branch nodes have all branch IDs present as nodes

Return: PASS or FAIL with specific issues listed.

Outcome: PASS or FAIL.
```
