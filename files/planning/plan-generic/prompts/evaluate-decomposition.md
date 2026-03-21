# Evaluate Decomposition

Your task is to **validate the decomposition**.

## Evaluation Questions

1. Are subtasks well-scoped? (Not too broad, not too fine)
2. Are boundaries clear? (No overlap, clear handoffs)
3. Are dependencies explicit?
4. Can each subtask be assigned to one agent?
5. Is the granularity right for the project DAG?

## Decision

**If decomposition is solid:** Call `next_step()` to route agents.

**If decomposition needs refinement:** Call `next_step({ next: "refine-decomposition" })`.
