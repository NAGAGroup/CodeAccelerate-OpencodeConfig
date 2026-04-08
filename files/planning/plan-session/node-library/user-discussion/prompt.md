**Plan Name:** {{PLAN_NAME}}
**Required Skills:** asking-questions, qdrant-notes
**Required Tools:** question
**Optional Tools:** qdrant_qdrant-find
**Questions Allowed?:** Yes

# DAG Node: User Discussion

## Goal
Have a free-form conversation with the user mid-execution to gather input or present findings.

## Instructions

1. Optionally call `qdrant_qdrant-find` with collection `{{PLAN_NAME}}` if you need context about what topics or decisions relate to this discussion
2. Use the `question` tool to present your topic or findings to the user and ask for their input, perspective, or decision — include enough context for them to engage meaningfully
3. Call `next_step`

## Thinking through the instructions

<|think|>
- What do I need from the user — information, a decision, or their perspective on findings?
- Have I provided enough context for them to engage meaningfully without re-reading the whole session?
- Should I store any decisions or clarifications the user provides to Qdrant for future nodes?
