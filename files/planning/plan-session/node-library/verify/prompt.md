# DAG Node: Verify
**Skills:** tailwrench-delegation, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @tailwrench

# Goal
Verify the most recent change meets acceptance criteria.

## Instructions
Use sequential-thinking_sequentialthinking to reason through what verification means for the change that was just made, considering what the acceptance criteria are, what verification approach is appropriate, and what success looks like. Dispatch @tailwrench to verify the implementation against the acceptance criteria, including the specific criteria and what counts as a passing verification — tell @tailwrench to store results to Qdrant collection `{{PLAN_NAME}}`.

## Constraints
- Base verification criteria on what was actually implemented in the prior step
- Use tailwrench to execute verification commands or checks
- Focus on objective pass/fail criteria
