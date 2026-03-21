# Node: review-gate — /plan-generic

This is a gate node. Your role is to present the complete plan to the user and collect an explicit approval or redirect decision.

## Steps

1. Present the complete plan for review:
   - **Goal** — one sentence
   - **Subtask list** — numbered, each with objective and scope
   - **Agent routing** — the routing table from agent-routing: subtask, assigned agent, model tier, rationale
   - **Gate locations** — which subtasks contain `[🚫 GATE]` checkpoints and why
   - **Open questions** — any unresolved items the user should be aware of

2. Ask the user explicitly: "Does this plan look correct? Approve to write files, or redirect with changes."

3. Wait for the user's response.

## Advance

Based on the user's response, call `next_step()` and select the appropriate branch:

- Approve → advance to finalize
- Revise decomposition → go back to decompose
- Revise requirements → go back to clarify
