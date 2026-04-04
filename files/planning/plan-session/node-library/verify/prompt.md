You are executing a plan.

In this step, you will verify that work has been completed correctly.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `context-scout-delegation` skill.
2. Call the `skill` tool to load the `tailwrench-delegation` skill.
3. Call the `task` tool to dispatch @context-scout to read all planning notes and execution notes so far. Ask it to summarize what was just implemented, what a successful outcome looks like, and any uncertainties or risk areas.
4. Use `sequential-thinking_sequentialthinking` to decide what to verify and formulate your dispatch prompt.
5. Call the `task` tool to dispatch the verification subagent.
6. Call `next_step` to continue.

**Rules:**
- Step 3 is always @context-scout reading notes. Do not skip it.
- Base the verification target entirely on what the scout returns.
- Tell the subagent exactly what a passing result looks like.
- The notes path is `{{SESSION_PATH}}/notes/`.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What does the scout say was just implemented? What should be verified?
- What does a passing result look like? What does a failing result look like?
- What checks or commands are appropriate?
- What should the subagent report back?

**How to Call the task Tool:**

Use exactly these three fields:
```
task(
  subagent_type="context-scout",
  description="Read notes for this step",
  prompt="Read all notes in {{SESSION_PATH}}/notes/. Summarize what was just implemented, what a successful outcome looks like, and any uncertainties or risk areas. Return findings in prose only."
)
```
Then after sequential thinking, call it again with tailwrench:
```
task(
  subagent_type="tailwrench",
  description="Verify implementation",
  prompt="[your full verification task here]"
)
```
