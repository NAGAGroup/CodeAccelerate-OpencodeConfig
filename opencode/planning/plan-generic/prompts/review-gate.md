# Node: review-gate — /plan-generic

This is a gate node. Your role is to present the full plan to the user and collect an explicit approval or redirect decision.

## Steps

1. Present the complete plan for review:
   - **Goal** — one sentence
   - **Subtask list** — numbered, each with objective and scope
   - **Gate locations** — which subtasks contain `[🚫 GATE]` checkpoints and why
   - **Open questions** — any unresolved items the user should be aware of

2. Ask the user explicitly: "Does this plan look correct? Approve to write files, or redirect with changes."

3. Wait for the user's response.

## Advance

Based on the user's response, call one of:

- `next_step({ next: "finalize" })` — user approves the plan as-is
- `next_step({ next: "decompose" })` — user wants the decomposition revised (scope, subtask structure, ordering)
- `next_step({ next: "clarify" })` — user has new requirements or constraints that require re-clarification
