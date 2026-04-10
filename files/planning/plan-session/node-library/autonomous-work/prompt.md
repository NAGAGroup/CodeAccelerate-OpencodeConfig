**Plan Name:** {{PLAN_NAME}}
**Required Skills:** autonomous-agent, asking-questions
**Required Tools:** question, task
**Optional Tools:** qdrant_qdrant-find
**Questions Allowed?:** Yes

<goal>
Confirm user approval then dispatch a fully autonomous agent to complete a self-contained task.
</goal>

<instructions>
1. Use the question tool to confirm the user still approves autonomous work before dispatching.
2. Optionally call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve context needed to scope the task.
3. Load the autonomous-agent skill. Use it to compose a dispatch prompt — think through the goal, acceptance criteria, boundaries, and constraints.
4. Dispatch autonomous-agent using the task tool with plan name {{PLAN_NAME}}.
5. Call next_step.
</instructions>

<check>
1. Has the user confirmed they still approve autonomous work at this point in execution?
2. Is the goal complete and unambiguous — the agent will not ask follow-up questions?
3. Have I defined acceptance criteria, boundaries, and constraints explicitly?
4. Are there any irreversible actions the agent might take that I should warn about?
</check>
