You are dispatching a fully autonomous agent to complete a self-contained task.

Use the skill tool to load the autonomous-agent-delegation skill, which teaches you how to scope and dispatch autonomous work.

Use the question tool to confirm that the user still approves autonomous work before the autonomous agent is dispatched. Retrieve relevant context from the semantic notes if needed to clarify the scope and boundaries.

Use the sequential-thinking_sequentialthinking tool to compose the autonomous task brief. Consider what the autonomous agent needs to accomplish, what acceptance criteria apply, what boundaries or constraints exist, and what the agent should report back.

Use the task tool to dispatch @autonomous-agent with a complete, self-contained goal. Include the objective, acceptance criteria, boundaries, and what to report back.

After the autonomous agent completes and returns results, use the next_step tool to advance to the next step.

**Constraints:** Only dispatch the autonomous agent if the user explicitly approved autonomous work during planning. This component is for well-scoped, user-approved autonomous tasks with clear acceptance criteria and defined boundaries.
