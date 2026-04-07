# DAG Node: Autonomous Work
**Skills:** autonomous-agent-delegation, asking-questions, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** Yes
**Required Tools:** question, task
**Optional Tools:** qdrant_qdrant-find
**Delegated Subagent:** @autonomous-agent

# Goal
Dispatch a fully autonomous agent to complete a self-contained task.

## Instructions
Use the question tool to confirm that the user still approves autonomous work before the autonomous agent is dispatched. Optionally retrieve relevant context from the semantic notes if needed to clarify the scope and boundaries. Use sequential-thinking_sequentialthinking to compose the autonomous task brief, considering what the autonomous agent needs to accomplish, what acceptance criteria apply, what boundaries or constraints exist, and what the agent should report back. Dispatch @autonomous-agent with a complete, self-contained goal, including the objective, acceptance criteria, boundaries, and what to report back — tell @autonomous-agent to store findings to Qdrant collection `{{PLAN_NAME}}`.

## Constraints
- Only dispatch the autonomous agent if the user explicitly approved autonomous work during planning
- This component is for well-scoped, user-approved autonomous tasks with clear acceptance criteria and defined boundaries
