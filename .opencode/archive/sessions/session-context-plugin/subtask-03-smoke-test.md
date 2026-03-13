# Subtask 03 — Type-Check and Commit

## Delegation
- **Agent:** HeadWrench (direct)
- **Model tier:** —
- **Reason:** Build/test steps are HeadWrench's direct responsibility. No delegation.

---

## Objective

Verify the session-context plugin compiles and the command files match the spec, then commit. HW's job ends here — live testing is done by the user in new opencode sessions. The session remains `in_progress` (not `complete`) until the user explicitly signs off after live testing.

Two verification steps:
1. **TypeScript check** — run `bun run typecheck` (or equivalent) in `opencode/` to confirm `session-context.ts` compiles without errors
2. **Command file review** — read both command files and confirm they match the spec
3. **Commit** — commit all changes to `simple-rewrite` branch

---

## Todolist

### 1. Type-check plugin
- [ ] Run TypeScript type-check in `opencode/` directory to verify `session-context.ts` compiles
- [ ] If type errors: debug and fix (CodeWriter for any changes needed)

### 2. Review command files
- [ ] Read `opencode/commands/activate-session.md` — confirm it follows the spec
- [ ] Read `opencode/commands/deactivate-session.md` — confirm it follows the spec

### 3. Commit
- [ ] Stage all changes: deleted `session-compaction.ts`, new `session-context.ts`, new `activate-session.md`, new `deactivate-session.md`
- [ ] Commit to `simple-rewrite` branch with message: `feat: replace session-compaction plugin with session-context; add activate/deactivate-session commands`

### 4. Surface to user
- [ ] Inform user that implementation is complete and committed
- [ ] Tell user to test in a new opencode session: run `/activate-session` to activate this session plan (`session-context-plugin`), then open another new session and verify the injected block appears in the system prompt
- [ ] Remind user: session will not be marked complete until they sign off

---

## Scope
- **Read:** `opencode/commands/activate-session.md`, `opencode/commands/deactivate-session.md`, `opencode/plugins/session-context.ts`
- **Run:** `bun run typecheck` or `bun tsc --noEmit` in `opencode/`
- **Git:** Stage and commit all session changes
- **Excluded:** No new file writes unless fixing type errors

---

## Patterns
```
✅ GOOD — Run type-check before committing
✅ GOOD — Fix any type errors via CodeWriter before committing
✅ GOOD — Conventional commit message with feat: prefix
✅ GOOD — Session stays in_progress after this subtask (awaiting user sign-off)
❌ BAD  — Committing with type errors present
❌ BAD  — Marking session complete without user sign-off
❌ BAD  — Delegating the commit to any subagent
```

---

## Constraints
- TypeScript must compile cleanly before commit
- Commit message: `feat: replace session-compaction plugin with session-context; add activate/deactivate-session commands`
- Branch: `simple-rewrite`
- **Do NOT mark `spec.json` status as `complete` at checkpoint — leave as `in_progress` pending user sign-off**

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
