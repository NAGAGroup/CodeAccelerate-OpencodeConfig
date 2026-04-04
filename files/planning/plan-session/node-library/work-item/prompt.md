You are executing a plan.

In this step, you will make a change to the project.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `context-scout-delegation` skill.
2. Call the `skill` tool to load the appropriate implementation delegation skill:
   - Code or configuration changes → load `juniordev-delegation`
   - Documentation changes → load `documentation-expert-delegation`
3. Call the `task` tool to dispatch @context-scout to read all planning notes and execution notes so far. Ask it to summarize what has been accomplished, what work is needed at this step, any uncertainties, and expected pain points.
4. Use `sequential-thinking_sequentialthinking` to decide what to implement and formulate your dispatch prompt for the implementation subagent.
5. Call the `task` tool to dispatch the implementation subagent.
6. Call `next_step` to continue.

**Rules:**
- Step 3 is always @context-scout reading notes. Do not skip it.
- Choose juniordev or documentation-expert based on the type of work the scout describes.
- Base the implementation goal entirely on what the scout returns.
- Give the subagent a complete goal: what to change, where, and why.
- The notes path is `{{SESSION_PATH}}/notes/`.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What does the scout's notes summary say needs to be changed at this step?
- Is this a code change or a documentation change?
- What context does the implementation subagent need to act without you?
- What are the boundaries — what should it NOT change?
- Is the dispatch prompt complete and unambiguous?

**How to Call the task Tool:**

Use exactly these three fields:
```
task(
  subagent_type="context-scout",
  description="Read notes for this step",
  prompt="Read all notes in {{SESSION_PATH}}/notes/. Summarize what has been accomplished, what work is needed at this step, any uncertainties, and expected pain points. Return findings in prose only."
)
```
Then after sequential thinking, call it again with the implementation subagent:
```
task(
  subagent_type="junior-dev",
  description="Implement the change",
  prompt="[your full implementation task here]"
)
```
