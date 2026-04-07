# DAG Node: DAG Review
**Skills:** dag-review, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @dag-reviewer

# Goal
Evaluate the completed execution DAG against design criteria through independent review.

## Instructions
Use sequential-thinking to reason through what context the reviewer needs and what dimensions to evaluate. Dispatch @dag-reviewer with the plan name `{{PLAN_NAME}}`, the user's goal, and the review scope. The reviewer evaluates: completeness, dependency ordering, component fit, verification coverage, scope adherence, failure handling, efficiency.

## Constraints
- provide sufficient context for independent assessment
- reviewer never saw the designer's reasoning
- specify all review dimensions explicitly in the dispatch prompt
