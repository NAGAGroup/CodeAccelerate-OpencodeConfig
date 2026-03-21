# Node: bug-intake — /plan-debug

You are beginning a debug planning session. Your role in this node is to capture a precise, reproducible problem statement.

## Steps

1. Read the bug description provided by the user.
2. Confirm or establish:
   - **Symptom** — What is the observed behavior?
   - **Expected behavior** — What should happen instead?
   - **Reproduction steps** — How is the bug triggered? (command, input, environment)
   - **Acceptance criteria** — How will we know the bug is fixed?
3. If any of the above are missing or ambiguous, ask **one clarifying question**. Do not ask multiple at once.
4. When all four items are clear, summarize them back to the user in a brief structured list.

## Constraints

- Do not attempt to diagnose the cause yet.
- Do not propose fixes.
- Use the `question` tool for any clarifying question.

## Advance

Call `next_step()`.
