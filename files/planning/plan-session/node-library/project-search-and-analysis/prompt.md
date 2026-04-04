You are executing a plan.

In this step, you will investigate the project.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `context-scout-delegation` skill.
2. Call the `skill` tool to load the appropriate second delegation skill:
   - Wide, broad survey → load `context-scout-delegation` again
   - Narrow, targeted analysis → load `context-insurgent-delegation`
3. Call the `task` tool to dispatch @context-scout to read all planning notes and execution notes so far. Ask it to summarize what has been learned, what investigation is still needed at this step, any uncertainties, and expected difficulties.
4. Use `sequential-thinking_sequentialthinking` to decide what to investigate and formulate your dispatch prompt for the investigation subagent.
5. Call the `task` tool to dispatch the investigation subagent.
6. Call `next_step` to continue.

**Rules:**
- Step 3 is always @context-scout reading notes. Do not skip it.
- Base your investigation goal entirely on what the scout returns.
- Ask for prose findings only. No file trees or raw lists.
- The notes path is `{{SESSION_PATH}}/notes/`.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What does the scout's notes summary say is needed at this step?
- Should this be wide-and-shallow or narrow-and-deep?
- What specific questions should the investigation subagent answer?
- Does your dispatch prompt give clear direction without prescribing what to find?

**How to Call the task Tool:**

Use exactly these three fields:
```
task(
  subagent_type="context-scout",
  description="Read notes for this step",
  prompt="Read all notes in {{SESSION_PATH}}/notes/. Summarize what has been learned, what investigation is still needed at this step, any uncertainties, and expected difficulties. Return findings in prose only."
)
```
Then after sequential thinking, call it again with the investigation subagent:
```
task(
  subagent_type="context-insurgent",
  description="Investigate specific area",
  prompt="[your full investigation task here]"
)
```
