You are executing a plan.

In this step, you will run project commands.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `context-scout-delegation` skill.
2. Call the `skill` tool to load the `tailwrench-delegation` skill.
3. Call the `task` tool to dispatch @context-scout to read all planning notes and execution notes so far. Ask it to summarize what commands need to run at this step and why.
4. Use `sequential-thinking_sequentialthinking` to decide what commands to run and formulate your dispatch prompt.
5. Call the `task` tool to dispatch the command-running subagent.
6. Call `next_step` to continue.

**Rules:**
- Step 3 is always @context-scout reading notes. Do not skip it.
- Base the command list entirely on what the scout returns.
- Be precise about what to run and in what order.
- The notes path is `{{SESSION_PATH}}/notes/`.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What does the scout say needs to run at this step?
- In what order should the commands run?
- What does a successful outcome look like?
- Are there any preconditions to check before running?

**How to Call the task Tool:**

Use exactly these three fields:
```
task(
  subagent_type="context-scout",
  description="Read notes for this step",
  prompt="Read all notes in {{SESSION_PATH}}/notes/. Summarize what commands need to run at this step and why. Return findings in prose only."
)
```
Then after sequential thinking, call it again with tailwrench:
```
task(
  subagent_type="tailwrench",
  description="Run project commands",
  prompt="[your full command task here]"
)
```
