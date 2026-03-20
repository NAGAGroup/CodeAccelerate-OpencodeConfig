# Node: decompose — /plan-generic

Your role in this node is to explore the codebase and produce a concrete, ordered subtask breakdown.

## Steps

1. **Dispatch ContextScouts in parallel** — one per major concern. Typical concerns:
   - Files and modules directly touched by this change
   - Existing patterns, conventions, and related prior work
   - Current session state (any in_progress sessions that might conflict)
   Tailor scout prompts to the specific task. Do not use a generic scout.

2. **Synthesize findings** — After all scouts return:
   - If findings are straightforward → synthesize directly
   - If complex inter-file dependencies exist → delegate to ContextInsurgent for deep synthesis

3. **Decompose into subtasks** — Break the work into numbered subtasks. Each subtask must have:
   - **Objective** — One paragraph: what will be done and why
   - **Scope** — Explicit file list (edit / write / delete / excluded)
   - **Constraints** — Specific requirements, patterns to follow, things to avoid
   - **Todolist** — 3–8 actionable items; include `[🚫 GATE]` before any risky or irreversible step

    Sizing: minimum 3 todos, maximum 8. Fold tiny tasks into adjacent subtasks. Split large tasks.
    Ordering: dependencies first; deletions before edits that reference deleted content.

4. **Identify loop-capable nodes and confirm `remaining_visits`** — For any subtask that will produce a looping node (a node whose `next` array includes itself or a prior node):
    - Note that the default `remaining_visits` is 3
    - Ask the user if a different count is wanted for that node — one question per node if there are multiple
    - Record the confirmed count for each loop-capable node

5. **Present the draft subtask list** to the user — numbered summary only (objective + scope, no full detail yet).

## Constraints

- Do not write any files yet. Finalization happens in the `finalize` node.
- Do not assign agents yet.
- Subtask count: aim for 3–9 subtasks. Fewer than 3 is a single task, not a plan. More than 9 needs splitting.

## Advance

Call `next_step()` to proceed to the `review-gate` node.
