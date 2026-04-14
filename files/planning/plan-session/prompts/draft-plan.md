**Plan Name:** {{PLAN_NAME}}
**Required Skills:** planning-schema
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Draft a complete TOML execution plan based on all investigation findings. This is a draft that will be revised after calling next_step. Do not attempt to activate or call create_plan, this is reserved for later. Follow the instructions and do not deviate.
</goal>

<rules>
Never use agentic-decision-gate when user input is required — use user-decision-gate.
Never use user-decision-gate when the executor can decide from evidence — use agentic-decision-gate.
Always branch immediately from the gate — never defer a branch to a later phase.
Always make every leaf a write-notes or early-exit phase.
</rules>

<instructions>
1. Load the planning-schema skill. Study the format and example before writing anything.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve the user's goal.
3. Call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve the user's desired involvement in the plan.
4. Draft your plan in valid TOML format and present it to the user. Continue without waiting for feedback, this is merely to provide auditability.
5. Call next_step.
</instructions>
