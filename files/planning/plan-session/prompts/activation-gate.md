# Activation Gate

The project DAG has been written and validated. Ask the user if they want to activate and begin executing the plan immediately.

## Decision

Present the following choice using the `question` tool.

**"Do you want to activate and begin executing this plan now?"**

Options:
- **"Yes, activate now"** — Activate the plan and start executing immediately
- **"No, I'll activate later"** — End the planning session; the user will activate manually when ready

Use these option labels exactly in your `question` call so the user sees consistent options. After the user answers, route by calling next_step with the correct node ID (see routing below). The `when` field in plan.json is human-readable only — routing is controlled by your explicit next_step call.

## Todo

1. `question` — Ask: "Do you want to activate and begin executing this plan now?" with options "Yes, activate now" and "No, I'll activate later".

You MUST call the `question` tool. Do not present the choice as plain text.

**Before advancing:** Confirm you know the plan name (the directory name under `.opencode/session-plans/`) — the next node needs it immediately.

**After the user answers:**
- "Yes, activate now" → call `next_step({ next: "activate-now" })`
- "No, I'll activate later" → call `next_step({ next: "plan-complete" })`
