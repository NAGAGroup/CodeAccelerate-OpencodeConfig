# DAG Node: Deep Research
**Skills:** external-scout-delegation, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @external-scout

# Goal
Conduct broad external research without approval gate.

## Instructions
Use sequential-thinking_sequentialthinking to plan the scope of investigation, considering what domain or topic needs exploration, what angles or sub-questions are most valuable to cover, and what external research would best serve the plan. Dispatch @external-scout with a comprehensive research brief that covers multiple angles or perspectives — tell @external-scout to store findings to Qdrant collection `{{PLAN_NAME}}`.

## Constraints
- This component is for broad domain exploration, not single targeted queries
- Expect the scout to synthesize findings across multiple sources and perspectives
- Remove or redact any proprietary, sensitive, or confidential information before sending the research brief
