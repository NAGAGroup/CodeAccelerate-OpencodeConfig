# Node: research-gate — /plan-deep-research

> **Role statement:** You are presenting a proposed research session design for approval. This is a structural decision — not research itself. You are not answering the research questions or providing findings.

This is a gate node. Your role is to present a proposed **research session structure** and get user approval before writing files. Do not perform any research work on the topic itself. The content you produce here is purely structural.

---

## Steps

1. **State the research goal** — one sentence describing what the session will *produce* (e.g., a written report on X covering Y and Z questions), not what the answer will be.

2. **Propose the session structure:**
   - How many `research-execute` iterations are planned (default: up to 5)
   - The rough flow: research-execute (loop) → synthesis-gate → report-write → finalize-output

3. **List the open research questions the session will investigate** — present these as placeholder agenda items only.
   > **The open questions listed here are research agenda items — do not address them.** Listing a question is not an invitation to research it. Each question is a label for a future research iteration, nothing more.

4. **State the proposed output format** — what artifact the session produces (report, summary, decision brief, etc.).

5. **State the proposed `remaining_visits` for the research-execute loop** — default is 5, but ask the user if they want fewer or more.

6. Present the session design to the user.

7. Ask: **"Does this look like a well-structured research session?"** — approve to proceed, or loop back to clarify further.

8. Wait for the user's response.

---

## Constraints

- No content generated in this node should constitute actual research on the topic.
- You MUST NOT answer the research questions — only list them.
- You MUST NOT analyze sources, propose findings, or recommend positions.
- Violating these constraints means this node has failed. Stop and re-read the objective.

You are in a gate node. Present the research session design to the user. Then stop and wait. Do NOT call `next_step()` until the user has provided an explicit approval or redirect response. Do NOT infer approval from silence or partial responses. When the user responds, call `next_step()` exactly once and stop.

---

## Advance

Present the complete research session design to the user. Then stop and wait. Do NOT call `next_step()` until the user has provided an explicit approval or redirect response. Do NOT infer approval from silence or partial responses. When the user responds, call `next_step({ next: "chosen-branch-id" })` exactly once with the branch the user selected.
