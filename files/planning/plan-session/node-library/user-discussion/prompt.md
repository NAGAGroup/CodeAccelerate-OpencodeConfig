# DAG Node: User Discussion
**Skills:** asking-questions, qdrant-notes
**Thinking Required:** No
**Questions Allowed:** Yes
**Required Tools:** question
**Optional Tools:** qdrant_qdrant-find
**Delegated Subagent:** None

# Goal
Have a free-form conversation with the user mid-execution.

## Instructions
Optionally retrieve relevant context using {{PLAN_NAME}} as the collection_name if you need to understand what topics or decisions relate to this discussion. Use the question tool to present your topic or findings to the user, asking for their input, perspective, or decision as appropriate and including enough context for them to engage meaningfully. After the user responds, consider storing any decisions or clarifications to the semantic notes system for future reference.

## Constraints
- This step is for free-form conversation that doesn't fit the structured question format
- Present information clearly and ask open-ended questions that invite substantive input
