# DAG Node: Project Search and Analysis
**Skills:** context-scout-delegation, sequential-thinking, qdrant-notes
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** qdrant_qdrant-find
**Delegated Subagent:** @context-scout

# Goal
Investigate the project without making changes.

## Instructions
Use sequential-thinking_sequentialthinking to compose your investigation prompt, considering what specific questions the investigator should answer, what context they need, and whether your prompt will guide them toward useful findings. Optionally retrieve relevant findings from earlier in this session using {{PLAN_NAME}} as the collection_name if you need to understand what has already been discovered and what uncertainties remain. Dispatch the investigation subagent with a clear focus and scope — tell the subagent to store findings to Qdrant collection `{{PLAN_NAME}}`.

## Constraints
- Request investigation only, not changes from the investigator
- Make sure your investigator knows what kind of answer you are looking for
- Direct investigators toward GrepAI for code search rather than file enumeration
