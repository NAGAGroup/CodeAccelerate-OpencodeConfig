# Subtask 10 — update-docs-and-release

## Objective
Update all documentation to reflect the new `/plan-deep-research` command and protocol, update CHANGELOG.md, and apply the v1.0.0 git tag to close the release.

## TL;DR
With the new protocol and command in place, documentation counts and entries need updating across 5 files. Then CHANGELOG.md gets one new line in the v1.0.0 Added section. After the doc agent completes, HeadWrench applies the final git tag.

## Scope
### Edit (session-local-implementer)
- `FEATURES.md` — protocols 9→10, commands 11→12
- `docs/USAGE.md` — add `/plan-deep-research` to Quick Reference table + add command section
- `docs/CONCEPTS.md` — update slash commands count (11→12), add entry
- `README.md` — update command count (11→12)
- `CHANGELOG.md` — add `/plan-deep-research` to v1.0.0 Added section

### Bash (HeadWrench directly — after doc agent completes)
- `git tag v1.0.0 -m "v1.0.0 release"`

### Read
- `opencode/commands/plan-deep-research.md` (for accurate description to use in docs)
- Current content of each file being edited

### Excluded
- All other files

## Constraints
- Do NOT rewrite sections — make targeted additions/count updates only
- Use the actual command file content for descriptions, not invented text
- The git tag is HeadWrench's responsibility — the doc agent does NOT run it
- This is the **final subtask** — use Session Close commit format: `feat: complete session — v1-release-prep`
- Tag format: `git tag v1.0.0 -m "v1.0.0 release"`

## Changes Required

### FEATURES.md
- Component inventory table: Protocols `9` → `10`, Commands `11` → `12`
- Protocols table: add row for `plan-deep-research.md`
- Commands table: add row for `/plan-deep-research`

### docs/USAGE.md
- Intro line: `"11 slash commands"` → `"12 slash commands"`
- Quick Reference table: add `/plan-deep-research` row
- Add a new `### /plan-deep-research` section (or `##` if it fits better with surrounding structure)

### docs/CONCEPTS.md
- Slash commands count: `"11 slash commands"` → `"12 slash commands"`
- Add `/plan-deep-research` to the commands list

### README.md
- Update command count reference from `11` → `12`

### CHANGELOG.md
- In the `[1.0.0]` Added section, add: `- /plan-deep-research command and protocol — dedicated research planning mode using DeepResearcher`

## Todolist
- [ ] Read opencode/commands/plan-deep-research.md (accurate description)
- [ ] Update FEATURES.md (protocols 9→10, commands 11→12, add rows)
- [ ] Update docs/USAGE.md (count 11→12, add Quick Reference row, add section)
- [ ] Update docs/CONCEPTS.md (count 11→12, add entry)
- [ ] Update README.md (count 11→12)
- [ ] Update CHANGELOG.md (add /plan-deep-research to v1.0.0 Added)
- [ ] 🚫 GATE — HW applies v1.0.0 git tag: `git tag v1.0.0 -m "v1.0.0 release"`

## Delegation
**Agent:** @session-local-implementer (doc edits); HeadWrench directly (git tag)
**Reason:** Five targeted documentation file edits delegated to implementer; git tag is a HW-only infrastructure operation and the final release action.
