**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-reviewer, planning-schema, planning-patterns
**Required Tools:** task, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Dispatch the dag-reviewer for a structured critique of the draft plan, incorporate all feedback, and store the finalized plan.
</goal>

<rules>
Always give dag-reviewer the complete plan document. Do not paraphrase.
Always apply all reviewer feedback.
Never selectively incorporate critique.
Always store the complete, revised plan from the reviewer's critiques in a single qdrant_qdrant-store call. Do not paraphrase.
</rules>

<instructions>
1. Load the dag-reviewer skill. Dispatch the dag-reviewer using the task tool with plan name {{PLAN_NAME}} and the full draft plan from context.
2. Revise the plan according the reviewer's feedback.
3. Reload the planning-schema skill.
4. Ensure your final plan matches the markdown schema exactly. Do not modify capitalization, add fields, etc.
5. Store the finalized plan as a single note using qdrant_qdrant-store in the tui-app-demo-design-and-implementation collection.
6. Call next_step.
</instructions>

