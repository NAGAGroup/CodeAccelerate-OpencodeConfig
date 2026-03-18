# Subtask 03 — Rewrite Context/Session Commands

## Delegation
**Agent:** @session-local-implementer  
**Model tier:** standard (`github-copilot/claude-sonnet-4.6`)  
**Reason:** Targeted edits to 7 command files — mostly already agent-directed, needs minor framing fixes and consistency polish.

---

## Objective

Rewrite 7 context and session management command files to ensure pure agent-directive language throughout. These files are mostly already well-structured — the fixes are minor: remove any lingering user-doc headings, fix `~/.config/opencode/` path references to use `opencode/` where consistent with local project convention, and verify all `$ARGUMENTS` usage is correct. Preserve all operational logic exactly.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent (`@session-local-implementer`) as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Scope

- **Edit:**
  - `opencode/commands/activate-session.md`
  - `opencode/commands/context-add.md`
  - `opencode/commands/context-audit.md`
  - `opencode/commands/context-list.md`
  - `opencode/commands/context-remove.md`
  - `opencode/commands/deactivate-session.md`
  - `.opencode/commands/roadmap-add.md`
- **Read:** All 7 files above before editing
- **Write:** None
- **Excluded:** Everything else — no plan commands, no protocols, no agents

---

## Patterns

```
✅ GOOD — "Your task: activate an existing session plan." (agent-directive opening)
❌ BAD  — "This command activates a session plan." (describes the command to the agent as if they're reading docs)

✅ GOOD — "$ARGUMENTS" remains exactly as-is — it's a template variable, not a slash command reference
❌ BAD  — Removing or altering $ARGUMENTS interpolation

✅ GOOD — Keeping all step numbers, sub-steps, and operational procedures exactly as written
❌ BAD  — Restructuring well-organized steps to fit a different format

✅ GOOD — Flag types [INBOX], [ARCHIVE], [RETROFIT], [MISCLASSIFIED], [SUPERSEDED], [CONTEXT-REVIEW] preserved verbatim
❌ BAD  — Renaming or removing established flag types
```

---

## Constraints

- These files are already largely agent-directed — apply a light touch; fix only what's actually wrong
- `$ARGUMENTS` is a template variable placeholder — preserve it exactly, including its position and formatting
- Do not alter the path `~/.config/opencode/` in file content — these are correct runtime paths even though the source is symlinked; only change if the file itself uses an inconsistent path that would break at runtime
- Preserve all flag types, step numbers, and decision logic exactly
- The `roadmap-add.md` file uses ` — ` (space-em-dash-space) as a separator in feature strings — preserve this convention exactly
- `deactivate-session.md` and `activate-session.md` are already very clean — likely need zero or minimal changes; do not add content for the sake of it

---

## Todolist

### 1. Read all 7 files
- [ ] Read `opencode/commands/activate-session.md`
- [ ] Read `opencode/commands/context-add.md`
- [ ] Read `opencode/commands/context-audit.md`
- [ ] Read `opencode/commands/context-list.md`
- [ ] Read `opencode/commands/context-remove.md`
- [ ] Read `opencode/commands/deactivate-session.md`
- [ ] Read `.opencode/commands/roadmap-add.md`

### 2. Apply fixes
- [ ] Edit `activate-session.md` — review for any user-doc framing; likely minor or no changes
- [ ] Edit `context-add.md` — review for user-doc framing; verify $ARGUMENTS placement and path references
- [ ] Edit `context-audit.md` — review for user-doc framing; ensure all flag types preserved
- [ ] Edit `context-list.md` — review for user-doc framing; verify emoji display rules preserved
- [ ] Edit `context-remove.md` — review for user-doc framing; ensure chain validation logic intact
- [ ] Edit `deactivate-session.md` — review; likely no changes needed
- [ ] Edit `roadmap-add.md` — review for user-doc framing; preserve ` — ` separator convention

### 3. Verify
- [ ] Confirm all 7 files still contain their complete original operational content (no removals)
- [ ] Confirm no slash command name references remain (e.g., "/context-audit" as a command name inside the command itself — though some files legitimately reference other commands by name for cross-referencing, which is fine)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
