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

- One hypothesis only — the best-guess based on current evidence.
- Hypotheses must be grounded in evidence from the codebase — no speculation without backing.
- Do not propose fixes yet — only diagnoses.

## Advance

Call `next_step()`.
