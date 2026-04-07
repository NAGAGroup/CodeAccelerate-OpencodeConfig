---
name: qdrant-notes
description: Teaches how to store and retrieve session knowledge using Qdrant for cross-agent knowledge sharing.
---

# Qdrant Notes

Use Qdrant to store findings so they persist across agents and sessions.

## Tools
**qdrant_qdrant-store** — Store findings to a named collection. Key params: `collection_name` (collection to store in), `information` (self-contained prose findings).

**qdrant_qdrant-find** — Retrieve prior findings from a collection. Key params: `collection_name` (collection to search), `query` (natural language description).

## Rules
- Before starting work, call qdrant_qdrant-find to check what's already known
- After completing investigation, call qdrant_qdrant-store before writing final response
- Store as you complete each major finding, not batched at the end
- Write prose with context so another agent can understand without re-investigating
- Use natural language descriptions in find queries, not keywords
- Use reasonable default collection name if none specified

## Anti-patterns
- Do not batch storage to the end and then forget it
- Do not store one-liners without context
- Do not use keywords in find queries
- Do not skip storing if no collection name was given
