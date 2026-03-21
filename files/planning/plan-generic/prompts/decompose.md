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
    **Parallel work grouping** — When multiple independent tasks will be delegated to the same agent type simultaneously (e.g., three @JuniorDev edits to three different files), group them into a **single subtask node**. The prompt for that node instructs the executing agent to dispatch all subagents in one response and wait for all to return. Do NOT create one subtask node per parallel agent — the DAG is sequential; "parallel subtask nodes" is not a valid concept.

    Self-check before finalizing the subtask list:
    - Does any set of subtasks represent work that should run simultaneously? → Collapse them into one node.
    - Does any subtask say "dispatch @JuniorDev for X" and the next subtask say "dispatch @JuniorDev for Y" where X and Y are independent? → These belong in one node.

2. **Identify loop-capable nodes and confirm `remaining_visits`** — Break this into two sub-steps:

    **2a. Recognize loop-capable steps** — A step is loop-capable when the same work may need to repeat until a condition is met. Common signals:
    - A question-answer cycle (e.g., ask → assess → ask again or advance)
    - An iterative refinement cycle (e.g., attempt → evaluate → refine or advance)
    - A fix-build-verify cycle (e.g., fix → build → verify → fix or close)
    - A research-synthesize cycle (e.g., dispatch → accumulate → assess → dispatch or advance)

    **Every loop must span at least two nodes.** No self-referencing nodes. Each node in the cycle has one job; the transition between nodes IS the loop mechanism. The **decision node** (the one that chooses to loop or advance) gets `remaining_visits`.

    Example — a fix/verify loop:
    - `fix`: applies the fix, calls `next_step()` unconditionally → goes to `build`
    - `build`: runs the build, calls `next_step()` unconditionally → goes to `verify`
    - `verify`: checks results, calls `next_step({ next: "fix" })` if failing or `next_step({ next: "close" })` if passing — this is the decision node with `remaining_visits`
    - `close`: terminal node, no `next`

    Steps that are **NOT loop-capable:**
    - Simple sequential work with no repetition
    - Parallel independent dispatches
    - One-shot reads or writes

    **2b. Confirm `remaining_visits` for each loop's decision node:**
    - Default is `remaining_visits: 3`
    - Ask the user if they want a different count — one question per loop
    - State the default explicitly: "Default is 3. Want to change this?"
    - If multiple loops exist, ask one at a time in order
    - Record the confirmed count for each

    **Self-check before advancing:**
    - Every loop spans at least 2 nodes (no self-references)
    - The decision node has `remaining_visits` set
    - The decision node has exactly one looping exit and one non-looping exit
    - There is a separate terminal node the loop exits to

3. **Present the draft subtask list** to the user — numbered summary only (objective + scope, no full detail yet).

## Constraints

- Do not write any files yet.
- Do not assign agents yet.
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.
- Subtask count: aim for 3–9 subtasks. Fewer than 3 is a single task, not a plan. More than 9 needs splitting.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
