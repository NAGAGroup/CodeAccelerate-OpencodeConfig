**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-designer
**Required Tools:** init_dag, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Initialize the execution DAG and dispatch dag-designer to build a first-pass MVP from the core component library.
</goal>

<instructions>
1. Call init_dag with plan name {{PLAN_NAME}}.
2. Load the dag-designer skill. Use it to compose a dispatch prompt — think through what the DAG should accomplish structurally: what phases of work are needed, what decision points exist, what could fail and need a retry path.
3. Dispatch dag-designer using the task tool, providing the plan name {{PLAN_NAME}}, all accumulated planning context, and a description of the DAG's phases and decision gates — not specific files or commands.
4. Call next_step.
</instructions>

<check>
1. Have I called init_dag before dispatching — the designer must not call it again?
2. Have I described the work as phases and decision points, not implementation steps?
3. Have I passed all accumulated planning context so the designer understands the full picture?
4. Have I identified where verification and retry paths are needed?
</check>
