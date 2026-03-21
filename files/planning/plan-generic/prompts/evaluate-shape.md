# Evaluate Shape

Your task is to **validate the proposed shape**.

## Evaluation Questions

1. Does this shape match the task's complexity?
2. Will gates/loops catch decisions that need user input?
3. Is it too simple or too complex?
4. Can an agent navigate it?
5. Does it match the task's natural structure?

## Decision

**If shape is good:** Call `next_step()` to decompose.

**If shape needs adjustment:** Call `next_step({ next: "propose-shape" })` to reconsider.
