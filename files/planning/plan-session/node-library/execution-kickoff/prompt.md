**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** present_plan_diagram, qdrant_qdrant-find
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve planning context and orient to the plan's goal before execution begins.
</goal>

<rules>
Always provide accumulated session context to subagents for steps that delegate. They don't have access to the full session context, so it's your responsibility to share relevant information with them.
Never delegate for any other reason than what the goal states at each step. Trust that the plan will guide you to delegate what is necessary. Don't delegate unless instructed to at any given step.
</rules>

<instructions>
1. Call the present_plan_diagram tool with {{PLAN_NAME}} to get the current plan diagram.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve the user's goal and involvement preference as stored in session notes during the session overview step.
3. Call qdrant_qdrant-find 3-5 times with varied queries and collection {{PLAN_NAME}} to the retrieve the full planning context.
4. Call next_step.
</instructions>
