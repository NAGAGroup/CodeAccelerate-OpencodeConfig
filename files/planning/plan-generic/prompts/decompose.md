# Node: decompose — /plan-generic

Your role in this node is to produce a concrete, ordered subtask breakdown from the synthesized codebase understanding.

## Steps

1. **Decompose into subtasks** — Break the work into numbered subtasks. Each subtask must have:
   - **Objective** — One paragraph: what will be done and why
   - **Scope** — Explicit file list (edit / write / delete / excluded)
   - **Constraints** — Specific requirements, patterns to follow, things to avoid
   - **Todolist** — 3–8 actionable items; include `[🚫 GATE]` before any risky or irreversible step

    Sizing: minimum 3 todos, maximum 8. Fold tiny tasks into adjacent subtasks. Split large tasks.
    Ordering: dependencies first; deletions before edits that reference deleted content.

2. **Identify loop-capable nodes and confirm `remaining_visits`** — Break this into two sub-steps:

    **2a. Recognize loop-capable steps** — A step is loop-capable when:
    - It involves a question-answer cycle (clarify → assess → clarify again or advance)
    - It involves iterative refinement (attempt → evaluate → refine or advance)
    - The same work may need repeating with different input
    - A fix-execute-verify cycle is needed

    Steps that are **NOT loop-capable:**
    - Simple sequential work with no repetition
    - Parallel independent dispatches
    - One-shot reads or writes

    **2b. Confirm `remaining_visits` for each loop-capable node:**
    - Default is `remaining_visits: 3`
    - Ask the user if they want a different count — one question per loop-capable node
    - State the default explicitly: "Default is 3. Want to change this?"
    - If multiple loop-capable nodes exist, ask one at a time in order
    - Record the confirmed count for each

    **Self-check before advancing:**
    - Every declared loop node has `remaining_visits` set
    - Every declared loop node has at least one non-looping exit branch
    - The loop's purpose and exit condition are clear from the prompt

3. **Present the draft subtask list** to the user — numbered summary only (objective + scope, no full detail yet).

## Constraints

- Do not write any files yet.
- Do not assign agents yet.
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.
- Subtask count: aim for 3–9 subtasks. Fewer than 3 is a single task, not a plan. More than 9 needs splitting.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
