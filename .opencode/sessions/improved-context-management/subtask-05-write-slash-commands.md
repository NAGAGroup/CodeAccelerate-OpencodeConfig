# Subtask 05 — Write Slash Commands for Context Management

## Delegation
- **Agent:** @CodeWriter
- **Model tier:** standard
- **Reason:** Writing new slash command files — these are Markdown-based command definitions that may include logic/instructions. CodeWriter handles this implementation work.

---

## Objective

Write the new context management slash commands in `opencode/commands/`, implementing the command specifications approved at gate G1 and formalized in the context-management protocol (subtask 03). Each command must trigger an automatic protocol-driven workflow with minimal user cognitive load — user triggers the command, sees a report, approves, and permanent changes are made.

---

## Todolist

### 1. Read inputs
- [ ] Read `opencode/protocols/context-management.md` (authoritative spec for what commands must do)
- [ ] Read all existing files in `opencode/commands/` to understand the format, style, and conventions used
- [ ] Read `notes/architecture-design.md` for the command UX specifications

### 2. Write `/context-audit` command
- [ ] Write `opencode/commands/context-audit.md`
- [ ] Implement: trigger → ContextScout analysis → health report → user approval → execute cleanup
- [ ] Follow the UX spec from the architecture design: minimal user burden, Q&A gated, permanent file changes

### 3. Write any additional commands specified in the design
- [ ] Check `notes/architecture-design.md` for additional commands beyond `/context-audit`
- [ ] Write each additional command file following the same format

### 4. Commit
- [ ] Stage and commit: `feat: add context management slash commands`

---

## Scope
- **Edit:** Nothing
- **Read:** `opencode/protocols/context-management.md`, `opencode/commands/` (all existing files), `.opencode/sessions/improved-context-management/notes/architecture-design.md`
- **Write:** `opencode/commands/context-audit.md`, and any other commands specified in the architecture design
- **Excluded:** `opencode/protocols/` (read-only here), `.opencode/sessions/`, `.opencode/inbox/`

---

## Patterns
```
✅ GOOD — Command specifies exact steps, what agent it delegates to, what output it shows the user, and what files it modifies on approval
❌ BAD  — Command is vague: "analyze context and clean it up" without specifying the steps or what changes
```

---

## Constraints
- Follow the exact command format used by existing commands in `opencode/commands/`
- Each command must be self-contained: a user or agent reading only the command file must understand what it does
- Commands must not require the user to think hard or make per-item decisions — the protocol runs automatically, user approves at the end
- Commands must reference `opencode/protocols/context-management.md` as the authoritative spec they implement

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
