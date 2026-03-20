# Session: config-rewrite

**Goal:** Rewrite the entire opencode config from scratch — plugin-enforced planning, cross-session memory, typed session artifacts, and a robust subagent routing system — replacing all markdown-file-based workflows with programmatic, DAG-executed equivalents.

---

## Done Criteria

- [ ] New `opencode/opencode.json` in place with all agents, plugins, and MCPs configured
- [ ] `headwrench.md` rewritten with memory plugin usage protocol and DAG execution model
- [ ] `/plan-<type>` slash commands implemented (generic, debug, collaborative, deep-research, session-type)
- [ ] Planning enforcement plugin implemented (blocks task execution without a plan artifact; next_step built-in tool)
- [ ] DAG node schema locked down; plan DAG JSON files written for each session type
- [ ] Session type protocol files written for each plan type (typed JSON artifact schemas)
- [ ] Subagent files (context-scout, context-insurgent, deep-researcher) updated to new design
- [ ] Config loads in opencode without errors
- [ ] Manual plan session walkthrough succeeds

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ complete | Research: memory plugins + plugin API enforcement capabilities — **DeepResearcher (parallel group)** |
| 02 | ✅ complete | Lock down DAG node schema (collaborative) — **HW direct** |
| 03 | 🔄 in_progress | Design /plan-generic JSON + resulting session JSON — **HW direct** |
| 04 | 🔲 pending | Design /plan-debug JSON + resulting session JSON — **HW direct** |
| 05 | 🔲 pending | Design /plan-collaborative JSON + resulting session JSON — **HW direct** |
| 06 | 🔲 pending | Implement planning enforcement plugin — **HW direct** |
| 07 | 🔲 pending | Implement opencode.json, headwrench.md, slash commands, session type protocols — **HW direct** |
| 08 | 🔲 pending | Implement subagents (context-scout, context-insurgent, deep-researcher) — **HW direct** |
| 09 | 🔲 pending | Validation: integration test + manual walkthrough — **HW direct** |

---

## Gates

### G1 — Research Review ✅ PASSED
**After subtask 01.** User selected OMEGA Memory as the memory plugin and approved the plugin-driven DAG architecture (next_step built-in tool + chat.message plan-first invariant).

### G2 — Design Approval
**After subtasks 02–05.** Each design subtask ends with a [🚫 GATE] — user approves the DAG node schema, then each plan type design, before implementation begins in subtask 06.

---

## Current Focus
**Subtask 03 — Design /plan-generic JSON + resulting session JSON**

---

## Scope

**In scope:**
- `~/.config/opencode/` — all global config files (agents, commands, protocols, skills)
- `opencode/opencode.json` — root config
- New planning enforcement plugin (`plugins/planning-enforcement/` TypeScript npm package)
- DAG JSON files for each session type (`dags/*.json`)
- Session type artifact schemas

**Out of scope:**
- `.opencode/sessions/config-reimplementation-research/` — prior research session (read-only reference)
- Any project-specific `.opencode/context/` files for other repos
- DCP plugin source (carry forward as-is)

---

## Patterns & Constraints

- **Plugin-driven DAG execution** — slash command loads DAG JSON, plugin drives turns via `next_step` built-in tool and `chat.message` hook
- **No markdown-file planning enforcement** — all planning enforcement must be programmatic (plugin)
- **No mid-session agent switching** — all routing decisions resolved at plan time (opencode Issue #5963)
- **model field in slash command YAML is bugged in v0.6.4** — do not rely on it
- **No session-local agents** — all implementation subtasks (06–08) are executed by HeadWrench directly
- **DCP config carries forward unchanged** — `opencode/dcp.jsonc` is not modified
- **OMEGA Memory selected** — MCP server for cross-session project memory with recency decay
- **next_step tool** registered by planning enforcement plugin (not MCP); injects next DAG step prompt via `ctx.client.session.prompt({ noReply: true })`
