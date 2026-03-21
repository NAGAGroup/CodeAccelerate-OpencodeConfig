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
- Do not propose implementation approaches — only gather requirements.

## Advance

**Call `next_step()`** to advance.
