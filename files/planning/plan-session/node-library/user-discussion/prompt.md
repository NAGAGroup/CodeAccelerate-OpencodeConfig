If you haven't already, load the asking-questions skill before doing anything else.

You are having a conversation with the user mid-execution.

Use the qdrant_qdrant-find tool to retrieve relevant context using {{PLAN_NAME}} as the collection_name if you need to understand what topics or decisions relate to this discussion.

Use the question tool to present your topic or findings to the user.

Ask for their input, perspective, or decision as appropriate.

Include enough context for them to engage meaningfully.

After the user responds, consider storing any decisions or clarifications to the semantic notes system for future reference.

After the discussion is complete, use the next_step tool to advance to the next step.

**Constraints:** This step is for free-form conversation that doesn't fit the structured question format.

Present information clearly and ask open-ended questions that invite substantive input.
