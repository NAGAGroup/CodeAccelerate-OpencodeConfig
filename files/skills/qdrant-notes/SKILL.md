---
name: qdrant-notes
description: Teaches how to store and retrieve session knowledge using Qdrant for cross-agent knowledge sharing.
---

# What does this skill teach?

In this skill, you learn how to store and retrieve findings using Qdrant so knowledge persists across agents and sessions within a plan.

## Related Tools

### `qdrant_qdrant-store`

| Parameter | Description |
|-----------|-------------|
| `collection_name` | The plan name or session identifier to store findings under (required) |
| `information` | Self-contained prose findings — written so another agent can understand without re-investigating (required) |
| `metadata` | Optional JSON object with additional context (optional) |

### `qdrant_qdrant-find`

| Parameter | Description |
|-----------|-------------|
| `collection_name` | The plan name or session identifier to search within (required) |
| `query` | Natural language description of what you're looking for (required) |

## How to use session notes

1. At the start of your work, call `qdrant_qdrant-find` to check what prior agents have already discovered — avoid re-investigating what's already known
2. As you complete each major finding, call `qdrant_qdrant-store` — don't batch everything to the end
3. Before writing your final response, call `qdrant_qdrant-store` with a summary of your work so the next agent can orient quickly

## How to write good notes

- Write prose with full context — a note that says "auth is in auth.ts" is useless; a note that explains what the auth module does, how it's structured, and what depends on it is valuable
- Use natural language queries in `qdrant_qdrant-find` — describe what you're looking for, not keywords
- If no collection name was provided, use a reasonable default based on the task

## How to think through this skill

<|think|>
- Have I checked what's already known before starting — am I about to re-investigate something a prior agent already covered?
- Am I storing findings as I go, or am I risking losing them if something goes wrong before the end?
- Is each note I'm storing self-contained — could another agent understand it without reading my full conversation?
- Am I using natural language in my find queries, not keywords?
- Have I stored a final summary before writing my response so the next agent can orient quickly?
