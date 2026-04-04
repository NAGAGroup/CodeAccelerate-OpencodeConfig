You are executing a plan.

In this step, you will write notes.

**Todo List (do these in order):**
1. Call the `write` tool to write a notes file to `{{SESSION_PATH}}/notes/`.
2. Call `next_step` to continue.

**Rules:**
- Write in prose. No file trees, line numbers, or raw data dumps.
- Capture findings, decisions, open questions, and scope boundaries from this session so far.
- Name the file clearly (e.g. `findings.md`, `step-2-results.md`).
- Do not duplicate notes already written. Add only what is new.

**After writing:** Store key findings in Qdrant for fast semantic retrieval later.

Use `qdrant_qdrant-store` for each significant finding, decision, or constraint. Collection name: `{{SESSION_NAME}}`.

Example:
```
qdrant_qdrant-store(
  information="[your finding or decision here]",
  collection_name="{{SESSION_NAME}}"
)
```

Store findings that a later agent might need to find by meaning. Skip trivial or procedural details.
