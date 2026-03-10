# Session: agent-permissions-and-insurgent

**Goal:** Introduce ContextInsurgent (powerful exploration subagent, ask-only), remove @explorer from HeadWrench, audit and lock down all custom agent permissions, and implement /session-status in the best achievable form given current OpenCode platform capabilities.

---

## Done Criteria

- [ ] ContextInsurgent agent file created with sequential thinking + correct permissions
- [ ] ContextInsurgent registered in `opencode.json` with `claude-sonnet-4.6` model
- [ ] HeadWrench delegation rules updated: @explorer removed, ContextInsurgent added with ask-only guidance
- [ ] HeadWrench Build-Test-Debug Loop updated to reference ContextScout/ContextInsurgent instead of @explorer
- [ ] Full permissions audit completed covering all agents (including new ContextInsurgent and HeadWrench itself)
- [ ] Audit findings reviewed and approved by user (Gate G1)
- [ ] Permission lockdowns applied to all agent files
- [ ] /session-status implemented (approach determined at Gate G1 based on research findings)
- [ ] `lockdown-workflows-and-agents` noted as superseded

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ done | Create ContextInsurgent agent file + register in opencode.json — DocWriter / fast |
| 02 | ✅ done | Update HeadWrench: remove @explorer, add ContextInsurgent guidance, update debug loop — DocWriter / fast |
| 03 | ✅ done | Permissions audit — all agents read-only analysis + findings report — ContextScout / fast |
| G1 | ✅ done | Review audit findings. Decide: which lockdowns to apply? Which /session-status approach to build? |
| 04 | ⏭ skipped | Apply permissions lockdowns — SKIPPED (audit found zero required changes) |
| 05 | ✅ done | /session-status slash command at opencode/commands/session-status.md |

---

## Gates

### G1 — Audit Review + /session-status Decision

**Stop condition:** After permissions audit is complete (subtask 03 done).

**Decisions made (2026-03-10):**
1. **Lockdowns:** Audit found zero required changes. The only finding (`task: deny` missing on `agent-delegation-expert`) is moot — that subagent was already removed. Subtask 04 is a verification pass only.
2. **HeadWrench permission block:** Leave as-is (user decision).
3. **`/session-status`:** Option B — TypeScript plugin with sidebar panel at `opencode/plugins/session-status.ts`. Shows subtask progress list; graceful empty state when no active session.

---

## Current Focus

**Next:** Begin subtask 03 — Permissions audit.

---

## Scope

**In scope:**
- New agent: `opencode/agents/subagents/context-insurgent.md`
- `opencode/opencode.json` — add ContextInsurgent model entry
- `opencode/agents/headwrench.md` — delegation rules + debug loop update
- All existing agent `.md` files — permissions audit + lockdowns
- New slash command or plugin for `/session-status` (approach decided at gate)
- Session notes documenting findings

**Out of scope:**
- Changes to protocols or session schema
- Changes to skills or commands unrelated to /session-status
- TypeScript plugin changes (unless user picks Option B at G1)
- Documentation (README, FEATURES, USAGE)

---

## Patterns & Constraints

- Agent `.md` files are the canonical source of agent permissions — not `opencode.json`
- Model assignments live in `opencode.json` only — never in agent frontmatter
- ContextInsurgent must be narrower in scope than HeadWrench — read-only like ContextScout, but more capable
- @explorer must be completely removed from HeadWrench's instructions (delegation table + debug loop section)
- "ask-only" for ContextInsurgent means HW uses the `question` tool before each invocation — enforced by HW instructions, not permission frontmatter
- Permissions lockdowns: prefer explicit `deny` over implicit/missing entries — be explicit
- `task: deny` should be set on all subagents (prevent delegation chains)
- HeadWrench is a primary agent — its permissions model differs from subagents
