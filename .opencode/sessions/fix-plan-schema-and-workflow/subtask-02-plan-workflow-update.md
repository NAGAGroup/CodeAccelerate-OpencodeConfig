# Subtask 02 — Update plan-workflow.md + plan.md

## Delegation
- **Agent:** DocWriter
- **Model tier:** Standard (github-copilot/claude-sonnet-4.6)
- **Reason:** Adding a new phase across two interdependent files; needs coherence and consistency between them.

---

## Objective
Update `opencode/protocols/plan-workflow.md` and `opencode/commands/plan.md` to:
1. Add a **Checkpoint Protocol Approval** step between Q&A and plan drafting
2. Instruct HeadWrench to create individual `subtask-NN-{name}.md` files as part of plan drafting
3. Instruct HeadWrench to create the session summary todo during plan finalization

---

## Todolist

### 1. Read current files
- [ ] Read `opencode/protocols/plan-workflow.md`
- [ ] Read `opencode/commands/plan.md`

### 2. Update plan-workflow.md
- [ ] Add a new step **between Step 2 (Q&A) and Step 3 (Plan Drafting)**: "Step 2.5 — Checkpoint Protocol Approval"
  - HW presents the default checkpoint protocol (`~/.config/opencode/protocols/checkpoint.md`) to the user
  - User may approve as-is or request changes
  - If changes requested: HW writes a session-specific `protocols/checkpoint.md` inside the session directory during Step 7 (Finalization)
  - If no changes: no session-local file is written; subtask footers reference the global protocol
- [ ] Update Step 3 (Plan Drafting) to include: HW writes one `subtask-NN-{name}.md` file per subtask in addition to `index.md` and `spec.json`
- [ ] Update Step 7 (Finalization) to include: (a) write session-local `protocols/checkpoint.md` if user requested changes, (b) create the session summary todo item
- [ ] Update the Invariants section to note: plan drafting produces subtask files; checkpoint approval is mandatory; session summary todo is created at finalization

### 3. Update plan.md
- [ ] Add **Phase 2.5 — Checkpoint Protocol Approval** between Phase 2 (Q&A) and Phase 3 (Research):
  - Show the user the contents of `~/.config/opencode/protocols/checkpoint.md`
  - Ask: "Does this checkpoint procedure work for this session, or would you like to customize it?"
  - Record any requested changes — they will be written as a session-local override in Phase 7
- [ ] Update **Phase 4 — Draft Session Plan** to include: after writing `index.md` and `spec.json`, write one `subtask-NN-{name}.md` file per subtask using the format defined in `~/.config/opencode/protocols/session-plan-schema.md`
- [ ] Update **Phase 7 — Finalize** to include: (a) if checkpoint changes were requested, write `.opencode/sessions/{name}/protocols/checkpoint.md`, (b) create the session summary todo item with: session name, goal, index.md path, first subtask number and description

### 4. Verify coherence
- [ ] Re-read both files end-to-end
- [ ] Confirm plan-workflow.md and plan.md describe the same steps in the same order
- [ ] Confirm the checkpoint approval flow is unambiguous in both

---

## Scope
- **Write:** `opencode/protocols/plan-workflow.md`
- **Write:** `opencode/commands/plan.md`
- **Read:** `opencode/protocols/session-plan-schema.md` (for reference on subtask file format)
- **Excluded:** All other files

---

## Patterns
```
✅ GOOD — Checkpoint approval is its own named phase/step before plan drafting
❌ BAD  — Checkpoint approval buried as a bullet inside another phase

✅ GOOD — Phase 4 explicitly says "write one subtask-NN-{name}.md per subtask"
❌ BAD  — Phase 4 only mentions index.md and spec.json

✅ GOOD — Session summary todo created in Phase 7 (Finalization), after approval
❌ BAD  — Session summary todo created during drafting before user approves
```

---

## Constraints
- Only edit `plan-workflow.md` and `plan.md`
- The checkpoint approval step must come BEFORE plan drafting — users can't change the protocol after subtask files have already been written with footers
- The session-local checkpoint file is written during Finalization (Phase 7 / Step 7), not during drafting

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
