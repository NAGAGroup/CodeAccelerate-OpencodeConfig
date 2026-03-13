# Subtask 01 Notes — /amend Overhaul

## Outcome

`~/.config/opencode/commands/amend.md` rewritten from 26 lines to 120 lines.

## Key Design Decisions

- **3-way safety classification**: "may change freely" / "may change with recalculation" / "must not change" — makes safety reasoning explicit and unambiguous
- **Pre-amend context load is mandatory**: must read index.md + spec.json + current subtask file before any edits
- **Delegation re-run is mandatory (not optional)**: uses `skill` tool to load `agent-delegation-expert`, NOT a subagent invocation
- **Gate convention documented**: `[🚫 GATE]` items belong in preceding subtask todolists, never as standalone subtask rows
- **Confirmation diff before writes**: structured preflight (Add/Modify/Delete/Reindex/Delegation impact) must be shown and approved first

## Path Note

`~/.config/opencode/` is a symlink to `./opencode/` in the project. Both paths refer to the same files. Prefer `./opencode/` in future subtasks for clarity.

## Commit

`bd2f463` — feat: overhaul /amend with planning workflow knowledge and in-progress safety
