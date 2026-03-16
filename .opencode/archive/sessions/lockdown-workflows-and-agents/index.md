# Session: lockdown-workflows-and-agents

## Goal
Lockdown the primary workflow (plan → session plans + inbox → local/global context), lockdown the session plan format for strict agent adherence, and audit all agent files and agent specs in `opencode/opencode.json`.

## Done Criteria
- [ ] `plan→session` workflow spec written and saved to `docs/` or persistent context
- [ ] Session plan format schema doc written — covers required fields for `index.md` and `spec.json`
- [ ] Schema doc and enforcement instructions embedded in `opencode/agents/headwrench.md`
- [ ] All files in `opencode/agents/` audited — issues documented in `notes/agent-audit.md`
- [ ] `opencode/opencode.json` audited — issues documented in `notes/opencode-json-audit.md`
- [ ] Checkpoint protocol reviewed — gaps documented in `notes/checkpoint-review.md`
- [ ] All identified issues from audits applied (or explicitly deferred with reason)
- [ ] Final commit made with conventional commit message; session closed

## Subtasks

| #  | Status         | Agent        | Description                                                   |
|----|----------------|--------------|---------------------------------------------------------------|
| 00 | ✅ completed   | HeadWrench   | Session bootstrap — create directory, index.md, spec.json     |
| 01 | 🔲 pending     | ContextScout | Audit all agent files in `opencode/agents/` and commands      |
| 02 | 🔲 pending     | ContextScout | Audit `opencode/opencode.json` agent specs                    |
| 03 | 🔲 pending     | ContextScout | Review checkpoint protocol — identify gaps                    |
| G1 | 🚫 GATE       | —            | Pre-Write Audit Synthesis — review all audit notes before any writes |
| 04 | 🔲 pending     | DocWriter    | Write plan→session workflow spec document                     |
| 05 | 🔲 pending     | DocWriter    | Write session plan format schema doc + update headwrench.md   |
| G2 | 🚫 GATE       | —            | Agent File Audit Review — review notes/agent-audit.md before edits |
| 06 | 🔲 pending     | DocWriter    | Apply fixes from agent file audit (subtask 01)                |
| G3 | 🚫 GATE       | —            | opencode.json Audit Review — review notes/opencode-json-audit.md before edits |
| 07 | 🔲 pending     | DocWriter    | Apply fixes from opencode.json audit (subtask 02)             |
| G4 | 🚫 GATE       | —            | Pre-Close Consistency Check — human review before final commit |
| 08 | 🔲 pending     | HeadWrench   | Final review, conventional commit, close session              |

> `[🚫 GATE]` items are non-negotiable stops requiring explicit user approval before proceeding.

---

## Gates

### G1 — Pre-Write Audit Synthesis (before subtask 04)
All three audits (01 agent files, 02 opencode.json, 03 checkpoint protocol) are now complete. Before any DocWriter subtasks begin:
1. Review `notes/` for all three audit outputs.
2. Do the findings change the scope or content of the workflow spec (subtask 04)?
3. Do checkpoint protocol gaps require design decisions before the spec is written?

Approve to proceed to subtask 04. Reject to adjust DocWriter's instructions first.

### G2 — Agent File Audit Review (before subtask 06)
Subtask 01 (ContextScout) has completed its audit of `opencode/agents/` and `opencode/commands/`. Before DocWriter applies any fixes, review `notes/agent-audit.md` and confirm:
1. Which findings are genuine problems vs. observations?
2. Which fixes are in-scope for this session (docs/config only)?
3. Are there any findings that require architectural discussion before touching?

Approve to proceed to subtask 06. Reject to revise scope first.

### G3 — opencode.json Audit Review (before subtask 07)
Subtask 02 (ContextScout) has completed its audit of agent specs in `opencode/opencode.json`. Before DocWriter modifies `opencode.json`, review `notes/opencode-json-audit.md` and confirm:
1. Each proposed change is unambiguous — no guessing about intent.
2. No agent spec changes will alter tool permissions or model assignments unexpectedly.
3. You are prepared to manually verify the file after DocWriter writes it.

This is the highest-risk write in the session. Approve only when findings are clear. Reject to scope changes more narrowly or defer to a separate session.

### G4 — Pre-Close Consistency Check (before subtask 08)
All DocWriter subtasks are complete. Before HeadWrench closes the session:
1. Read the new workflow spec doc (subtask 04) end-to-end.
2. Confirm headwrench.md's embedded format instructions match the schema doc (subtask 05).
3. Spot-check `opencode.json`: do agent specs reflect the intended state?
4. Any contradictions between new docs and existing agent files?

This commit becomes the new ground truth for all future sessions. Approve to finalize. Reject to send specific artifacts back for revision.

### Circuit Breaker (inline, all subtasks)
If any agent discovers a required fix cannot be accomplished within docs/config-only constraints: do not apply workarounds. Document the finding in `notes/`, stop the subtask, escalate immediately.

---

## Current Focus

- Subtask 00 complete — session bootstrapped.
- **Next:** Begin subtask 01 — audit agent files.

---

## Scope

### In scope
- `opencode/agents/headwrench.md` — primary orchestrator definition; will receive schema enforcement instructions
- `opencode/agents/subagents/*.md` — all subagent definitions; audit targets
- `opencode/commands/*.md` — slash command definitions; audit targets (contain embedded agent behaviours)
- `opencode/opencode.json` — agent model specs, permissions, MCP config; audit target
- `docs/` (new files) — workflow spec doc and session plan schema doc will be written here
- `.opencode/sessions/lockdown-workflows-and-agents/notes/` — audit findings and review notes

### Out of scope
- No changes to `opencode/plugins/` (code — excluded)
- No changes to `.opencode/` package files (`package.json`, `bun.lock`, `node_modules/`)
- No new features — docs and config only
- No changes to prior session files in `.opencode/sessions/audit-session-compaction-plugin/`

---

## Patterns & Constraints

- **HeadWrench delegation model is sacred** — HeadWrench never writes code or does deep research directly; it always delegates
- **Session plan is the source of truth** — subtask files are the authoritative spec; agents follow them strictly
- **ContextScout is always strictly read-only** — it must never edit, write, or execute mutating bash commands
- **`.opencode/sessions/` path is fixed** — never reference or move sessions elsewhere
- **Checkpoint is mandatory** — every subtask ends with the checkpoint protocol in `protocols/checkpoint.md`
- **Conventional commits** — all commits use `feat/fix/docs/chore` prefixes; WIP commits use `wip: subtask-NN <description>`
- **Docs/config only** — no TypeScript, no plugin changes, no build steps required in this session
