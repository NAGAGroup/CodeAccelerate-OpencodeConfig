**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** None
**Optional Tools:** question, qdrant_qdrant-store, qdrant_qdrant-find
**Questions Allowed?:** Yes

<goal>
{{DESCRIPTION}}
</goal>

<instructions>
1. Call qdrant_qdrant-find as needed to retrieve relevant information from session notes or previous discussions. This can be called multiple times.
2. Engage the user in open discussion per the goal above. Use the question tool as needed to structure the conversation.
3. Optionally store key outcomes or decisions to session notes using qdrant_qdrant-store.
4. Call next_step when the discussion is resolved and you have what you need to continue.
</instructions>
