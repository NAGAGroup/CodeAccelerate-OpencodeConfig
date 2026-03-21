# Propose Diagnosis Decomposition

Your task is to **break the investigation into 3-7 diagnosis steps**.

## What to Do

Decompose the investigation:
1. List 3-7 diagnosis steps with clear names (e.g., "reproduce-locally", "trace-execution", "check-logs")
2. For each step, explain: what will be tested and why
3. Identify branching: at which steps do we decide between hypotheses?
4. Identify loops: do any diagnosis steps need iteration (test-refine)?
5. Define success criteria: when does a step confirm or falsify a hypothesis?

Each step should be assignable to one investigator and produce testable evidence.

## Output

- Numbered list of diagnosis steps
- Brief description of each
- Hypothesis each step tests
- Branching points (where decisions are made)
- Success criteria (what evidence confirms/falsifies)

Call `next_step()` to evaluate.
