# DAG Node: Commit
**Skills:** tailwrench-delegation, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @tailwrench

# Goal
Stage and commit changes at a meaningful save point.

## Instructions
Use sequential-thinking_sequentialthinking to compose the commit message and scope, considering what changes were made since the last commit, whether the project is in a stable committable state, and what the commit message should describe. Dispatch @tailwrench to stage and commit the changes with an appropriate message, including what to commit, what should be excluded, and what the commit message should convey — tell @tailwrench to store results to Qdrant collection `{{PLAN_NAME}}`.

## Constraints
- Only commit when the project is in a stable state
- Exclude secrets and credentials from commits
- Write a commit message that accurately reflects what changed
