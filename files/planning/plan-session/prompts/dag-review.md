**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-reviewer
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Evaluate the first-pass execution DAG through structural validation and deep analysis.
</goal>

<instructions>
1. Use the dag-reviewer skill to compose a dispatch prompt — include your tentative assessment answers from the previous step alongside the user's goal and review scope.
2. Dispatch dag-reviewer using the task tool with plan name {{PLAN_NAME}}, the user's goal, your tentative assessment answers, and the review scope.
3. Call next_step.
</instructions>

<check>
1. Have I provided the user's goal so the reviewer can assess whether the DAG fits it?
2. Have I included my tentative assessment answers — the reviewer uses these as starting points for deep analysis?
3. Have I specified which review dimensions matter most for this plan, or requested a full review?
4. Is the prompt self-contained — the reviewer can retrieve session notes but needs the goal stated explicitly?
</check>
