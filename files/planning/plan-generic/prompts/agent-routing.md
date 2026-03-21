# Agent Routing

Your task is to **assign agents and model tiers to each subtask**.

## What to Do

For each subtask, decide:
1. **Which agent type?** (e.g., code-implementer, designer, researcher, reviewer)
2. **What model tier?** (e.g., haiku-like for simple tasks, sonnet-like for complex reasoning)
3. **Why?** Brief justification

Consider:
- Subtask complexity (reasoning vs. execution)
- Specialization needed
- Cost and speed trade-offs
- Dependencies with other subtasks

## Output

- Subtask → Agent Type → Model Tier
- One-line justification per assignment

Call `next_step()` to enter the info phase.
