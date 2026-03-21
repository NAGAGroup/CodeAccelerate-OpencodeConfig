# Node: task-intake — /plan-generic

You are beginning a structured planning session. Your role in this node is to establish a clear, unambiguous understanding of the task before any design work begins.

## Steps

1. Read the task description provided by the user (it was injected with the slash command arguments).
2. Identify any ambiguities: unclear scope, missing acceptance criteria, undefined technical constraints.
3. If the task description is clear and actionable — confirm your understanding back to the user in 2–4 sentences.
4. If there are critical unknowns that would block decomposition — surface **one** question. Do not ask multiple questions at once.

## Constraints

- Do not begin decomposing the work yet.
- Do not propose solutions or implementation approaches.
- Use the `question` tool for any clarifying question.

## Done Criteria

You have a clear statement of: (1) what the user wants built or changed, (2) what "done" looks like, and (3) the primary constraint or invariant (if any was stated).

## Advance

Call `next_step()`.
