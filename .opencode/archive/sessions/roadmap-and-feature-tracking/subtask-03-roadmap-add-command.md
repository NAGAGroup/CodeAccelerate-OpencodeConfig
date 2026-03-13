# Subtask 03 — Write /roadmap-add Slash Command

## Delegation
**Agent:** @DocWriter
**Model:** fast (claude-haiku-4.5) — pure markdown command file, clear spec, no judgment required

---

## Objective

Create `.opencode/commands/roadmap-add.md` — a project-local slash command that adds one or more feature entries to `ROADMAP.md` at the repo root, then commits the change.

---

## Todolist

### 1. Write .opencode/commands/roadmap-add.md
- [ ] Create `.opencode/commands/roadmap-add.md`
- [ ] Add YAML frontmatter: `description` and `agent: headwrench`
- [ ] Support both argument mode and interactive mode
- [ ] Support multiple features in one invocation
- [ ] Read current ROADMAP.md, insert entries into the correct section, commit

---

## Scope
- **Write:** `.opencode/commands/roadmap-add.md` (new file)
- **Read:** `opencode/commands/inbox.md` and `opencode/commands/session-status.md` for style reference
- **Read:** `ROADMAP.md` at repo root to understand entry format
- **Excluded:** All other files — do not modify ROADMAP.md itself (the command will do that at runtime)

---

## Reference: Existing Command Style

Commands are pure markdown files with YAML frontmatter:

```yaml
---
description: "One-line description of what this command does."
agent: headwrench
---
```

The body is natural language instructions the agent follows at runtime.

---

## Command Behavior Spec

The command must handle **two modes**:

### Mode A — Arguments provided
User invokes: `/roadmap-add planned "custom agent hot-reload — reload agent defs without restart"`
- Parse the section and feature string from the arguments
- Multiple features can be passed in one invocation (comma-separated or multiple quoted strings)
- Skip the Q&A prompting

### Mode B — No arguments
User invokes: `/roadmap-add`
- Ask the user: what feature(s) to add? (name + description) and which section (In Progress / Planned / Backlog / Recently Shipped)?
- Accept multiple features in one session

### Both modes:
1. Read `ROADMAP.md` at repo root
2. Insert each new entry into the correct section table (append as a new row)
3. Entry format: `| STATUS_ICON | feature-name | description |`
   - 🔲 for Planned / Backlog
   - ▶️ for In Progress
   - ✅ for Recently Shipped
4. After all entries are staged, show the user a preview of the changes
5. Ask for confirmation before committing
6. On confirmation: `git add ROADMAP.md && git commit -m "roadmap: add [feature-name]"` (or a summary commit message if multiple features)
7. Report success with the commit hash

---

## Patterns
```
✅ GOOD — agent-ignore header if producing diagnostic output (use > ℹ️ prefix)
✅ GOOD — confirm before committing (show diff/preview first)
✅ GOOD — handle multiple features gracefully in one pass
❌ BAD  — hard-coding section names without matching ROADMAP.md headers exactly
❌ BAD  — committing without user confirmation
❌ BAD  — interactive mode that asks one-question-at-a-time for single features when the user clearly listed multiple
```

---

## Constraints
- File path: `.opencode/commands/roadmap-add.md` (project-local — NOT `opencode/commands/`)
- `agent: headwrench` in frontmatter
- Match entry format exactly: `| STATUS_ICON | feature-name | description |` (table rows)
- Section headers must match ROADMAP.md exactly: **In Progress**, **Planned**, **Backlog**, **Recently Shipped**
- Commit message format: `roadmap: add <feature-name>` (or `roadmap: add N features` for bulk)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
