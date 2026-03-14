# Subtask 07 — Final Validation

## Delegation
- **Agent:** HeadWrench direct
- **Model tier:** standard
- **Reason:** Manual review and logical consistency check — HeadWrench reads and validates all produced artifacts directly, no subagent needed.

---

## Objective

Manually review all artifacts produced by this session for logical consistency. Walk through a simulated context-loading scenario to verify the new system would deliver clean, relevant context to an agent. Confirm all done criteria from `index.md` are met.

---

## Todolist

### 1. Review protocol artifacts
- [ ] Read `opencode/protocols/context-management.md` — check: are all tiers defined? are staleness rules unambiguous? are conflict resolution rules deterministic?
- [ ] Read updated `opencode/protocols/checkpoint.md` — check: do steps 5 and 6 reflect the new metadata format? are note lifecycle rules present?
- [ ] Check for any inconsistencies between the two protocol files

### 2. Review slash command artifacts
- [ ] Read each new slash command file in `opencode/commands/`
- [ ] Check: does each command reference the correct protocol? Are steps concrete? Is user burden minimal?

### 3. Simulate context-loading scenario
- [ ] Mentally walk through: "a new session starts, ContextScout runs for planning — what does it see?"
- [ ] Confirm: completed session notes are archived, not surfaced
- [ ] Confirm: inbox items are deduplicated and have metadata headers
- [ ] Confirm: no competing instructions reach ContextScout

### 4. Verify done criteria
- [ ] Check each item in `index.md` Done Criteria — confirm all are met
- [ ] Mark any that are not fully met and decide whether to address or note as follow-up

### 5. Write closing session note
- [ ] Write `.opencode/sessions/improved-context-management/notes/session-close.md` summarizing: what was built, key decisions made, any open questions for future sessions

### 6. Final commit and session close
- [ ] Update `index.md` session status to `completed`
- [ ] `git commit -m "feat: complete session — improved-context-management"`

---

## Scope
- **Edit:** `.opencode/sessions/improved-context-management/index.md` (status update)
- **Read:** `opencode/protocols/context-management.md`, `opencode/protocols/checkpoint.md`, `opencode/commands/` (all new command files), `.opencode/inbox/` (spot-check), `.opencode/archive/` (spot-check)
- **Write:** `.opencode/sessions/improved-context-management/notes/session-close.md`
- **Excluded:** No new protocol or command changes in this subtask — validation only

---

## Patterns
```
✅ GOOD — Simulate a real scenario ("what would ContextScout see?") to test the system end-to-end
❌ BAD  — Just check that files exist without testing whether the rules they encode are coherent
```

---

## Constraints
- If a logical inconsistency is found between protocol files, fix it directly (HW-direct edit) rather than delegating back to DocWriter
- If a done criterion is not fully met, note it explicitly rather than silently marking it done
- The session close note must be substantive — it is the primary artifact for future sessions to understand what changed

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
