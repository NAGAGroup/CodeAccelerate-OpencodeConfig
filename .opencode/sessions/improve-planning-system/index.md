# Session: improve-planning-system

**Goal:** Overhaul the planning system to improve compaction survival, parallel delegation, task sizing, agent commits, `/amend` functionality, and plan type detection.

## Done Criteria

- [ ] `/amend.md` rewritten with full planning workflow knowledge, delegation re-run, and in-progress session safety rules
- [ ] DCP prompt overrides written (`system.md`, `compress.md`, `context-limit-nudge.md`) and `dcp.jsonc` tuned to protect active subtask reads
- [ ] Session summary todo format strengthened; compaction recovery procedure documented in `headwrench.md` and `checkpoint.md`
- [ ] Parallel group delegation syntax defined in `session-plan-schema.md`; HW launch mechanics documented
- [ ] Task sizing limits and resubmit/task_id pattern documented; prompting philosophy added to `headwrench.md`
- [ ] `checkpoint.md`, `code-writer.md`, `doc-writer.md`, and `headwrench.md` updated so agents commit their own work + session directory
- [ ] `plan.md` and `plan-workflow.md` updated with session type detection and conditional Q&A branches
- [ ] All modified files are internally consistent and cross-file references are accurate

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ completed | Rewrite `/amend.md` from scratch — **@CodeWriter / standard** |
| 02 | ✅ completed | DCP prompt overrides + `dcp.jsonc` tuning — **@CodeWriter / standard** |
| 03 | ✅ completed | Compaction survival: session summary todo + recovery procedures — **@CodeWriter / standard** |
| 04 | ✅ completed | Parallel delegation schema: new parallel group syntax — **@CodeWriter / standard** |
| 05 | ✅ completed | Task sizing + prompting philosophy — **@CodeWriter / fast** |
| 06 | ✅ completed | Agent commit rules: checkpoint + subagent defs + headwrench — **@CodeWriter / fast** |
| 07 | ✅ completed | Dynamic plan types: session type detection in plan.md + plan-workflow.md — **@CodeWriter / standard** |
| 08 | ✅ completed | Final review + polish pass — **@DocWriter / fast** |

## Gates Section

No gates defined for this session. All work is low-risk markdown editing of config and protocol files.

## Current Focus

**Session complete.** All 8 subtasks finished successfully.

## Scope

### In-Scope
- `~/.config/opencode/commands/plan.md`
- `~/.config/opencode/commands/amend.md`
- `~/.config/opencode/protocols/session-plan-schema.md`
- `~/.config/opencode/protocols/plan-workflow.md`
- `~/.config/opencode/protocols/checkpoint.md`
- `~/.config/opencode/agents/headwrench.md`
- `~/.config/opencode/agents/subagents/code-writer.md`
- `~/.config/opencode/agents/subagents/doc-writer.md`
- `~/.config/opencode/dcp.jsonc`
- `~/.config/opencode/dcp-prompts/overrides/system.md`
- `~/.config/opencode/dcp-prompts/overrides/compress.md`
- `~/.config/opencode/dcp-prompts/overrides/context-limit-nudge.md`

### Out-of-Scope
- All other subagent definitions (context-scout, architect, etc.)
- The `/continue`, `/session-status`, `/context-*`, `/inbox` commands
- Project-level `.opencode/` directory (except session files for this session)
- Any code or build infrastructure

## Patterns & Constraints

- All files are Markdown. No code is written.
- New features are documented as first-class protocol or schema sections, not buried in passing notes.
- Each modified file must be internally self-consistent after edits.
- Cross-references between files must remain accurate (e.g., if `plan.md` references a step from `plan-workflow.md`, they must align).
- Do not remove existing content without a clear reason; prefer extending over replacing unless the content is wrong.
- The global `~/.config/opencode/` path is used everywhere — do not use relative paths in protocol docs.
