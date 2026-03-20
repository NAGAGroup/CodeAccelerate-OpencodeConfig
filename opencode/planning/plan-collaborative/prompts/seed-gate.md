# Node: seed-gate — /plan-collaborative

> **Role statement:** You are presenting a session design for approval. This is a structural decision — not a topic analysis. You are not proposing answers, designs, or trade-offs.

This is a gate node. Your role is to present a proposed **session structure** and get user approval before writing files. Do not perform any design work on the topic itself. The content you produce here is purely structural.

---

## Steps

1. **State the session goal** — one sentence describing what the session will *produce* (an artifact, a decision, a spec), not what the answer or design will be.

2. **Propose the session structure:**
   - How many `explore` nodes are planned
   - The rough agenda flow (e.g., explore-1 → explore-2 → synthesize → output)

3. **List the open questions the session will explore** — present these as placeholder agenda items only.
   > **The open questions listed here are session agenda items — do not analyze, answer, or elaborate on them.** Listing a question is not an invitation to address it. Each question is a label for a future explore node, nothing more.

4. **State the proposed output format** — what artifact the session produces (e.g., design spec, multi-doc, feed into /plan-generic, or "TBD — determined collaboratively").

5. Present the session design to the user.

6. Ask: **"Does this look like a well-structured session for this topic?"** — approve to write it, or loop back to clarify the structure further.

7. Wait for the user's response.

---

## Constraints

- No content generated in this node should constitute design work on the topic itself.
- Do not propose solutions, architecture pillars, trade-offs, or recommendations.
- Do not analyze or answer the open questions — only list them.

---

## Advance

- `next_step({ next: "finalize" })` — user approves the session structure
- `next_step({ next: "clarify" })` — user wants to adjust the structure before starting
