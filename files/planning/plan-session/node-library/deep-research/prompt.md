You are executing a plan.

In this step, you will conduct extended external research.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `context-scout-delegation` skill.
2. Call the `skill` tool to load the `external-scout-delegation` skill.
3. Call the `task` tool to dispatch @context-scout to read all planning notes and execution notes so far. Ask it to describe what domain needs exploration, what is already known, and what angles are most valuable to cover.
4. Use `sequential-thinking_sequentialthinking` to formulate a comprehensive research prompt based on the scout's summary.
5. Call the `task` tool to dispatch the external research subagent.
6. Call `next_step` to continue.

**Rules:**
- Step 3 is always @context-scout reading notes. Do not skip it.
- This node is for broad domain exploration. Ask the subagent to cover multiple angles and synthesize findings.
- Review your external dispatch prompt before sending — remove anything sensitive or proprietary.
- The notes path is `{{SESSION_PATH}}/notes/`.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What domain or topic needs thorough exploration based on the scout's summary?
- What are the key angles or sub-questions worth covering?
- Is there anything in the query that should not be sent externally?
- What does a comprehensive result look like for this use case?

**How to Call the task Tool:**

Use exactly these three fields:
```
task(
  subagent_type="context-scout",
  description="Read notes for this step",
  prompt="Read all notes in {{SESSION_PATH}}/notes/. Describe what domain needs exploration, what is already known, and what angles are most valuable to cover. Return findings in prose only."
)
```
Then after sequential thinking, call it again with the external scout:
```
task(
  subagent_type="external-scout",
  description="Deep domain research",
  prompt="[your full research task here]"
)
```
