# Subtask 04 — Update session-compaction.ts continuation prompt

## Delegation
- **Agent:** CodeWriter
- **Model tier:** Fast (github-copilot/gpt-4o)
- **Reason:** Small, targeted string addition to an existing TypeScript template literal; spec is unambiguous.

---

## Objective
Add a single instruction to the auto-resume continuation prompt in `session-compaction.ts` telling the agent to read the current todolist before writing a new one, since the todolist survives compaction.

---

## Todolist

### 1. Locate the continuation prompt
- [ ] Read `opencode/plugins/session-compaction.ts` around lines 143–154 (the `resumeInstruction` template literal)

### 2. Add the todolist instruction
- [ ] Append the following sentence to the end of the main resume instruction (before the subtask content block):
  `Before creating any new todos, first read your current todolist — it survives compaction and contains your session orientation.`

### 3. Verify
- [ ] Re-read the modified section to confirm the sentence is in the right place and the string concatenation is syntactically correct

---

## Scope
- **Edit:** `opencode/plugins/session-compaction.ts`
- **Excluded:** All other files

---

## Constraints
- One sentence only — do not restructure or expand the prompt further
- Must be appended to the existing resume instruction text, not inserted in the middle

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
