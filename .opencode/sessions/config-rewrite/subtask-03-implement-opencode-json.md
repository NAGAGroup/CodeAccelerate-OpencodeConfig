# Subtask 03 — Implement opencode.json

## Delegation

**Agent:** HeadWrench (direct — no subagent)

---

## Objective

Write a new `opencode/opencode.json` from scratch based on the design decisions documented in `.opencode/sessions/config-rewrite/notes/design.md`. This is the root configuration file for the opencode tool — it controls agents, models, plugins, and MCP servers. The existing file at `opencode/opencode.json` must be fully replaced.

---

## Todolist

- [ ] Read `.opencode/sessions/config-rewrite/notes/design.md` for all decisions about model tiers, plugin list, memory plugin choice, and agent configuration
- [ ] Read current `opencode/opencode.json` to understand the format (structure reference only — do NOT copy values)
- [ ] Draft new opencode.json with: autoupdate, small_model, plugin list (DCP + planning enforcement plugin + memory plugin), default_agent, agent blocks, mcp servers
- [ ] Disable built-in agents: plan, general, explore (keep `build` enabled as escape hatch)
- [ ] Configure model tiers per design.md (headwrench=sonnet, subagents per tier, compaction=haiku)
- [ ] Include memory plugin MCP server config (server name, command, enabled flag, any required env vars)
- [ ] Write final file to `opencode/opencode.json`
- [ ] Verify: JSON is valid, all required keys present, no placeholder values remain

---

## Scope

- **Write:** `opencode/opencode.json` (full replacement)
- **Read:** `opencode/opencode.json` (format reference), `.opencode/sessions/config-rewrite/notes/design.md` (decisions)
- **Do NOT touch:** `opencode/dcp.jsonc`, any `.md` files, any agent files

---

## Patterns

- DCP plugin stays as-is: `@tarquinen/opencode-dcp@latest`
- Planning enforcement plugin name will be determined by design.md — use whatever is specified there
- Memory plugin MCP server config follows the same shape as existing MCP entries: `{"type": "local", "command": [...], "enabled": true}`
- `small_model` should point to whatever haiku-tier model is decided in design.md

---

## Constraints

- Must be valid JSON (no comments, no trailing commas)
- Do NOT reference the old config values — derive everything from design.md
- The `build` agent must NOT be disabled — it is the escape hatch
- All built-in agents (`plan`, `general`, `explore`) must have `"disable": true`
- Do not add MCP servers that are not in design.md or the existing config

---

## Success Criteria

- `opencode/opencode.json` parses as valid JSON
- All 4 constraints above are satisfied
- Model assignments match design.md tier decisions exactly
- Memory plugin appears in both `plugin` array and `mcp` block (if it requires both)

---

_Checkpoint: commit as `wip: subtask 03 complete — implement opencode.json`_
