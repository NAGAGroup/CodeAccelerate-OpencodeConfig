# Subtask 07 — phase3-plugin-work

## Delegation
**Agent:** @config-implementer  
**Reason:** TypeScript plugin implementation — standard implementation work (sonnet-class handles TypeScript).

---

## Objective

Implement Phase 3 plugin work — TypeScript opencode Plugin API features that cannot be achieved with markdown config alone. This subtask is behind a gate (user must approve Phase 3 before this runs).

Phase 3 targets from the research roadmap:
1. **Cost tracking hook** — use the `chat.message` Plugin hook to log token usage per session. Write to `.opencode/sessions/{name}/cost-log.jsonl` or similar. Lightweight — just capture the model, input tokens, output tokens, and cost per message.
2. **Max iteration enforcement** — use the Plugin API to enforce `max_iter` limits on subagents. When a subagent hits its `steps:` limit, log the event. (Note: opencode may handle this natively — verify before implementing.)

The implementer should first verify what the Plugin API actually supports for these use cases by reading `opencode/plugins/mermaid-tool.ts` as the reference implementation and checking available hook types.

---

## Scope

### In Scope
- `opencode/plugins/` — add new plugin file(s) as needed
- `opencode/package.json` — add dependencies if needed
- `opencode/opencode.json` — add plugin entries if needed

### Out of Scope
- `mermaid-tool.ts` — do not modify existing plugin
- Full DAG persistence (deferred)
- Dual-model routing (deferred)

---

## Patterns

- Follow `mermaid-tool.ts` as the reference Plugin implementation
- Plugin hooks: `chat.params`, `chat.message`, `event`
- Cost log format: JSONL, one entry per message: `{ "ts": "...", "session": "...", "model": "...", "inputTokens": N, "outputTokens": N }`
- New plugin file: `opencode/plugins/session-tracker.ts` (or similar)

---

## Constraints

- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT modify `mermaid-tool.ts`
- Verify Plugin API capability BEFORE implementing — if the hook needed doesn't exist in the API, note that in output and implement what IS possible
- Keep the plugin minimal — no external dependencies unless necessary
- If cost data is not available via the Plugin API, implement token count tracking only

---

## Context Files

- `opencode/plugins/mermaid-tool.ts` — reference Plugin implementation
- `opencode/package.json` — current dependencies

---

## Success Criteria

- A new plugin file exists in `opencode/plugins/` implementing at least one Phase 3 feature
- `package.json` is updated if new dependencies are needed
- `opencode.json` registers the new plugin if required
- Implementation notes are written to session notes explaining what was implemented and what was deferred (with reasons)

---

## Todolist

- [ ] Read `mermaid-tool.ts` and `package.json` for context
- [ ] Verify Plugin API hook types available (`chat.message` etc.)
- [ ] Implement cost/token tracking plugin
- [ ] Update `package.json` and `opencode.json` if needed
- [ ] Write session note: what was implemented, what was deferred and why
- [ ] [🚫 GATE] — Phase 4 eval: present Phase 3 outcomes and ask user to approve Phase 4 advanced features before continuing
- [ ] [⏸ PAUSE] — Summarize all changes made, show key additions, wait for user sign-off before checkpoint
