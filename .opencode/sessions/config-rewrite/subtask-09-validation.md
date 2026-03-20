# Subtask 09 — Validation: Integration Test + Manual Walkthrough

## Delegation
**Agent:** HeadWrench direct
**Model:** anthropic/claude-sonnet-4-6

---

## Objective
Validate all implemented config components against the approved designs. Run the plugin build, cross-reference all files against design notes, and write a validation report.

---

## Context
Read before validating:
- `notes/dag-node-schema.md`
- `notes/plan-generic-design.md`
- `notes/plan-debug-design.md`
- `notes/plan-collaborative-design.md`

---

## Todolist

### Plugin Validation
- [ ] Run `npm run build` in `plugins/planning-enforcement/` — must pass with no errors
- [ ] Verify `next_step` tool registration matches mermaid-tool.ts pattern
- [ ] Verify `chat.message` hook bypass conditions are correct
- [ ] Verify `experimental.chat.system.transform` reads dag-state.json correctly
- [ ] Verify DAG JSON files in `dags/` match approved node schema

### Config File Validation
- [ ] `opencode/opencode.json` — parses as valid JSON, all plugins/MCPs/agents present
- [ ] `~/.config/opencode/agents/headwrench.md` — OMEGA memory protocol, routing table, commit ownership all present
- [ ] `~/.config/opencode/commands/` — all /plan-* commands present, no `model:` fields, correct YAML
- [ ] `~/.config/opencode/protocols/` — all session type protocols present, plan-collaborative has definition box
- [ ] `~/.config/opencode/agents/subagents/` — all three present, deny-by-default permissions, Role-Goal-Backstory

### Cross-Reference Check
- [ ] Every design decision from Gate 1 + subtasks 02–05 is reflected in the implementation
- [ ] No placeholder values (PLACEHOLDER_MODEL_ID or similar) anywhere in any file
- [ ] OMEGA Memory wired: both in `plugin` array and `mcp` block of opencode.json

### Write Report
- [ ] Write `notes/validation-report.md`
  - Check groups with pass/fail status
  - Any discrepancies found and resolved
  - Open items (if any)

### Gate
- [ ] [🚫 GATE] Surface validation report to user — user approves before session close

---

## Scope
- All implemented files from subtasks 06–08
- Build verification for the plugin
- Cross-reference vs design notes
- Out of scope: live end-to-end testing (manual walkthrough is user responsibility post-gate)

## Constraints
- `npm run build` must pass — this is a hard requirement
- No placeholders may remain in any file
- Validation report must be honest — flag real discrepancies, don't paper over them

## Verification
- `npm run build` green
- Validation report written
- User approves at gate

## Final Commit
After gate approval: `feat: complete session — config-rewrite`

---

*Final session commit: `feat: complete session — config-rewrite`*
