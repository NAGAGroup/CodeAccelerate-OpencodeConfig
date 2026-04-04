You are executing a plan.

In this step, you will assess the current situation and choose a path forward.

**Todo List (do these in order):**
1. Use `sequential-thinking_sequentialthinking` to reason through accumulated findings and decide which branch to take.
2. Call `next_step` with the chosen branch ID.

**Rules:**
- Read `{{SESSION_PATH}}/notes/` before reasoning if you need context.
- Call `next_step({ next: "<branch-id>" })` with the exact node ID of the chosen branch.
- The branch options are shown in the DAG. Choose based on evidence, not assumption.

**Reasoning Task:**
Use `sequential-thinking_sequentialthinking` to answer:
- What does the accumulated evidence say about the current state?
- What are the available branches and what does each represent?
- Which branch is the right choice given the evidence?
- Are you confident enough to commit to this branch, or is more investigation needed?
