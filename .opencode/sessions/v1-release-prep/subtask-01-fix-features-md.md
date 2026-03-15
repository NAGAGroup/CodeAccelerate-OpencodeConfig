# Subtask 01 — fix-features-md

## Objective
Rewrite `FEATURES.md` to accurately reflect the current state of the framework: correct agent inventory, command count, protocol list, skills count, plugin version, and MCP status.

## TL;DR
FEATURES.md is the "single source of truth" for counts and capabilities, but it's severely out of date. Every table in it is wrong. This subtask brings it back to reality.

## Scope
### Edit
- `FEATURES.md`

### Read
- `opencode/opencode.json`
- `opencode/agents/` directory listing
- `opencode/protocols/` directory listing
- `opencode/commands/` directory listing
- `opencode/skills/` directory listing

### Write
- None

### Excluded
- All other files

## Constraints
- Do NOT modify any file other than `FEATURES.md`
- Keep the same general structure and section headers
- Fix ALL inaccuracies listed in the Changes Required section below
- Do not add commentary or meta-notes inside the file

## Changes Required

### Agent table (lines ~34–43)
- **Remove** these 5 deleted agents entirely: gates-expert, subagent-builder, code-writer, doc-writer, architect
- **Add** context-insurgent (deep codebase exploration, sequential thinking, model: subagents/context-insurgent)
- Summary count in header row: change "8" → "4" (headwrench + 3 subagents)
- Remove any fictional model references (gpt-5.3-codex, claude-opus-4-6 do not exist)
- context-insurgent uses the model defined in its own agent file (no special model field needed in table)

### Commands table (lines ~45–65)
- Change count in header: "9" → "11"
- Add 3 missing commands:
  - `/context-audit` — audits permanent context files for staleness; runs `/context-audit` command
  - `/quick-plan` — lightweight planning for small tasks; runs `/quick-plan` command
  - `/session-status` — displays current session state and subtask progress; runs `/session-status` command

### Protocols section (lines ~70–73)
- Change count: "3" → "9"
- Remove reference to `plan-workflow.md` (does not exist)
- List the actual 9 protocol files:
  - checkpoint.md
  - context-management.md
  - plan-init.md
  - plan-shared.md
  - plan-generic.md
  - plan-collaborative.md
  - plan-debug.md
  - plan-end.md
  - session-plan-schema.md

### Skills section (lines ~79–81)
- Change count: "1" → "2"
- Add agent-writer skill entry: "Teaches HeadWrench to create session-local agent files during plan finalization"

### Plugins section
- Change version: `@beta` → `@3.0.0` for the DCP plugin (`@tarquinen/opencode-dcp@3.0.0`)

### MCPs section (lines ~95–105)
- Change exa status: "disabled (requires EXA_API_KEY)" → "enabled (requires EXA_API_KEY env var)"

### Component inventory summary table (top of file, lines ~21–28)
- Update all counts to match the corrected tables:
  - Agents: 4
  - Commands: 11
  - Protocols: 9
  - Skills: 2
  - MCPs: 3 (unchanged)

## Todolist
- [ ] Read current FEATURES.md to understand exact line structure
- [ ] Fix component inventory summary counts
- [ ] Rewrite agent table (remove 5 deleted, add context-insurgent, fix count to 4)
- [ ] Fix commands table (add 3 missing commands, update count to 11)
- [ ] Rewrite protocols section (9 files, remove plan-workflow.md)
- [ ] Fix skills section (2 skills, add agent-writer)
- [ ] Fix plugin version (@3.0.0)
- [ ] Fix exa MCP status (enabled, requires EXA_API_KEY)
- [ ] Verify final file is internally consistent

## Delegation
**Agent:** @session-local-implementer  
**Reason:** File editing task — rewrites FEATURES.md to match actual framework state.
