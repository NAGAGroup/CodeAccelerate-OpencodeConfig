You are executing a plan.

In this step, the user will choose a path forward.

**Todo List (do these in order):**
1. Call the `question` tool to present the decision to the user and collect their choice.
2. Call `next_step` with the chosen branch ID.

**Rules:**
- Read `{{SESSION_PATH}}/notes/` first to understand the context for this decision.
- Present the options clearly. Include enough context for the user to choose.
- Do not make the choice yourself. This node exists because the user must decide.
- Call `next_step({ next: "<branch-id>" })` with the exact node ID matching the user's choice.
