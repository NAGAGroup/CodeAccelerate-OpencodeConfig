---
name: qdrant-notes
description: Teaches how to store and retrieve session knowledge using Qdrant for cross-agent knowledge sharing.
---
<tools>
qdrant_qdrant-store — stores a note to a named collection. Parameters: collection_name (the plan name), information (self-contained prose finding), metadata (optional JSON).

qdrant_qdrant-find — searches a named collection. Parameters: collection_name (the plan name), query (natural language description of what you are looking for).
</tools>

<procedure>
At the start of work: call qdrant_qdrant-find to check what prior agents discovered. Avoid re-investigating what is already known.

During work: store each major finding as it is completed. Do not batch everything to the end.

Before responding: call qdrant_qdrant-store with a summary of your work so the next agent can orient quickly.
</procedure>

<rules>
Write notes as self-contained prose. A note that says "auth is in auth.ts" is useless. A note that explains what the auth module does, how it is structured, and what depends on it is valuable.
Use natural language queries in qdrant_qdrant-find — describe what you are looking for, not keywords.
If no collection name was provided, use a reasonable default based on the task.
</rules>
