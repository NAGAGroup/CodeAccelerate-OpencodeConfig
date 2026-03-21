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

- You MUST NOT attempt to diagnose the cause. Stop immediately if you find yourself doing so.
- You MUST NOT propose fixes or implementation approaches of any kind.
- You MUST NOT form hypotheses or guess at root causes.
- Violating these constraints means this node has failed. Stop and re-read the objective.
- Use the `question` tool for any clarifying question. Ask one question at a time.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
