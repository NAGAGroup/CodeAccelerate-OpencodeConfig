<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02: Strengthen Loop Guidance in plan-generic decompose.md

## Objective

Expand step 2 of `files/planning/plan-generic/prompts/decompose.md` — "Identify loop-capable nodes and confirm `remaining_visits`" — with explicit recognition heuristics and a required self-check. Currently the step names the task but gives the agent no criteria for deciding whether a subtask warrants a loop node. After this edit, the agent will have a clear checklist: what signals make a step loop-worthy, how to structure the question to the user about `remaining_visits`, and a mandatory self-check before advancing.

## Scope

- **Edit:** `files/planning/plan-generic/prompts/decompose.md`
- **No other files**

## Constraints

- Do not restructure the existing step numbering or remove existing content — only expand step 2
- The existing step 2 mentions `remaining_visits` and the one-question-per-node rule; keep those, expand around them
- Match the existing prompt style: numbered steps, inline code, bullet lists
- The expanded step must be concise enough that a planning agent reads it in one pass — not a wall of text

## Todolist

- [ ] Read `files/planning/plan-generic/prompts/decompose.md` fully
- [ ] Expand step 2 to include:
  - **Loop recognition criteria** — a step is loop-worthy if it: (a) may need to repeat based on outcome, (b) has a clear exit condition (success or "enough"), (c) is safety-bounded (should not run infinitely). Common examples: build→diagnose→fix→verify cycles, iterative clarify loops, research-execute iterations
  - **Steps that are NOT loops** — linear steps with fixed scope, one-time reads, terminal steps — these should NOT be loop nodes even if they might fail
  - **Required question protocol** — for each identified loop node: (1) state the proposed `remaining_visits` (default: 3), (2) explain what exhausting the counter means, (3) ask the user if they want a different count — one question per loop node
  - **Self-check before advancing** — after drafting, verify: every loop node has `remaining_visits` set, every loop node has exactly one exit branch in `next`, no linear step was accidentally turned into a loop
- [ ] Edit the file at the step 2 location
- [ ] Verify no other content was changed

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `files/planning/plan-generic/prompts/decompose.md`
- Goal: Expand step 2 ("Identify loop-capable nodes and confirm `remaining_visits`") with loop recognition criteria, non-loop signals, the `remaining_visits` question protocol, and a pre-advance self-check
- Constraints: Keep existing content; only expand step 2; match existing prompt style; keep it scannable
- Verify: Step 2 now contains recognition criteria, non-loop signals, question protocol, and self-check; all other content unchanged

## Advance

Call `next_step()` when this subtask is complete.
