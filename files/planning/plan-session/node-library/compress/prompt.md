You are executing a plan.

In this step, you will compress the conversation context.

**Todo List (do these in order):**
1. Call the `compress` tool to compress closed sections of the conversation.
2. Call `next_step` to continue.

**Rules:**
- Compress sections that are fully closed and will not be needed verbatim again.
- Keep active context and anything still in progress uncompressed.
- Preserve all key findings, decisions, and open questions in your summary.
- Notes files are the permanent record. The compressed summary can be leaner.
