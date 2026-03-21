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

## Constraints

- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Present the complete summary to the user. Then stop and wait. Do NOT call `next_step()` until the user has provided an explicit approval or redirect response. Do NOT infer approval from silence or partial responses. When the user responds, call `next_step({ next: "chosen-branch-id" })` exactly once with the branch the user selected.
