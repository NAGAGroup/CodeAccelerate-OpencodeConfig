**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-designer
**Required Tools:** init_dag, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Initialize the execution DAG and dispatch dag-designer to translate the plan draft into an executable DAG for agentic workflows.
</goal>

<rules>
Do not make any DAG design decisions yourself — node selection, structure, and component choices are entirely delegated to dag-designer.
Pass the plan document to dag-designer in full and verbatim. Do not summarize, paraphrase, or interpret it.
</rules>

<instructions>
1. Call init_dag with plan name {{PLAN_NAME}}.
2. Load the dag-designer skill. Use it to compose a dispatch prompt where you will provide the drafted plan in full to the subagent.
3. Dispatch dag-designer using the task tool, providing the plan name {{PLAN_NAME}} and the drafted plan from the previous step in full.
4. Call next_step.
</instructions>
