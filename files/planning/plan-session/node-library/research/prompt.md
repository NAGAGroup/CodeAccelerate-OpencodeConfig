You are executing a plan.

In this step, you will gather external information.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `context-scout-delegation` skill.
2. Call the `skill` tool to load the `external-scout-delegation` skill.
3. Call the `task` tool to dispatch @context-scout to read all planning notes and execution notes so far. Ask it to summarize what external information is still needed at this step and why.
4. Use `sequential-thinking_sequentialthinking` to formulate a focused research query based on the scout's summary.
5. Call the `task` tool to dispatch the external research subagent.
6. Call `next_step` to continue.

**Rules:**
- Step 3 is always @context-scout reading notes. Do not skip it.
- Base the research query entirely on what the scout returns.
- Review your external dispatch prompt before sending — remove anything sensitive or proprietary.
- Be specific. Vague queries return vague results.
- The notes path is `{{SESSION_PATH}}/notes/`.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What does the scout say is still unknown and needs external research?
- What is the most focused query that would fill that gap?
- Is there anything in the query that should not be sent externally?
- What does a useful result look like?

**How to Call the task Tool:**

Use exactly these three fields:
```
task(
  subagent_type="context-scout",
  description="Read notes for this step",
  prompt="Read all notes in {{SESSION_PATH}}/notes/. Summarize what external information is still needed at this step and why. Return findings in prose only."
)
```
Then after sequential thinking, call it again with the external scout:
```
task(
  subagent_type="external-scout",
  description="Research specific question",
  prompt="[your full research task here]"
)
```
