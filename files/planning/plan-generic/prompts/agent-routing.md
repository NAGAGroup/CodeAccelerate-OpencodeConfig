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

## Advanced Routing: @ContextInsurgent

For subtasks requiring deep understanding across multiple files or significant architecture changes, route to **@ContextInsurgent**. This agent excels at:
- Multi-file codebase reasoning and refactoring
- Architecture decisions affecting multiple modules
- Complex decomposition of interconnected concerns
- Cross-cutting design decisions

Example: "Refactor authentication across 5 modules" → @ContextInsurgent (multi-file architecture reasoning)

## Sequential Thinking for Complex Routing

For complex routing decisions with many interdependencies, you may use the `sequential-thinking` tool to reason through agent specializations and routing trade-offs.

**Note:** Generated DAG prompts should mention `sequential-thinking` as an available tool for complex steps (decomposition, architecture reasoning, trade-off analysis).

## Output

- Subtask → Agent Type → Model Tier
- One-line justification per assignment
- (If applicable) @ContextInsurgent routing rationale

Call `next_step()` to enter the info phase.
