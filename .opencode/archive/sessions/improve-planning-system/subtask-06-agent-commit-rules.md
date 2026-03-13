# Subtask 05 — Agent Commit Rules

## Delegation
**Agent:** @CodeWriter
**Model:** fast (claude-haiku) — clear spec, touches 4 files but with simple, well-defined changes to each

---

## Objective

Update the system so agents (CodeWriter, DocWriter) are expected to commit their own work at the end of their task, including session directory files. Currently the checkpoint protocol implies HW does all commits. This subtask: (1) updates `checkpoint.md` to clarify the new ownership model, (2) adds commit instructions to `code-writer.md` and `doc-writer.md`, and (3) updates `headwrench.md` to reflect that HW only does WIP commits for read-only subtasks and the final session-close commit.

---

## Todolist

### 1. Read current state
- [ ] Read `~/.config/opencode/protocols/checkpoint.md` — WIP commit step (step 1) and session close
- [ ] Read `~/.config/opencode/agents/headwrench.md` — build & test section and checkpoint section
- [ ] Read `~/.config/opencode/agents/subagents/code-writer.md`
- [ ] Read `~/.config/opencode/agents/subagents/doc-writer.md`

### 2. Update checkpoint.md
- [ ] In step 1 (WIP Commit), update the rule to reflect agent-owned commits:
  - If the subtask was implementation (CodeWriter/DocWriter): the agent has already committed at task completion. HW's step 1 is to verify the commit exists (`git log -1`) and skip if confirmed.
  - If the subtask was read-only (ContextScout, analysis): skip as before.
  - If the subtask was HeadWrench-direct work: HW commits as before.
- [ ] Add a note: the commit must include any session directory files that were updated as part of the task

### 3. Update code-writer.md
- [ ] Add to the agent's instructions: at the end of each task, stage and commit all changes including any session files passed as context, using message: `git add -A && git commit -m "feat/fix/docs: <short description of what was done>"`
- [ ] Add rule: include `.opencode/sessions/` files in the commit if they were part of the task scope

### 4. Update doc-writer.md
- [ ] Same commit instruction as code-writer.md (adapted for documentation work)
- [ ] Commit message format: `docs: <short description>`

### 5. Update headwrench.md
- [ ] Update the commit ownership section (or build-test section) to state: agents own their commits; HW's commit responsibility is limited to (a) read-only subtask checkpoint commits, (b) session directory metadata updates not covered by agent commits, and (c) the final session-close commit
- [ ] Add: HW verifies agent commit at checkpoint step 1 rather than redoing the commit

### 6. Commit all changes
- [ ] Stage and commit: `git add -A && git commit -m "feat: agents commit own work + session dir — update checkpoint, code-writer, doc-writer, headwrench"`

---

## Scope
- **Edit:** `~/.config/opencode/protocols/checkpoint.md` (step 1 WIP commit rule)
- **Edit:** `~/.config/opencode/agents/subagents/code-writer.md` (add commit instruction)
- **Edit:** `~/.config/opencode/agents/subagents/doc-writer.md` (add commit instruction)
- **Edit:** `~/.config/opencode/agents/headwrench.md` (update commit ownership)
- **Read:** same four files above
- **Write:** nothing new
- **Excluded:** All other files. Do not touch plan.md, amend.md, or schema.

---

## Patterns

```
✅ GOOD — Commit instruction is in the agent's own file, not just in checkpoint.md
✅ GOOD — HW verifies the commit exists rather than re-committing (avoids duplicate commits)
✅ GOOD — Session directory files are explicitly included in agent commits
❌ BAD  — Only updating checkpoint.md without telling the agent to commit (agent won't know)
❌ BAD  — Duplicate commits (agent commits + HW commits same changes again)
❌ BAD  — Leaving the final session-close commit as agent-owned (HW always owns the final commit)
```

---

## Constraints
- The agent commit instructions must use `git add -A` to capture all changes including session files.
- Do not change the final session-close commit ownership — that remains HW's responsibility.
- The `checkpoint.md` step 1 update must not remove the read-only skip rule — keep it.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
