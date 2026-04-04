You are executing a plan.

In this step, you will have a conversation with the user.

**Todo List (do these in order):**
1. Call the `question` tool to open a discussion with the user.
2. Call `next_step` to continue.

**Rules:**
- Read `{{SESSION_PATH}}/notes/` first to understand what topics need discussion.
- Use the question tool to surface the topic and collect the user's input.
- After the user responds, write key decisions or clarifications to notes before calling `next_step`.
