# Node: hypothesis-form — /plan-debug

Your role in this node is to produce one best-guess hypothesis about the root cause of the bug.

## Steps

1. Using the context gathered so far, identify the single most likely root cause. Format it as:
   - **Statement** — One sentence: what is the suspected root cause?
   - **Evidence** — What in the codebase or context supports this hypothesis?
   - **Proposed test/fix approach** — What targeted check or change would confirm or resolve it?
   - **Confidence** — High / Medium / Low

2. Present the hypothesis to the user.

## Constraints

- You MUST produce exactly one hypothesis — the single best-guess based on current evidence.
- Hypotheses must be grounded in evidence from the codebase — no speculation without backing.
- You MUST NOT propose fixes. Diagnose only — fixes belong in the fix node.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
