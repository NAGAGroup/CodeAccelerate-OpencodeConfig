# DAG Node: Research
**Skills:** external-scout-delegation, asking-questions, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** Yes
**Required Tools:** sequential-thinking_sequentialthinking, question, task
**Optional Tools:** None
**Delegated Subagent:** @external-scout

# Goal
Conduct external research with user approval gate.

## Instructions
Use sequential-thinking_sequentialthinking to compose a focused research query, considering what external information is most valuable, what scope makes sense, and what boundaries protect proprietary information. Use the question tool to present the exact research query to the user for approval before the external scout is dispatched, ensuring the user reviews any information that will be shared outside the organization. If the user approves, dispatch @external-scout with the approved query — tell @external-scout to store findings to Qdrant collection `{{PLAN_NAME}}`. If the user declines, you may still dispatch @external-scout with a prompt instructing it to return immediately without research — this satisfies the enforcement sequence without requiring a branch.

## Constraints
- Collect user approval before sending external queries to ensure information security
- Be specific in your research question
- Remove or redact any proprietary, sensitive, or confidential information before submitting the query
