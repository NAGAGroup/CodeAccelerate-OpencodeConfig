# INFO: Generic-Specific Principles

These principles apply specifically to **generic project DAGs**:

## 1. Shape Reflects Task Structure

The DAG shape should match the task's natural structure, not force-fit a template. Your task understanding should support your shape choice.

## 2. Gates Validate Executing Agent Decisions

If your DAG has gates (shapes 1C, 1D, 1E, 1F):
- The **executing agent researches and proposes** a direction
- The **user validates or redirects** during execution
- Gates are not "approving a plan"; they're validating decisions *in context*

## 3. Loops Handle Unknowns

If your DAG has loops (shapes 1B, 1E, 1F):
- Loops are not failures of planning; they're mechanisms for handling unknowns
- Build-test cycles, refinement iterations, quality checks — these are expected
- The `remaining_visits` counter prevents infinite loops without blocking real work

## 4. Subtasks Should Be Routeable

Each subtask must be:
- Assignable to a specific agent
- Have clear success criteria
- Have defined inputs and outputs
- Be completable within the subtask's scope

If a subtask is vague ("do stuff"), decomposition isn't ready.

## 5. Not All Tasks Are Linear

Generic DAGs handle diverse work: features, refactors, migrations, investigations. Your shape should acknowledge this diversity.

Call `next_step()` to summarize your decisions.
