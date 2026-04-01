# Write DAG

Dispatch @HeadWrench to write plan.json and prompt files, then validate, then verify.

**Todo:** `["task", "validate_dag", "task"]`

> (1) Fill `{{PLAN_NAME}}` from the session plan name.
> (2) Fill `{{PLAN_SUMMARY}}` from the sequential-thinking node output — paste the full ASCII diagram and node decomposition table verbatim.
> (3) Use this prompt template verbatim as the `prompt` field.

```
You are operating as a subagent. Do not ask the user questions. Do not call plan_session, activate_plan, or next_step — those tools are forbidden in this context.

Plan name: {{PLAN_NAME}}
Session plan directory: .opencode/session-plans/{{PLAN_NAME}}/

Plan summary (node decomposition):
{{PLAN_SUMMARY}}

Your job: write the DAG files using the Write tool directly.

Write plan.json to .opencode/session-plans/{{PLAN_NAME}}/plan.json using this schema:

{
  "schema_version": "2.0",
  "id": "{{PLAN_NAME}}",
  "entry": {
    "id": "session-overview",
    "prompt": "session-overview.md",
    "todo": [],
    "next": { ... remaining nodes as nested "next" objects or arrays for branches ... }
  }
}

Rules:
1. Every node must have: id (kebab-case, globally unique), prompt (filename.md), todo (array)
2. Linear next: "next": { ...node... }
3. Branch next: "next": [ { "when": "label", "node": {...} }, ... ]
4. Terminal nodes omit the "next" field entirely
5. Branch routing uses node IDs, not when-strings

Write one prompt .md file per node to .opencode/session-plans/{{PLAN_NAME}}/prompts/<node-id>.md

Each prompt file must describe what HeadWrench does at that node, the todo array contents, and any dispatch instructions.

Return: list of files written and total node count.

Outcome: PASS or FAIL with specific error.
```

> (1) Call `validate_dag` with plan name `{{PLAN_NAME}}`.
> (2) If validation fails, dispatch a second @HeadWrench task to fix the specific errors before proceeding.
> (3) Do not proceed until validation passes.

> (1) Fill `{{PLAN_NAME}}` from the session plan name.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
You are operating as a subagent. Do not ask the user questions. Do not call plan_session, activate_plan, or next_step.

Plan name: {{PLAN_NAME}}

Verify the written DAG:
1. Read .opencode/session-plans/{{PLAN_NAME}}/plan.json
2. For each node ID in the DAG, confirm a prompt file exists at .opencode/session-plans/{{PLAN_NAME}}/prompts/<node-id>.md
3. Confirm terminal nodes have no "next" field
4. Confirm branch nodes list all branch node IDs as actual nodes in the DAG

Return: PASS or FAIL with specific issues listed.

Outcome: PASS or FAIL.
```
