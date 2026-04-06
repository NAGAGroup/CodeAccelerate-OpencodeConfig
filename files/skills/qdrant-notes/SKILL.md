---
name: qdrant-notes
description: How to store and find session knowledge using the Qdrant semantic memory tools
---

# Qdrant Notes

## Purpose

Two tools are available for session knowledge:

- `qdrant_qdrant-store` — store a finding, decision, or piece of context
- `qdrant_qdrant-find` — retrieve relevant findings by meaning

Use these tools to store all session knowledge. Qdrant is the sole persistent record for findings, decisions, and context.

## Collection Name

Every call requires a `collection_name`. Use `{{PLAN_NAME}}` as the collection name. This isolates all stored findings to the current session.

## When to Store

Store a finding when:
- You discover a key constraint or requirement
- You make a decision that affects later work
- You complete a step and the outcome matters to future steps
- A subagent returns a significant finding

Store it immediately after the finding is made. Do not batch.

## When to Find

Use `qdrant_qdrant-find` instead of reading multiple notes files when:
- You need specific information and don't know which file contains it
- You want to check if something was already decided or discovered
- You are working deep in a DAG and need context from early steps

One `qdrant_qdrant-find` call replaces many sequential file reads.

## How to Store

```
qdrant_qdrant-store(
  information="The target module uses lazy initialization. Changing the constructor signature breaks all callers.",
  collection_name="{{PLAN_NAME}}"
)
```

With optional metadata:
```
qdrant_qdrant-store(
  information="Decision: use approach B for the data pipeline. Approach A was ruled out due to memory constraints.",
  collection_name="{{PLAN_NAME}}",
  metadata={"step": "research", "type": "decision"}
)
```

## How to Find

```
qdrant_qdrant-find(
  query="what constraints did we find about the initialization sequence",
  collection_name="{{PLAN_NAME}}"
)
```

```
qdrant_qdrant-find(
  query="decisions made about the data pipeline approach",
  collection_name="{{PLAN_NAME}}"
)
```

## Rules

- Always use `{{PLAN_NAME}}` as the collection name. Never use a hardcoded name.
- Store findings immediately — do not wait until the end of a step.
- Write queries in natural language. Describe what you are looking for, not keywords.
- These tools are available at any point. They do not count as todo steps.
