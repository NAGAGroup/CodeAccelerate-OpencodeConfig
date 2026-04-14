**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, present_plan_diagram, question
**Optional Tools:** None
**Questions Allowed?:** Yes

<goal>
Present the finalized plan to the user and provide instructions for what to do next. Retrieve key planning constraints and decisions to communicate alongside the plan diagram.
</goal>

<rules>
Always present the full finalized plan verbatim.
Always call present_plan_diagram before asking the activation question.
Never activate the plan without explicit user confirmation via the question tool.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "key constraints and limitations from planning" to retrieve constraints the planning session identified.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "important decisions and tradeoffs from planning" to retrieve significant choices made during planning.
3. Present the full finalized plan document to the user. The plan is available from the review-revise step context where create_plan was just called.
4. Call present_plan_diagram with the plan name {{PLAN_NAME}}.
5. Note any important constraints or limitations captured during planning, using the retrieved context.
6. Use the question tool to ask the user if they would like to activate now. If yes, activate the plan using the activate_plan tool; if no, tell them to run /activate-plan {{PLAN_NAME}} when ready.
</instructions>
