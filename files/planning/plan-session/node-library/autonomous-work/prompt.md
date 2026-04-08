**Plan Name:** {{PLAN_NAME}}
**Required Skills:** autonomous-agent, asking-questions
**Required Tools:** question, task
**Optional Tools:** qdrant_qdrant-find
**Questions Allowed?:** Yes

# DAG Node: Autonomous Work

## Goal
Confirm user approval then dispatch a fully autonomous agent to complete a self-contained task.

## Instructions

1. Use the `question` tool to confirm the user still approves autonomous work before dispatching
2. Optionally call `qdrant_qdrant-find` with collection `{{PLAN_NAME}}` to retrieve context needed to scope the task
3. Use the `autonomous-agent` skill to compose a dispatch prompt — think through the goal, acceptance criteria, boundaries, and constraints
4. Dispatch autonomous-agent using the `task` tool with plan name `{{PLAN_NAME}}`
5. Call `next_step`

## Thinking through the instructions

<|think|>
- Has the user confirmed they still approve autonomous work at this point in execution?
- Is the goal complete and unambiguous — the agent will not ask follow-up questions?
- Have I defined acceptance criteria, boundaries, and constraints explicitly?
- Are there any irreversible actions the agent might take that I should warn about?
