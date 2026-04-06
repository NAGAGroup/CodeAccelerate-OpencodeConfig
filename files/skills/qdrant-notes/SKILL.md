---
name: qdrant-notes
description: Teaches how to store and retrieve session knowledge using Qdrant for cross-agent knowledge sharing.
---

# Qdrant Notes

Use Qdrant to store and retrieve session knowledge that persists across agents and the entire session.

## How to Use

**Retrieve knowledge** — When your dispatch prompt mentions a Qdrant collection, call qdrant_qdrant-find immediately with collection_name (from dispatch prompt) and query (natural language describing what you're looking for). Use semantic language, not keywords.

**Store findings** — Call qdrant_qdrant-store with collection_name and information (your findings as prose with enough context to be standalone). Store immediately after discovering, not batched at the end.

## Rules

Retrieve from Qdrant before starting work — use qdrant_qdrant-find to check what's already known and avoid re-discovering. Use the exact collection_name from your dispatch prompt; using wrong collection loses context. Write stored information as prose with sufficient context — another agent with no context should understand what you found. Store findings immediately after discovering them, not batched. Query Qdrant with natural language, not keywords. Read retrieved results carefully before proceeding — you may not need to re-discover what's already known. Store only verified findings from investigation, not speculation.
