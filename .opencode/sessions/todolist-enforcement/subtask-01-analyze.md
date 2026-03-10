# Subtask 01 — Analyze Current Files

## Delegation
- **Agent:** ContextScout
- **Model tier:** fast
- **Reason:** Read-only analysis of two small markdown files; no code writing needed. ContextScout is designed for situational awareness and file inspection.

---

## Objective

Read `opencode/agents/headwrench.md` and `opencode/commands/plan.md` in full. For each file, identify the exact sections and line ranges that need to be added or modified to implement the following todolist enforcement behavior:

1. **Session Bootstrap**: When execution begins (user says "start"), HW should read `index.md` once, then create three sets of todos: (a) the session summary todo, (b) subtask-specific todos from the first subtask file's `## Todolist` section, (c) a fixed 8-step checkpoint checklist.

2. **Todolist Structure**: The todo stack during any active subtask has exactly three layers — session summary at top, subtask todos in middle, checkpoint todos at bottom.

3. **Subtask Transition**: After completing checkpoint steps, HW clears completed subtask todos and checkpoint todos, reads the next subtask file, and creates a fresh set of subtask todos + checkpoint todos.

4. **8 Fixed Checkpoint Todos**: WIP commit, update index.md, update spec.json, update session summary todo, write session notes, write inbox, gate check, circuit breaker.

5. **plan.md scope**: Determine whether `plan.md` needs any changes to reflect the above. The session summary todo creation already appears in Phase 7 of plan.md — does the new bootstrap behavior (subtask todos + checkpoint todos created at execution start, not planning time) require any update to plan.md?

Return:
- For headwrench.md: exact section names / line ranges that need editing, and a description of what needs to change at each location
- For plan.md: a clear yes/no on whether changes are needed, and if yes, exactly which lines/sections

---

## Todolist

### 1. Read headwrench.md
- [ ] Read `/home/jack/CodeAccelerate-OpencodeConfig/opencode/agents/headwrench.md` in full
- [ ] Identify the "During Sessions" section and note its exact content and lines
- [ ] Identify the "Session Summary Todo" section and note its exact content and lines
- [ ] Note any other sections relevant to session execution and todolist management
- [ ] For each relevant section: describe what is currently there and what needs to be added/changed

### 2. Read plan.md
- [ ] Read `/home/jack/CodeAccelerate-OpencodeConfig/opencode/commands/plan.md` in full
- [ ] Identify Phase 7 (Finalization) and its current session summary todo creation step
- [ ] Determine: does plan.md need changes? (The new subtask + checkpoint todos are created at execution start, not planning time — so plan.md likely doesn't change)
- [ ] If changes needed: specify exact lines and what to change

### 3. Return findings
- [ ] Return structured findings: headwrench.md section analysis + plan.md decision

---

## Scope
- **Read:** `opencode/agents/headwrench.md`, `opencode/commands/plan.md`
- **Edit:** Nothing — read-only analysis
- **Write:** Nothing
- **Excluded:** All other files

---

## Patterns
```
✅ GOOD — Return line numbers and exact section names
✅ GOOD — For headwrench.md, describe what to ADD vs what to REPLACE
❌ BAD  — Make any file changes
❌ BAD  — Read files other than the two specified
```

---

## Constraints
- Read-only — no file modifications
- Focus exclusively on todolist enforcement requirements
- Be specific about line numbers and section names

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
