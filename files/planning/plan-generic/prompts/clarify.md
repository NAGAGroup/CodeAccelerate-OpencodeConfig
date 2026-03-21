# Node: clarify — /plan-generic

Your role in this node is to ask ONE targeted clarifying question before codebase exploration begins.

## Steps

1. Review what is known from task-intake and any prior clarify/assess visits.
2. Identify the single most important unknown. Prioritize in this order:
   - Scope boundaries (what is explicitly in vs. out)
   - Acceptance criteria / done definition
   - Constraints (performance, compatibility, style, existing patterns to follow)
   - Git workflow (feature branch or direct to main, WIP commits or end-only)
3. Ask that question using the `question` tool. Wait for the user's answer.

## Constraints

- You MUST ask exactly ONE question. Do not batch multiple questions.
- You MUST NOT assess whether enough context has been gathered — that is the `assess` node's job.
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
