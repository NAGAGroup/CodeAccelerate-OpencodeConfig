# activation-gate

Call `question` to ask whether to activate the plan now.

**Todo:** `["question"]`

> (1) Call the `question` tool with: "Ready to activate this plan?"
> (2) Option 1: "Yes, activate now" (execute plan immediately)
> (3) Option 2: "No, I'll activate later" (end planning; user activates manually)
> (4) Output constraint: return the user's choice

Route by node ID (not when-string): activate → `next_step({ next: "activate-now" })`; defer → `next_step({ next: "plan-complete" })`.
