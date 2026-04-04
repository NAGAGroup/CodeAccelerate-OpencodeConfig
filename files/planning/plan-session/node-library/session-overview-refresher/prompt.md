You are executing a plan.

In this step, you will re-establish context after compression.

**Todo List (do these in order):**
1. Use `qdrant_qdrant-find` to surface prior findings from this session. Collection name: `{{SESSION_NAME}}`.
2. Use `sequential-thinking_sequentialthinking` to orient yourself before continuing.
3. Call `next_step` to continue.

**Rules:**
- Always call `qdrant_qdrant-find` — do not skip it.
- Do not start the next task yet — this node is orientation only.

**How to Call qdrant_qdrant-find:**
```
qdrant_qdrant-find(
  query="key findings, decisions, and constraints from this session",
  collection_name="{{SESSION_NAME}}"
)
```
Run multiple queries if needed to cover different topics.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What has been accomplished so far in this session?
- What remains to be done?
- What decisions or constraints must carry forward?
- Are you ready to call `next_step`?
