# decision-gate

## When to use

When the user must choose a path at runtime. Use when a decision can't be made automatically — it requires human judgment, preference, or approval.

**When NOT to use:** **Do not** use when the decision is machine-readable (exit code, file presence, prior context) — use `conditional-branch` instead. `decision-gate` is only for decisions requiring explicit human judgment or approval.

## What it does

HW calls `question` once, presenting options that map directly to branch `when` conditions. The user's choice determines which branch is followed.

## What the planning agent must resolve

- **What decision the user is making** — Be specific. "Approve the plan?" vs. "Choose the migration strategy?"
- **The options** — List each branch option with a clear label and description. These become the `when` conditions in the plan.json branch array.
- **Branch paths** — For each option, what subtree follows? The `when` string for each branch in plan.json must **exactly** match the option label (including capitalization and punctuation). Good: question asks "Refactor first" → when condition is "Refactor first". Bad: question asks "Option A: Refactor" → when condition is "Refactor" (partial match silently misroutes). Branch nodes in `plan.json` must be full embedded objects (`{ "id": ..., "prompt": ..., "todo": ... }`), not string references. See dag-design-guide.md anti-patterns.
- **Routing constraint** — The filled prompt must state: "After the user responds, call `next_step({ next: '<node-id>' })` where `<node-id>` exactly matches the branch node's id in plan.json — NOT the `when` string."

## Node ID

Default: `decision-gate`. Rename for clarity: `approve-plan`, `choose-strategy`, `retry-or-abort`.

## Notes

- One `question` call only — do not add more tool calls to this node
- The `when` strings in `plan.json` must **exactly match** the option labels the question presents. The plugin uses these strings for branch routing — a mismatch causes HW to pick the wrong path. There is no fuzzy matching.
- After the user responds, the plugin presents available branch targets. HW then calls `next_step({ next: "<node-id>" })` to follow the chosen path.
- **Failure mode:** If the planning agent writes question option labels that don't exactly match the `when` strings in plan.json, HW will stall or silently pick the wrong branch. Verify exact string match between question options and `when` conditions at DAG-authoring time.
- **Failure mode:** Using decision-gate when the decision is machine-readable (e.g., checking an exit code). This adds unnecessary user friction. Use conditional-branch when no human judgment is required.
