# Subtask 02 — Slash Commands

## Delegation
- **Agent:** DocWriter
- **Model tier:** fast (github-copilot/claude-haiku-4.5)
- **Reason:** Writing two markdown slash command files with well-specified, unambiguous behavior. No code, no complex judgment — pure documentation work. Fast tier is sufficient.

---

## Objective

Create two new slash command files in `opencode/commands/`:

1. **`activate-session.md`** — Lists available sessions, user picks one, HW calls the `activate_session` tool (registered by the session-context plugin) with the chosen session name. The command never handles session IDs directly — the tool does that internally.

2. **`deactivate-session.md`** — HW calls the `deactivate_session` tool (registered by the session-context plugin). No session ID handling needed — the tool manages it internally.

Both commands are HeadWrench-executed. The plugin's tools handle all file I/O and session ID resolution.

---

## Todolist

### 1. Read existing command for style reference
- [ ] Read one existing command file (e.g., `opencode/commands/plan.md`) to understand formatting and writing style

### 2. Write activate-session.md
- [ ] Create `opencode/commands/activate-session.md` with the behavior described below

### 3. Write deactivate-session.md
- [ ] Create `opencode/commands/deactivate-session.md` with the behavior described below

### 4. Verify both files
- [ ] Read both created files to confirm correctness and style match

---

## Scope
- **Write:** `opencode/commands/activate-session.md`, `opencode/commands/deactivate-session.md`
- **Read:** One existing command file for style reference (e.g., `opencode/commands/plan.md`)
- **Excluded:** All plugin files, existing commands (read-only for reference), agents, protocols

---

## Patterns
```
✅ GOOD — Commands call the plugin tools (activate_session / deactivate_session)
✅ GOOD — Commands never reference session IDs or metadata file paths directly
✅ GOOD — Clear numbered steps for what HW does
✅ GOOD — Matches writing style of existing commands
❌ BAD  — Commands trying to write the metadata file themselves (that's the tool's job)
❌ BAD  — Commands reading or parsing the session ID from the system prompt
❌ BAD  — Delegating to subagents (these are direct HW operations)
❌ BAD  — Vague instructions without specific tool names
```

---

## Constraints

### activate-session behavior:
1. List all directories in `.opencode/sessions/` — these are the available session plans
2. For each session, read its `spec.json` to show `status` and `goal` for context
3. Present the list to the user and ask them to pick one
4. Call the `activate_session` tool with `{ sessionName: "<chosen>" }`
5. Surface the tool's response to the user (success or error message)

### deactivate-session behavior:
1. Call the `deactivate_session` tool with no arguments
2. Surface the tool's response to the user (success or error message)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
