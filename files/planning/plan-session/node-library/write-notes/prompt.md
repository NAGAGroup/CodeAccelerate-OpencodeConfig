You are storing accumulated findings to the semantic notes system.

Use the qdrant_qdrant-store tool to store significant findings, decisions, and constraints. Use the collection name {{PLAN_NAME}}.

Call the qdrant_qdrant-store tool for each significant finding or decision. Write the information parameter in prose — describe what was found, decided, or discovered. Store findings that a later agent might need to find by meaning. Skip trivial or procedural details.

Example:
```
qdrant_qdrant-store(
  information="[your finding or decision here]",
  collection_name="{{PLAN_NAME}}"
)
```

After storing all significant findings, call next_step to continue.

**Constraints:** Store findings to the semantic notes system only — do not write files. Each finding should be self-contained and discoverable by semantic search.
