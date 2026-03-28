# Propose DAG Structure

Based on the task understanding and codebase exploration, compose a DAG structure from these primitives:

## Sequence
One node after another. Use when steps have a clear order.

## Branch
A choice point with multiple paths. Each branch carries its own complete subtree. Use when:
- A decision can't be made until execution time
- The user needs to approve a direction
- Test results determine the next step

## Iteration (Unrolled)
A pattern repeated N times with an exit branch after each repetition. Use when:
- Build-test-fix cycles are expected
- Refinement loops are needed
- Quality gates must be passed

## What to propose

Use the **`question`** tool to present your proposed structure and get feedback. Include:

- An ASCII diagram of the structure
- Which primitives you're composing and why
- Where branches appear and what decisions they represent
- Where iterations appear and how deep they go (ask the user about iteration depth if uncertain)
- How many total nodes the DAG will have

Offer options like "Structure looks good — proceed to decomposition" and "Need changes".

Remember: you are structuring how the problem gets solved, not solving it. Every node will be executed by a dispatched agent.

## Todo

1. Write your proposed DAG structure as prose in your response text — include the ASCII diagram, primitives used, branch/iteration rationale, and total node count. Do NOT embed any of this inside the `question` call.
2. `question` — Call the `question` tool with a single-sentence question: "Does this structure look right?" Use option label `"Approve"` (description: "Proceed to task decomposition") and `"Rethink"` (description: "Adjust scope or structure before continuing").
