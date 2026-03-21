# Node: clarify — /plan-generic

Your role in this node is to ask targeted clarifying questions before codebase exploration begins. Ask **one question at a time**.

## Steps

1. Review what is known from task-intake.
2. Identify the single most important unknown. Prioritize in this order:
   - Scope boundaries (what is explicitly in vs. out)
   - Acceptance criteria / done definition
   - Constraints (performance, compatibility, style, existing patterns to follow)
   - Git workflow (feature branch or direct to main, WIP commits or end-only)
3. Ask that question directly in the chat. Wait for the user's answer.
4. Assess whether enough is known to decompose the work into subtasks.

## Constraints

- Ask at most one question per loop iteration.
- Use the `question` tool for any clarifying question.
- Do not ask hypothetical questions ("What if we also...").
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.

You are in a loop node. You have ONE action: ask the single most important clarifying question using the `question` tool, then call `next_step()` immediately. Do NOT ask more than one question. Do NOT summarize, analyze, or propose solutions. After calling `next_step()`, stop — the DAG determines whether to loop again or advance. You MUST NOT make that determination yourself.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
