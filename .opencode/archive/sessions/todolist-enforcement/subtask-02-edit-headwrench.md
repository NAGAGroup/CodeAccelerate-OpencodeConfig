# Subtask 02 — Edit headwrench.md

## Delegation
- **Agent:** CodeWriter
- **Model tier:** standard
- **Reason:** This is a precise prose/instruction editing task requiring careful judgment about where to insert new sections, what to replace, and how to maintain consistency with the existing writing style. Standard tier for quality; CodeWriter for all implementation work.

---

## Objective

Edit `opencode/agents/headwrench.md` to enforce a structured 3-layer todo stack during active sessions. The file is located at `/home/jack/CodeAccelerate-OpencodeConfig/opencode/agents/headwrench.md`.

The changes fall into four areas:

### 1. Session Bootstrap (new behavior)
Add a **"Session Bootstrap"** section (or integrate into "During Sessions") describing what HW does when the user says "start":
- Read `index.md` once to orient (session name, goal, current subtask)
- Read the current subtask file (determined by `spec.json` `currentSubtask`)
- Create the **session summary todo** (already described — reinforce it belongs here)
- Create **subtask todos** from the current subtask file's `## Todolist` section (HW may add additional todos mid-subtask as needed, e.g., for debug loops)
- Create the **8 fixed checkpoint todos** (see below)

### 2. Todolist Structure (new explicit rule)
Add a **"Todolist Structure"** subsection that defines the 3-layer stack that must always be present during an active subtask:

**Layer 1 (top)**: Session summary todo (one item — HW orientation anchor)  
**Layer 2 (middle)**: Subtask-specific todos (from subtask file's `## Todolist`, plus any HW-added items)  
**Layer 3 (bottom)**: Checkpoint todos — fixed 8-step checklist:
1. WIP commit (skip if subtask was read-only)
2. Update `index.md` — mark completed, mark next `in_progress`
3. Update `spec.json` — increment `currentSubtask`, update status
4. Update session summary todo — reflect new current subtask
5. Write session notes — one file per significant finding
6. Write inbox — reusable project-level observations
7. Gate check — if next subtask is a gate, stop and surface to user
8. Circuit breaker — check for N consecutive failures

### 3. Subtask Transition (new behavior)
Add a **"Subtask Transition"** description (in the "During Sessions" section or its own subsection): after the checkpoint completes (all 8 checkpoint todos done), HW:
- Marks all subtask todos and checkpoint todos as completed/clears them
- Reads the **next** subtask file (from `spec.json` `currentSubtask`)
- Creates fresh subtask todos from the next subtask file's `## Todolist`
- Creates a fresh 8-step checkpoint todo checklist
- Updates (does NOT replace) the session summary todo with the new current subtask

### 4. Update "During Sessions" section
The existing "During Sessions" section (line 41–43) says:
> "Follow the active session's subtask todolist strictly. Execute subtasks in order. For each subtask, load **only the current subtask's `subtask-NN-{name}.md` file** and pass it to the assigned subagent — do not load the full `index.md` or all subtask files at once. At the end of each subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`."

Update this to reference the new bootstrap and todolist structure. The "follow the checkpoint protocol" reference should now be clear that checkpoint steps are tracked as explicit todos in the todolist.

---

## Todolist

### 1. Read the file
- [ ] Read `/home/jack/CodeAccelerate-OpencodeConfig/opencode/agents/headwrench.md` in full

### 2. Plan the edits
- [ ] Identify insertion points for: Session Bootstrap, Todolist Structure, Subtask Transition
- [ ] Determine whether to add new sections or expand existing ones
- [ ] Ensure the writing style matches the rest of the file (imperative, terse, instructional)

### 3. Apply edits
- [ ] Update the "During Sessions" section to reference the bootstrap and todolist structure
- [ ] Add or expand section describing session bootstrap behavior
- [ ] Add explicit Todolist Structure definition with 3 layers and 8-step checkpoint checklist
- [ ] Add Subtask Transition behavior description
- [ ] Verify the "Session Summary Todo" section is still accurate and consistent with new additions

### 4. Final check
- [ ] Read the edited file to verify all 4 areas are covered
- [ ] Confirm no existing behavior has been accidentally removed
- [ ] Confirm writing style is consistent throughout

---

## Scope
- **Edit:** `opencode/agents/headwrench.md`
- **Read:** `opencode/agents/headwrench.md` (before editing)
- **Write:** Nothing new
- **Excluded:** All other files — especially `protocols/checkpoint.md`, `protocols/session-plan-schema.md`, `commands/plan.md`

---

## Patterns
```
✅ GOOD — Imperative, terse instructions ("At session bootstrap, read index.md once...")
✅ GOOD — Numbered lists for the 8 checkpoint todos
✅ GOOD — Preserving all existing sections and content
❌ BAD  — Verbose or narrative prose
❌ BAD  — Editing plan.md or any protocol files
❌ BAD  — Removing or weakening any existing behavior
❌ BAD  — Creating new files
```

---

## Constraints
- Do NOT edit `plan.md`, `checkpoint.md`, `session-plan-schema.md`, or any other file
- Do NOT change the spec.json format or checkpoint.md content
- The 8 checkpoint todos must be listed in headwrench.md exactly as they appear in `checkpoint.md` (steps 1–8), not paraphrased differently
- Writing style must match the existing file: short imperative sentences, bullet points, markdown headers

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
