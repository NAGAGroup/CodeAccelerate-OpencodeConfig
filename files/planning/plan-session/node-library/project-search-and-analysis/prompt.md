You are investigating the project to understand the current state without making changes.

Use the skill tool to load the context-scout-delegation skill, which teaches you how to dispatch project investigation.

Use the qdrant_qdrant-find tool to retrieve relevant findings from earlier in this session using {{PLAN_NAME}} as the collection_name. Consider what has already been discovered, what uncertainties remain, and what investigation might resolve them.

Use the sequential-thinking_sequentialthinking tool to compose your investigation prompt. Consider what specific questions the investigator should answer, what context they need, and whether your prompt will guide them toward useful findings.

Use the task tool to dispatch the investigation subagent with a clear focus and scope.

After the investigator returns, use the next_step tool to advance to the next step.

**Constraints:** Request investigation only, not changes from the investigator. Make sure your investigator knows what kind of answer you are looking for. Direct investigators toward GrepAI for code search rather than file enumeration.
