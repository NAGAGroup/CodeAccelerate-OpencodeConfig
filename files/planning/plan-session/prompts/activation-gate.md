# activation-gate

## STOP — Do not work ahead

Your only jobs in this node are: call the `question` tool to ask the user about activation, then call `next_step()` with the correct node ID. Do NOT present the DAG content, add commentary, or perform any other work.

## Todo

1. `question` — Ask the user for their activation preference

---

Ask the user whether to activate and execute the plan immediately or defer activation. Route based on their response.

## Decision Flow

The project DAG has been written and validated. Present the user with an activation choice using the `question` tool.

Call the `question` tool with these exact options:
- **"Yes, activate now"** — Activate the plan and begin executing immediately
- **"No, I'll activate later"** — End the planning session; user will manually activate when ready

Do not present this choice as plain text — use the `question` tool.

**Before calling `question`:** Confirm you know the plan name (the directory name under `.opencode/session-plans/`). The next node needs it immediately. If uncertain, look back at the write-dag completion summary. If still unclear, ask the user: "What name did we use for this plan?" before proceeding.

**After the user answers, route by node ID (not by label):**
- User chose "Yes, activate now" → call `next_step({ next: "activate-now" })`
- User chose "No, I'll activate later" → call `next_step({ next: "plan-complete" })`

**Important:** Branch routing uses node IDs (the `id` field in plan.json), not the `when` labels. The `when` field is human-readable for display only.
