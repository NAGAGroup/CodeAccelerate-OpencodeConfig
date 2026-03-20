# Session: config-rewrite

**Goal:** Rewrite the entire opencode config from scratch — plugin-enforced planning, cross-session memory, typed session artifacts, and a robust subagent routing system — replacing all markdown-file-based workflows with programmatic, DAG-executed equivalents.

---

## Done Criteria

- [ ] New `opencode/opencode.json` in place with all agents, plugins, and MCPs configured
- [ ] `headwrench.md` rewritten with memory plugin usage protocol and DAG execution model
- [ ] `/plan-<type>` slash commands implemented (generic, debug, collaborative, deep-research, session-type)
- [ ] Planning enforcement plugin selected and integrated (blocks task execution without a plan artifact)
- [ ] Session type protocol files written for each plan type (typed JSON artifact schemas)
- [ ] Subagent files (context-scout, context-insurgent, deep-researcher) updated to new design
- [ ] Config loads in opencode without errors
- [ ] Manual plan session walkthrough succeeds

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | 🔲 pending | Research: memory plugins + plugin API enforcement capabilities — **DeepResearcher (parallel group)** |
| 02 | 🔲 pending | Design decisions: synthesize research into architecture — **HW direct (collaborative)** |
| 03 | 🔲 pending | Implement: opencode.json (agents, plugins, MCPs) — **HW direct** |
| 04 | 🔲 pending | Implement: headwrench.md (new primary agent) — **HW direct** |
| 05 | 🔲 pending | Implement: slash commands /plan-<type> — **HW direct** |
| 06 | 🔲 pending | Implement: planning enforcement plugin — **HW direct** |
| 07 | 🔲 pending | Implement: session type protocol files — **HW direct** |
| 08 | 🔲 pending | Implement: subagent files (context-scout, context-insurgent, deep-researcher) — **HW direct** |
| 09 | 🔲 pending | Validation: integration test + manual walkthrough — **HW direct** |

---

## Gates

### G1 — Research Review
**After subtask 01.** HW surfaces memory plugin options and plugin API enforcement capabilities. User selects the memory plugin and approves the enforcement approach before any design work begins.

### G2 — Design Approval
**After subtask 02.** HW presents the complete architecture design (design.md). User must explicitly approve before any implementation subtask begins.

---

## Current Focus
**Not started.** Awaiting user approval of this plan.

---

## Scope

**In scope:**
- `~/.config/opencode/` — all global config files (agents, commands, protocols, skills)
- `opencode/opencode.json` — root config
- New planning enforcement plugin (npm package or config)
- Session type artifact schemas

**Out of scope:**
- `.opencode/sessions/config-reimplementation-research/` — prior research session (read-only reference)
- Any project-specific `.opencode/context/` files for other repos
- DCP plugin source (carry forward as-is)

---

## Patterns & Constraints

- **No markdown-file planning enforcement** — all planning enforcement must be programmatic (plugin or agent protocol with hard artifact checks)
- **No mid-session agent switching** — all routing decisions resolved at plan time (opencode Issue #5963)
- **model field in slash command YAML is bugged in v0.6.4** — do not rely on it
- **No session-local agents** — all implementation subtasks (03–08) are executed by HeadWrench directly
- **DCP config carries forward unchanged** — `opencode/dcp.jsonc` is not modified
- **DeepResearcher is user-gated** for web research; the research in subtask 01 is an approved dispatch
