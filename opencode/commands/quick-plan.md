---
description: "Lightweight alignment check before executing a small, focused change. Short Q&A → confirm understanding → execute immediately. No session tracking, no subtasks, no files written."
agent: headwrench
---

Run a quick alignment check for a small, targeted change, then execute it. The user's description of the task is: `$ARGUMENTS`

## Step 1 — Orient

**Step 1a — Quick orientation (HW direct):** Glob/grep the project yourself for high-level layout: directory structure, key config files, language/framework signals. This takes seconds and gives you enough to dispatch targeted scouts.

**Step 1b — Parallel ContextScout dispatch:** Dispatch one or more @ContextScout agents in parallel — one per distinct concern relevant to the task. Each scout covers its slice of:
- Codebase structure (layout, languages, frameworks, build system)
- Prior sessions and their outcomes
- Active context from Tier 2 (`~/.config/opencode/context/`) and Tier 3 (`.opencode/context/`) — skip files with `active: false` or `superseded_by:` set
- Active session notes from Tier 4 (`.opencode/sessions/*/notes/` for in_progress/pending sessions only)
- Do **not** read `.opencode/inbox/` — the inbox is a write-only staging queue; agents never read it

**Step 1c — ContextInsurgent synthesis (when needed):** After the scouts return, synthesize their reports. If the task involves complex multi-file relationships, architectural interdependencies, or findings that need deep sequential reasoning, delegate to @ContextInsurgent to produce a single structured analysis. ContextInsurgent is read-only. Use its output as the situational awareness foundation for Q&A and execution.

## Step 2 — Q&A

If no description was given, ask the user to describe the task first.

Ask only what is needed to avoid misalignment. Skip anything already clear from the description:

- **Goal** — what should be true when this is done?
- **Scope** — anything explicitly out of scope or that must not change?
- **Approach** — any preference on how this should be done, or should HW decide?

Keep it to 1–3 questions. Do not ask for information you already have.

## Step 3 — Confirm and Execute

Summarize your understanding in 2–4 bullet points and ask the user to confirm.

Once confirmed, execute the change immediately.
