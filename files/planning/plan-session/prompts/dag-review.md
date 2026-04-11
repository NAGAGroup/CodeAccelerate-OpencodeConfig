**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-reviewer
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Evaluate the initial drafted plan and the associated DAG for correctness and improvements using the dag-reviewer's expertise in effective plan design.
</goal>

<rules>
Do not make any evaluation or quality judgments about the DAG yourself — all review is delegated to dag-reviewer.
Pass the plan document to dag-reviewer in full and verbatim. Do not summarize, paraphrase, or interpret it.
Do not act on the reviewer's findings. Do not modify the DAG. Changes belong to the revision step.
</rules>

<instructions>
1. Load the dag-reviewer skill. Use it to compose a dispatch prompt.
2. Dispatch dag-reviewer using the task tool with plan name {{PLAN_NAME}} and your plan draft, in full. Do not include anything from the dag-designer's session in this prompt, the dag-designer will access this via the notes system.
3. Call next_step.
</instructions>
