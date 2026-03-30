# decision-gate

## When to use

When the user must choose a path at runtime. Use when a decision can't be made automatically — it requires human judgment, preference, or approval.

**When NOT to use:** **Do not** use when the decision is machine-readable (exit code, file presence, prior context) — use `conditional-branch` instead. `decision-gate` is only for decisions requiring explicit human judgment or approval.

## What it does

HW calls `question` once, presenting options that map directly to branch `when` conditions. The user's choice determines which branch is followed.

## What the planning agent must resolve

- **What decision the user is making** — Be specific. "Approve the plan?" vs. "Choose the migration strategy?"
- **The options** — List each branch option with a clear label and description. These become the `when` conditions in the plan.json branch array.
- **Branch paths** — For each option, what subtree follows? (These are defined in the surrounding plan.json structure, not in this node.) Branch nodes in `plan.json` must be full embedded objects (`{ "id": ..., "prompt": ..., "todo": ... }`), not string references. See dag-design-guide.md anti-patterns.

## Node ID

Default: `decision-gate`. Rename for clarity: `approve-plan`, `choose-strategy`, `retry-or-abort`.

## Notes

- One `question` call only — do not add more tool calls to this node
- The `when` strings in `plan.json` must **exactly match** the option labels the question presents. The plugin uses these strings for branch routing — a mismatch causes HW to pick the wrong path. There is no fuzzy matching.
- After the user responds, the plugin presents available branch targets. HW then calls `next_step({ next: "<node-id>" })` to follow the chosen path.
