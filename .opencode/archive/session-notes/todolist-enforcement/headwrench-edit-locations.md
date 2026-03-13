# headwrench.md — Edit Locations for Todolist Enforcement

## Source
Subtask 01 — ContextScout analysis

## Findings

### Section: "During Sessions" (lines 41–43)
**Action: REPLACE**
- Current: tells HW to follow the active subtask todolist strictly; load only the current subtask file
- Change: Update to describe the 3-layer behavior — load subtask file, extract its `## Todolist` section to populate Layer 2, clarify that Layer 1 persists, Layers 2+3 are cleared and repopulated at subtask transitions

### Section: "Session Summary Todo" (lines 45–53)
**Action: ADD after line 52**
- Add paragraphs explaining that at session bootstrap (when user says "start"), HW creates all 3 todo layers simultaneously
- Clarify these are created at execution start, NOT during planning

### NEW SECTION — "Three-Layer Todolist Architecture" (insert after line 53)
**Action: ADD**
Define all 3 layers:
- Layer 1 (Top): Session summary todo — persists across all subtasks
- Layer 2 (Middle): Subtask-specific todos from current subtask file's `## Todolist` section — cleared and repopulated at transitions
- Layer 3 (Bottom): 8 fixed checkpoint todos — cleared and repopulated at transitions

List the 8 fixed checkpoint todos explicitly:
1. WIP commit
2. Update index.md
3. Update spec.json
4. Update session summary todo
5. Write session notes
6. Write inbox
7. Gate check
8. Circuit breaker

## plan.md Decision: YES — Changes Needed

### Phase 7 (~line 89)
**Action: MODIFY** — Clarify that the session summary todo (Layer 1) is created here during planning, but subtask-specific todos (Layer 2) and checkpoint todos (Layer 3) are NOT created until execution start.

### After Phase 8 (~line 96)
**Action: ADD** — New "Phase 9 — Execution Bootstrap" section describing what HW does when user says "start":
1. Read `index.md` once for full session context
2. Load first `subtask-NN-{name}.md` file
3. Extract its `## Todolist` section → create Layer 2 todos
4. Create 8 fixed checkpoint todos → Layer 3
5. Begin executing the first subtask
