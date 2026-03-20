# Subtask 01 — Research: Memory Plugins + Plugin API Enforcement

## Delegation — Parallel Group
This subtask uses parallel delegation. Launch both slots simultaneously in a single message.

### Slot A — Memory Plugin Research
- **Agent:** @DeepResearcher
- **Scope:** Survey MCP-compatible memory plugins with recency decay

### Slot B — Plugin API Surface Mapping
- **Agent:** @ContextScout
- **Scope:** Read DCP plugin source + opencode plugin documentation to map enforcement capabilities

---

## Objective
Gather the two key inputs needed before any design decisions can be made: (1) which MCP-compatible memory plugins exist with built-in recency decay that could serve as the cross-session project memory store, and (2) what the opencode Plugin API actually supports for enforcement — specifically whether it can intercept or block message execution until a plan artifact exists.

> **Audience note:** This subtask file is read by HeadWrench. The operational content is passed to each slot agent as a self-contained task. Each slot agent has no awareness of session context beyond what is written here.

---

## Todolist

### Slot A — Memory Plugin Research
- [ ] Search for MCP-compatible memory/knowledge graph servers with recency decay (last 6 months of activity preferred)
- [ ] For each candidate: document install method, persistence backend, recency decay mechanism, and whether it supports structured project context (not just chat history)
- [ ] Identify top 3 candidates ranked by: (1) recency decay quality, (2) local-first vs managed, (3) active maintenance
- [ ] Note any strict usage enforcement mechanisms each plugin offers

### Slot B — Plugin API Surface Mapping
- [ ] Read the DCP plugin source at `opencode/dcp.jsonc` and the DCP npm package (if accessible) to understand what hooks it uses
- [ ] Read opencode plugin documentation to catalog all available hooks: chat.params, chat.message, event hooks, any others
- [ ] Determine: can a plugin intercept or delay message execution? Can it block until a specific file artifact exists?
- [ ] Determine: can a plugin enforce max_iter on an agent? What other execution constraints are available?
- [ ] Write findings as a structured summary: hook name → what it does → enforcement capability (yes/no/partial)

### Final
- [ ] [🚫 GATE] HW surfaces research findings to user; user selects memory plugin and approves enforcement approach before subtask 02 begins

---

## Scope
- **Read:** `opencode/dcp.jsonc`, opencode plugin docs (web), npm packages for candidate memory plugins (web)
- **Write:** Nothing — research only; HW writes session notes from findings
- **Excluded:** Any implementation files

---

## Patterns
```
✅ GOOD — Document enforcement capability as "yes / no / partial" with a concrete example
❌ BAD  — Vague statements like "might support enforcement" without specifics
✅ GOOD — Rank memory plugin candidates with explicit criteria
❌ BAD  — List candidates without comparative evaluation
```

---

## Constraints
- Slot A must search for plugins published or updated within the last 12 months — stale plugins are not viable
- Slot B must check actual Plugin API docs, not just the DCP config file
- Both slots return structured findings (not prose paragraphs) for easy synthesis

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
