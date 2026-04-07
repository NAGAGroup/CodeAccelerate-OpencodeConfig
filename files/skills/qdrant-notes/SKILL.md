---
name: qdrant-notes
description: Teaches how to store and retrieve session knowledge using Qdrant for cross-agent knowledge sharing.
---

# Qdrant Notes

Use Qdrant to store findings so they persist across agents and sessions. Always store before returning your final response.

## Tools

**qdrant_qdrant-store** — Store findings to a named collection
- `collection_name`: The collection to store in (use the name from your dispatch prompt, or "prompt-engineering-test-harness" if none specified)
- `information`: Your findings as self-contained prose — write as if another agent with no context will read this

**qdrant_qdrant-find** — Retrieve prior findings from a collection
- `collection_name`: The collection to search
- `query`: Natural language description of what you're looking for

## Usage Pattern

**Before starting work:** If your dispatch prompt names a Qdrant collection, call `qdrant_qdrant-find` to check what's already known. This avoids re-discovering what a prior agent already found.

**After completing investigation:** Call `qdrant_qdrant-store` with your findings before writing your final response. This is required — do not skip it.

## Anti-patterns

- Do not batch storage to the end and then forget it — store as you complete each major finding
- Do not store one-liners — write prose with enough context that another agent can understand without re-investigating
- Do not use keywords in find queries — use natural language descriptions of what you're looking for
- Do not skip storing if no collection name was given — use a reasonable default collection name
