**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-review-criteria
**Required Tools:** skill, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Review your drafted plan according to strict criteria.
</goal>

<rules>
Always store the complete, revised plan in a single qdrant_qdrant-store call. Do not paraphrase.
</rules>

<instructions>
1. Load the dag-review-criteria skill.
2. Think through each criterion and how it applies to your drafted plan. Be critical and honest with yourself.
3. Revise your plan as needed to meet the criteria.
4. Explain your revised plan to the user and how it meets the criteria. Be specific and detailed in your explanation.
5. Store the complete, revised plan in qdrant_qdrant-store with collection {{PLAN_NAME}}. Do not paraphrase or summarize — store the full markdown text verbatim.
6. Call next_step immediately after storing the revised plan. Do not wait for user feedback.
</instructions>

