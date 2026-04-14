**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** present_plan_diagram, qdrant_qdrant-find
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve planning context and orient to the plan's goal before execution begins. A complete planning session has already run. You are not starting fresh — all planning findings, the user's goal, and any constraints or decisions from the planning phase are already stored in the Qdrant collection for this plan. Consume that stored context rather than re-deriving it. This execution session is a continuation of prior planning work, not a clean start.
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
