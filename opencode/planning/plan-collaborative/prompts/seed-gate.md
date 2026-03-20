# Node: seed-gate — /plan-collaborative

This is a gate node. Your role is to present a proposed seed plan structure and get user approval before writing files.

## Steps

1. Based on the rough idea and clarification so far, propose:
   - **Rough goal** — one sentence
   - **Open questions** — the 3–5 most important things to explore during the session
   - **Proposed first exploration area** — what the first `explore` node will work through
   - **Proposed output format** — what the session should produce (e.g., design spec, multi-doc, feed into /plan-generic). Note: this can remain "TBD — determined collaboratively" if not yet known.

2. Present the proposal to the user.

3. Ask: "Does this seed plan look like the right starting point? Approve to write it, or loop back to clarify further."

4. Wait for the user's response.

## Advance

- `next_step({ next: "finalize" })` — user approves the seed plan
- `next_step({ next: "clarify" })` — user wants further clarification before starting
