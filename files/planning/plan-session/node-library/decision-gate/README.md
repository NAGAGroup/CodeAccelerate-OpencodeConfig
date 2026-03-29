# decision-gate

## When to use

When the user must choose a path at runtime. Use when a decision can't be made automatically — it requires human judgment, preference, or approval.

## What it does

HW calls `question` once, presenting options that map directly to branch `when` conditions. The user's choice determines which branch is followed.

## What the planning agent must resolve

- **What decision the user is making** — Be specific. "Approve the plan?" vs. "Choose the migration strategy?"
- **The options** — List each branch option with a clear label and description. These become the `when` conditions in the plan.json branch array.
- **Branch paths** — For each option, what subtree follows? (These are defined in the surrounding plan.json structure, not in this node.)

## Node ID

Default: `decision-gate`. Rename for clarity: `approve-plan`, `choose-strategy`, `retry-or-abort`.

## Notes

- One `question` call only — do not add more tool calls to this node
- The `when` conditions in plan.json must exactly match (or clearly map to) the options presented in the question
- This is a branch point — after the user responds, branching instructions will follow automatically
- If the decision can be made by a machine (exit code, file existence), use `conditional-branch` instead
