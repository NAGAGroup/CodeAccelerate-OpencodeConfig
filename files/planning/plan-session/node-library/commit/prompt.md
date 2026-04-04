You are executing a plan.

In this step, you will commit the current changes.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `context-scout-delegation` skill.
2. Call the `skill` tool to load the `tailwrench-delegation` skill.
3. Call the `task` tool to dispatch @context-scout to read all planning notes and execution notes so far. Ask it to summarize what changes were made since the last commit and whether the project is in a stable state.
4. Use `sequential-thinking_sequentialthinking` to decide what to commit and formulate your dispatch prompt.
5. Call the `task` tool to dispatch the commit subagent.
6. Call `next_step` to continue.

**Rules:**
- Step 3 is always @context-scout reading notes. Do not skip it.
- Base the commit scope entirely on what the scout returns.
- Describe what was changed so the subagent can write a meaningful commit message.
- Do not commit secrets or credentials.
- The notes path is `{{SESSION_PATH}}/notes/`.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What changes does the scout say were made since the last commit?
- Is the project in a stable, committable state?
- What is the right commit message for this checkpoint?
- Are there any files that should NOT be committed?

**How to Call the task Tool:**

Use exactly these three fields:
```
task(
  subagent_type="context-scout",
  description="Read notes for this step",
  prompt="Read all notes in {{SESSION_PATH}}/notes/. Summarize what changes were made since the last commit and whether the project is in a stable state. Return findings in prose only."
)
```
Then after sequential thinking, call it again with tailwrench:
```
task(
  subagent_type="tailwrench",
  description="Commit changes",
  prompt="[your full commit task here]"
)
```
