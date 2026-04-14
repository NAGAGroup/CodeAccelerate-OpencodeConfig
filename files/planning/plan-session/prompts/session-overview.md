**Plan Name:** {{PLAN_NAME}}
**Required Skills:** following-plans
**Required Tools:** choose_plan_name, qdrant_qdrant-store, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Establish plan identity and store the user's goal and constraints to durable session memory. This node anchors the entire planning session — all downstream findings and decisions reference the collection created here.
</goal>

<rules>
Always name the plan after what it will accomplish, not the planning session itself.
Always use lowercase with hyphens only.
Always store the user's goal verbatim, without paraphrasing.
</rules>

<instructions>
1. Call choose_plan_name with a descriptive, lowercase, hyphenated plan name.
2. Call qdrant_qdrant-store with collection {{PLAN_NAME}} to store: "USER GOAL: [their goal verbatim]"
3. Call qdrant_qdrant-store with collection {{PLAN_NAME}} to store the user's involvement preference. Use these dimensions: Does the user want to approve decisions? Review intermediate results before the plan proceeds? Remain hands-off? Need visibility into execution but not decision-making? Store this as a concrete, queryable note so downstream steps know what structural choices the user's involvement imposes.
4. Call qdrant_qdrant-store with collection {{PLAN_NAME}} to store any scope constraints, exclusions, or priorities the user expressed. Examples: things to avoid, timelines, budget constraints, must-work compatibility requirements, forbidden dependencies. Store these as a structured note—another agent retrieving this should immediately understand what the user's constraints require.
5. Call next_step.
</instructions>
