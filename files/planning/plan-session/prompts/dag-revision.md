**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-reviser
**Required Tools:** reset_entry_exit_points, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Substantially improve the execution DAG using the full component library and the reviewer's critique.
</goal>

<instructions>
1. Call reset_entry_exit_points with plan name {{PLAN_NAME}} to clear the entry/exit markers from the first-pass DAG — this gives the reviser a clean structural slate to work with.
2. Use the dag-reviser skill to compose a dispatch prompt — think through the reviewer's critique, your tentative assessment, and how they inform the improvements needed.
3. Dispatch dag-reviser using the task tool with plan name {{PLAN_NAME}}, the reviewer's critique verbatim or closely paraphrased, your tentative assessment, and clear instructions that this is a second-pass improvement to address every critique point.
4. Call next_step.
</instructions>

<check>
1. Have I called reset_entry_exit_points first to clear stale entry/exit markers?
2. Have I included the reviewer's critique verbatim or closely paraphrased — the reviser needs the exact findings?
3. Have I included my tentative assessment to provide additional context?
4. Does the reviser know to use the full catalogue (no variant restriction)?
5. Have I made clear this is a second-pass improvement, not just a patch pass?
</check>
