---
name: qdrant-notes
description: Teaches how to store and retrieve session knowledge using Qdrant for cross-agent knowledge sharing.
---
<rules>
Always call qdrant_qdrant-find at the start of work to check what prior agents already discovered.
Always write notes as self-contained prose — a future agent must understand them without re-investigating.
Always store a summary of your work before responding.
Use natural language queries in qdrant_qdrant-find — describe what you are looking for, not keywords.
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
</example>
