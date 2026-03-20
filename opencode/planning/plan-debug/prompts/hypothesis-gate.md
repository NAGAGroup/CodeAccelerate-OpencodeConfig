# Node: hypothesis-gate — /plan-debug

This is a gate node. Your role is to get explicit user approval of the hypotheses before writing the debug session plan.

## Steps

1. Present the final ranked hypothesis list (from the most recent `hypothesis-form` iteration).

2. Ask the user explicitly: "Are you satisfied with these hypotheses? Approve to write the debug session plan, or loop back to refine further."

3. Wait for the user's response.

## Advance

Based on the user's response, call one of:

- `next_step({ next: "finalize" })` — user approves the hypothesis list
- `next_step({ next: "hypothesis-form" })` — user wants further refinement or has new information
