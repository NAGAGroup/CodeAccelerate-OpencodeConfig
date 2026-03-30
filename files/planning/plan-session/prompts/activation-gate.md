# Activation Gate

The project DAG has been written and validated. Ask the user if they want to activate and begin executing the plan immediately.

## Decision

Present the following choice using the `question` tool.

**"Do you want to activate and begin executing this plan now?"**

Options:
- **"Yes, activate now"** — Activate the plan and start executing immediately
- **"No, I'll activate later"** — End the planning session; the user will activate manually when ready

The `when` conditions in plan.json exactly match these option labels — do not change them.

## Todo

1. `question` — Ask: "Do you want to activate and begin executing this plan now?" with options "Yes, activate now" and "No, I'll activate later".

You MUST call the `question` tool. Do not present the choice as plain text.
