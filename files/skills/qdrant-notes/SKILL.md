---
name: qdrant-notes
description: Teaches how to store and retrieve session knowledge using Qdrant for cross-agent knowledge sharing.
---

# Qdrant Notes

This skill teaches how to store and retrieve session knowledge using the qdrant_qdrant-store and qdrant_qdrant-find tools. Load it when your dispatch prompt mentions Qdrant or when you need to access accumulated session knowledge. Qdrant stores structured knowledge that persists across the entire session and can be accessed by any agent.

## How to Retrieve and Store Knowledge

When your dispatch prompt mentions a Qdrant collection, retrieve accumulated knowledge immediately using qdrant_qdrant-find:

```
qdrant_qdrant-find({
  collection_name: "rebuild-files-from-spec",
  query: "authentication token expiration handling"
})
```

Store findings immediately after discovering them using qdrant_qdrant-store:

```
qdrant_qdrant-store({
  collection_name: "rebuild-files-from-spec",
  information: "Found that authentication uses JWT tokens with 24-hour expiration. Refresh tokens are implemented in auth/refresh.ts and return a new JWT."
})
```

## Rules

Retrieve accumulated knowledge before starting your work — use the qdrant_qdrant-find query to check what has already been discovered. Specify the exact collection_name provided in your dispatch prompt; using the wrong collection loses context and pollutes other sessions. Write stored information as prose with enough context to be useful without reading additional files — another agent with no context should understand what you found. Store findings immediately after discovering them rather than batching at the end. Query Qdrant with natural language — describe what you are looking for semantically, not with keywords. When retrieval returns results, read them carefully before proceeding — you may not need to re-discover what is already known.

## Anti-patterns

**Anti-pattern: Not retrieving from Qdrant before starting**

What it looks like: Your dispatch prompt tells you to use Qdrant collection "project-findings", but you skip the retrieval step and begin investigation immediately without calling qdrant_qdrant-find.

Why it fails: Previous findings exist that you will re-discover, wasting effort. Qdrant retrieval is cheap and prevents duplication of already-completed work.

**Anti-pattern: Storing information without sufficient context**

What it looks like: You store: "Did database investigation, found stuff" with no detail or explanation.

Why it fails: Another agent retrieving this finding later learns nothing useful. When storing, include enough context that the information stands alone and informs future work.

**Anti-pattern: Using the wrong collection name**

What it looks like: Your dispatch prompt specifies collection "project-alpha" but you use "current-session" or create a new collection instead.

Why it fails: The collection name isolates findings to a specific session and purpose. Using the wrong collection loses context and prevents other agents from finding your findings when they need them.

**Anti-pattern: Batching findings instead of storing immediately**

What it looks like: You make multiple discoveries but only call qdrant_qdrant-store at the end, combining all findings into one large storage call.

Why it fails: If you encounter an error or context loss before the batch storage call, findings are lost. Storing immediately ensures each finding is preserved when discovered.

**Anti-pattern: Storing findings from memory instead of investigation**

What it looks like: You retrieve from Qdrant, see what is already known, then store: "Authentication also probably uses API keys" without actually investigating whether it does.

Why it fails: Speculative storage contaminates findings with guesses. Store only what you have actually verified through investigation.

## When to Use Qdrant in Dispatch Prompts

Every delegation prompt that mentions a Qdrant collection should instruct the subagent to retrieve findings before starting and store their own findings when done. This ensures knowledge accumulates across the session and prevents re-discovery of what is already known. Queries should be natural language — describe what you are looking for semantically, not with keywords. When the subagent retrieves results, it should read them carefully and continue only if additional investigation is needed. The dispatch prompt should name the collection explicitly so the subagent knows where to store and retrieve.
