**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Store accumulated findings and decisions to semantic notes for future agents to retrieve.
</goal>

<instructions>
1. Call qdrant_qdrant-store with collection {{PLAN_NAME}} for each significant finding, decision, or constraint — write in prose, one meaningful piece of information per call, skipping procedural details.
2. Call next_step.
</instructions>

<check>
1. Have I covered all significant findings, decisions, and constraints from this session so far?
2. Is each note self-contained prose — could a future agent understand it without re-investigating?
3. Am I storing things that shape future decisions, not just procedural steps I took?
</check>
