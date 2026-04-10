---
name: qdrant-notes
description: Teaches how to store and retrieve session knowledge using Qdrant for cross-agent knowledge sharing.
---
<rules>
Write every note as self-contained prose — a future agent must understand it without re-investigating. A note that says "uses auth.ts" is useless. A note describing what the module does, how it is structured, and what depends on it is valuable.
Use natural language queries in qdrant_qdrant-find — describe what you are looking for, not keywords.
Store findings as they are completed, not all at the end.
Before responding, store a summary of your work so the next agent can orient quickly.
</rules>

<example>
Two tools available:

qdrant_qdrant-store — stores a note to a named collection.
  collection_name: the plan name
  information: self-contained prose finding
  metadata: optional JSON

qdrant_qdrant-find — searches a named collection.
  collection_name: the plan name
  query: natural language description of what you are looking for

At the start of work: call qdrant_qdrant-find to check what prior agents already discovered. Avoid re-investigating what is already known.

Before responding: call qdrant_qdrant-store with a summary of your findings.

If no collection name was provided, use a reasonable default based on the task.
</example>
