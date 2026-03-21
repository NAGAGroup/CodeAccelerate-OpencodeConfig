# Propose DAG Shape

Your task is to **propose which generic DAG shape (1A-1F) fits the task**.

## Valid Shapes

- **1A (Linear)** — Straightforward task, clear sequence, no unknowns
- **1B (Linear with Loop)** — Implementation involves iteration (build-test cycles)
- **1C (Linear with Decision Gate)** — Uncertainty about direction early on
- **1D (Branching)** — Multiple valid approaches; decision emerges during execution
- **1E (Loop with User Gate)** — Iterative work with user checkpoints
- **1F (Complex DAG)** — Multiple decisions and loops combined

## What to Do

Based on your task understanding, propose a shape and explain:
1. Which shape you're proposing
2. Why it fits this task
3. What unknowns does it handle? (gates/loops)

## Output

- Proposed shape (1A-1F)
- Justification (2-3 sentences)

Call `next_step()` to evaluate.
