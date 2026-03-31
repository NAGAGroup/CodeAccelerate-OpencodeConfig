# Decision Gate

**Zone 1 — Framing (Primacy):**

You will call the `question` tool once, presenting the decision and options below. The user's choice maps to a branch in the plan. Your job: ask the question, wait for the response, then call `next_step()` with the branch's node ID.

---

**Zone 2 — Content to Present (Middle — Placeholders with Authoring Guidance):**

## The Decision

{{DECISION_DESCRIPTION}}

*What specific choice is the user making? One sentence, framed as a question or decision point. Example: "Should we optimize the database before adding the feature, or add the feature first?" Bad: "What should we do next?" (too vague for the user to decide)*

## The Options

You will present these two options to the user in the `question` tool. **The option labels below must exactly match the `when` strings in this node's branch array in the DAG — character-for-character, including capitalization and punctuation.**

- **Option A:** {{OPTION_A_LABEL}} — {{OPTION_A_DESCRIPTION}}
- **Option B:** {{OPTION_B_LABEL}} — {{OPTION_B_DESCRIPTION}}

*Option labels must be short and unambiguous. Example: "Optimize database first" (good) vs. "Option A: Optimize the database before any new features are added (recommended)" (bad — too long, uses "Option A" instead of clear action). These labels are what the user will see and select; they must match the DAG branch `when` strings exactly.*

**For more than two options:** Add additional `{{OPTION_C_LABEL}}`, `{{OPTION_D_LABEL}}` etc. — each must have a matching `when` entry in the DAG branch array.

## Todo

1. `question` — Present {{DECISION_DESCRIPTION}} with options: {{OPTION_A_LABEL}}, {{OPTION_B_LABEL}}.

---

**Zone 3 — Execution Spec & Routing (Recency):**

## Routing requirement

**After the user responds, call `next_step({ next: '<node-id>' })` where `<node-id>` exactly matches the `id` field of the branch node in the DAG — NOT the `when` string.**

The `when` field is human-readable display text. The routing key is the node's `id`.

Example:
- User selects "Optimize database first"
- The DAG branch has: `{ "when": "Optimize database first", "node": { "id": "optimize-db", ... } }`
- You call: `next_step({ next: 'optimize-db' })` — NOT `next_step({ next: 'Optimize database first' })`

## Question tool constraint

- Call `question` exactly once
- Do not emit additional tool calls to this node
- Do not present the choice as plain text — you must use the `question` tool
- The `question` tool will return the user's selection; use that selection to call `next_step()`

---

**Final Reminder:** Ensure the option labels you present in the `question` call exactly match the `when` strings in the DAG branch array. A mismatch prevents proper routing.
