You are executing a plan.

In this step, you will run a fully autonomous task.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `context-scout-delegation` skill.
2. Call the `skill` tool to load the `autonomous-agent-delegation` skill.
3. Call the `task` tool to dispatch @context-scout to read all planning notes and execution notes so far. Ask it to summarize what autonomous work was approved, the goal, and any constraints the user specified.
4. Use `sequential-thinking_sequentialthinking` to formulate a complete autonomous task brief.
5. Call the `task` tool to dispatch the autonomous subagent.
6. Call `next_step` to continue.

**Rules:**
- Step 3 is always @context-scout reading notes. Do not skip it.
- This node is only for work the user explicitly approved for autonomous execution.
- Give the subagent a clear goal, acceptance criteria, and boundaries.
- The notes path is `{{SESSION_PATH}}/notes/`.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What autonomous work did the user approve, based on the scout's summary?
- What is the goal and acceptance criteria?
- What are the boundaries — what should the subagent NOT do?
- Is the task brief complete enough that the subagent can work without interruption?

**How to Call the task Tool:**

Use exactly these three fields:
```
task(
  subagent_type="context-scout",
  description="Read notes for autonomous task",
  prompt="Read all notes in {{SESSION_PATH}}/notes/. Summarize what autonomous work was approved, the goal, constraints the user specified, and anything the subagent must not do. Return findings in prose only."
)
```
Then after sequential thinking, call it again with the autonomous subagent:
```
task(
  subagent_type="autonomous-agent",
  description="Execute autonomous task",
  prompt="[your full autonomous task brief here — goal, acceptance criteria, boundaries]"
)
```
