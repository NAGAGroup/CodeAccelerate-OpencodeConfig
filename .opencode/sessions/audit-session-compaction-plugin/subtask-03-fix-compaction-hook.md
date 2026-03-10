# Subtask 03 — Verify & Fix the Compaction Hook Implementation

## Delegation
- **Agent:** CodeWriter
- **Model tier:** Standard (gpt-5.3-codex)
- **Reason:** The hook itself is structurally simple — read files, build strings, push to array. Any issues are likely in content formatting or hook signature. No design work needed.

---

## Objective
Ensure the `experimental.session.compacting` hook correctly and reliably injects the active session's context into the compaction prompt. This covers: hook signature correctness, `output.context` format, content quality (what gets injected and how), and error safety.

---

## Pre-conditions
- Subtask 02 is complete (path constants are fixed)
- `notes/audit-findings.md` section on the hook has been reviewed

---

## Todolist

### 1. Verify hook signature against type definitions
- [ ] From subtask-01 type def audit: confirm `experimental.session.compacting` receives `(_input, output)` where `output.context` is `string[]`
- [ ] If the type def shows a different signature (e.g. `output` is not an object, or the property is named differently), fix the hook accordingly
- [ ] Check: is `_input` typed? Does it carry `sessionID` or other useful info? If yes, use it instead of guessing.

### 2. Check: what does the compaction model actually receive?
- [ ] `output.context.push(...)` adds our string to the context. Verify the compaction model (`opencode/claude-haiku-4-5` per `opencode.json` line 190) will receive this.
- [ ] The current code pushes ONE big string joining all blocks. This is fine for `string[]`, but consider: should each logical block be a separate push? Check type def for guidance.
- [ ] If `string[]` just concatenates all items, the current single-push approach is equivalent. If items are treated individually (e.g. as separate context messages), splitting may be better.

### 3. Verify content of injected blocks
- [ ] **Block 1 — Active session plan:**
  - Reads `index.md` → wraps in `## Active Session Plan` header ✓
  - Path annotation `Path: .opencode/sessions/${activeSession}/` — this is correct. Verify it was not accidentally changed during earlier edits.
  - Should it also include the current subtask file? Currently only `index.md` is injected. Consider: after compaction, the agent needs to know which subtask to continue. The `index.md` contains the status table — that's sufficient if statuses are kept up to date.
- [ ] **Block 2 — Session notes:**
  - Reads `notes/` dir for `.md` and `.json` files ✓
  - Filters correctly — no issues expected here
- [ ] **Block 3 — Local context:**
  - Reads `contextDir` (now fixed to `opencode/context/` if it exists) ✓
- [ ] **Block 4 — Global context:**
  - Reads `globalContextDir` ✓

### 4. Fix the path annotation in the injected content
- [ ] Line 98: Change `Path: .opencode/sessions/${activeSession}/` to `Path: .opencode/sessions/${activeSession}/`
- [ ] This is the path the agent uses to re-read the session after compaction — it must be correct. Actually, verify if it already uses `.opencode`, in which case leave it alone.

### 5. Add spec.json to injected session content
- [ ] The current hook only reads `index.md` and `notes/`
- [ ] Consider also injecting `spec.json` status so the agent can immediately see `currentSubtask`
- [ ] Add after the index block:
  ```ts
  const specContent = readFileSafe(join(sessionDir, "spec.json"))
  if (specContent) {
    blocks[0] += `\n\n### spec.json\n\`\`\`json\n${specContent}\n\`\`\``
  }
  ```
- [ ] This way the compaction context includes the machine-readable subtask counter

### 6. Add the active subtask file to injected content
- [ ] After compaction, the agent needs the current subtask's todolist to continue
- [ ] Read `spec.json` to get `currentSubtask`, then read `subtask-NN-*.md`:
  ```ts
  try {
    const spec = JSON.parse(specContent)
    const subtaskNum = String(spec.currentSubtask).padStart(2, "0")
    const subtaskFiles = existsSync(sessionDir)
      ? readdirSync(sessionDir).filter(f => f.startsWith(`subtask-${subtaskNum}-`))
      : []
    if (subtaskFiles.length > 0) {
      const subtaskContent = readFileSafe(join(sessionDir, subtaskFiles[0]))
      blocks.push(
        `## Current Subtask (${subtaskFiles[0]})\n${subtaskContent}`
      )
    }
  } catch { /* spec parse failed — skip */ }
  ```
- [ ] This is the highest-value addition: without the current subtask file, the agent post-compaction must re-read it manually

### 7. Error handling review
- [ ] Every file read already goes through `readFileSafe` which returns `""` on error ✓
- [ ] The `existsSync` checks guard directory reads ✓
- [ ] The `if (blocks.length > 0)` guard prevents pushing empty context ✓
- [ ] Double-check: can the hook itself throw? Wrap the entire hook body in a try/catch that logs but doesn't re-throw

### 8. Write notes
- [ ] Write `.opencode/sessions/audit-session-compaction-plugin/notes/compaction-hook.md`
- [ ] Document: what the hook injects, what was changed, and the confirmed `output.context` API

---

## Scope
- **Edit:** `opencode/plugins/session-compaction.ts` — the `experimental.session.compacting` handler (lines 83–136)
- **Read:** `.opencode/sessions/audit-session-compaction-plugin/notes/audit-findings.md`
- **Write:** `.opencode/sessions/audit-session-compaction-plugin/notes/compaction-hook.md`
- **Excluded:** Do not touch `findActiveSession`, path constants (done in subtask-02), or the tool/event handler

---

## Patterns
```ts
✅ GOOD — inject the current subtask file so the agent can continue immediately
blocks.push(`## Current Subtask (${subtaskFile})\n${subtaskContent}`)

❌ BAD — injecting huge amounts of text that will confuse the compaction model
// Don't inject all subtask files — only the current one

✅ GOOD — defensive try/catch around the whole hook
"experimental.session.compacting": async (_input, output) => {
  try {
    // ... all the logic
  } catch (err) {
    // silent — a crashing hook breaks compaction entirely
  }
}

❌ BAD — letting any exception escape the hook
```

---

## Constraints
- Total injected context should be lean — `index.md` + current subtask + notes + context. Do not inject all subtasks.
- Keep `readFileSafe` / `readDirFiles` helpers — do not inline fs calls
- Do not add new npm dependencies

---

*At the end of this subtask, follow the checkpoint protocol: `protocols/checkpoint.md`*
