# DAG Node: Write Notes
**Skills:** qdrant-notes
**Thinking Required:** No
**Questions Allowed:** No
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Store accumulated findings and decisions to semantic notes.

## Instructions
Store significant findings, decisions, and constraints discovered so far in this session using {{PLAN_NAME}} as the collection_name. Each call should capture a meaningful piece of information that later agents might retrieve by meaning. Write in prose describing what was found, decided, or discovered. The information should be self-contained and discoverable by semantic search. Make one qdrant_qdrant-store call for each significant finding, skipping procedural details or trivial information and focusing on constraints, decisions, discoveries, and surprises.

## Constraints
- Store all findings to the semantic notes system, not to project files
- Each piece of information should stand alone and be discoverable by meaning
- Consider what questions a future agent might ask and write your notes accordingly
