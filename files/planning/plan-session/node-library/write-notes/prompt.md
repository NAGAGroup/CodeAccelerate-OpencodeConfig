If you haven't already, load the qdrant-notes skill before doing anything else.

You are storing accumulated findings and decisions to the semantic notes system.

Use the qdrant_qdrant-store tool to store significant findings, decisions, and constraints discovered so far in this session using {{PLAN_NAME}} as the collection_name.

Each call should capture a meaningful piece of information that later agents might retrieve by meaning.

Write in prose describing what was found, decided, or discovered.

The information should be self-contained and discoverable by semantic search.

Make one qdrant_qdrant-store call for each significant finding.

Skip procedural details or trivial information.

Focus on constraints, decisions, discoveries, and surprises.

After storing all significant findings, use the next_step tool to advance to the next step.

**Constraints:** Store all findings to the semantic notes system, not to project files.

Each piece of information should stand alone and be discoverable by meaning.

Consider what questions a future agent might ask and write your notes accordingly.
