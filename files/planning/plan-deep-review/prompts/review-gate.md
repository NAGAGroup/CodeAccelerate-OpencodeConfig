# Node: review-gate — /plan-deep-review

> **Role statement:** You are presenting a proposed fix plan to the user for approval. This is a structural decision — not the actual fix work. You are not writing code or generating artifacts yet.

This is a gate node. Your role is to present a complete **fix session design** and get explicit user approval before file generation begins. Do not perform any fix work on the issues themselves. The content you produce here is purely structural review.

---

## Steps

1. **State the fix goal** — one sentence describing what the session will *produce* (e.g., a structured fix plan addressing X issues across Y components), not what the fixes will be.

2. **Present the complete fix session structure:**
   - **Finding groups** — grouped by severity or component, with count of issues in each group
   - **Proposed fix subtask breakdown** — numbered list of proposed fix subtasks, each with objective and scope
   - **Agent routing assignments** — the routing table from agent-routing: subtask, assigned agent, model tier, rationale
   - **Gate checkpoints** — which subtasks contain `[🚫 GATE]` markers and why they require approval before proceeding

3. **List any open questions or decisions the user should review** — unresolved items that may affect the fix approach.

4. **State the proposed session flow** — the overall shape (e.g., fix-execute loop, validation, synthesis, finalization).

5. **State the proposed `remaining_visits` if applicable** — iterations or steps the session will perform.

6. Present the complete fix plan to the user.

7. Ask: **"Does this fix plan look correct? Approve to generate the fix session plan, or loop back with changes."** — collect explicit approval or redirect.

8. Wait for the user's response.

---

## Constraints

- No actual fix code or changes should be generated in this node.
- Do not write files or perform fix work — only present the proposed structure.
- Do not make implementation decisions on behalf of the user — only present options.
- This is a GATE node — always wait for explicit user approval before advancing.

---

## Advance

Present the complete fix plan to the user. Then stop and wait. Do NOT call `next_step()` until the user has provided an explicit approval or redirect response. Do NOT infer approval from silence or partial responses. When the user responds, call `next_step({ next: "chosen-branch-id" })` exactly once with the branch the user selected.
