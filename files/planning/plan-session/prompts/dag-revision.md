# DAG Node: DAG Revision
**Skills:** dag-design, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @dag-designer

# Goal
Revise the execution DAG based on the reviewer's critique.

## Instructions
Use sequential-thinking to reason through the reviewer's critique — which issues are most important, how to incorporate each into a clear revision prompt. Dispatch @dag-designer with the reviewer's critique verbatim or closely paraphrased, the plan name `{{PLAN_NAME}}`, and clear instructions that this is one revision round to address every critique point.

## Constraints
- include reviewer's critique verbatim or closely paraphrased
- this is a single revision round — not an ongoing iteration
- designer must address every critique point
- provide full context the designer needs to revise correctly
