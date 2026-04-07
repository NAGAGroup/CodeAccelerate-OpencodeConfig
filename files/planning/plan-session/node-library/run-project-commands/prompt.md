# DAG Node: Run Project Commands
**Skills:** tailwrench-delegation, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @tailwrench

# Goal
Run shell commands to build, test, or configure the project.

## Instructions
Use sequential-thinking_sequentialthinking to plan the command sequence, considering what commands need to run, in what order, what preconditions must be satisfied, and what success looks like. Dispatch @tailwrench with the specific commands or goals, including what commands to run, the order to run them in, what success looks like, and what to report back — tell @tailwrench to store results to Qdrant collection `{{PLAN_NAME}}`.

## Constraints
- Be precise about command names and order
- Specify what output or outcome indicates success
- Delegate shell operations to tailwrench
