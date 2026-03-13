# Subtask 03 — Update headwrench.md + checkpoint.md + agent-delegation-expert.md

## Delegation
- **Agent:** DocWriter
- **Model tier:** Standard (github-copilot/claude-sonnet-4.6)
- **Reason:** Multiple files requiring cross-cutting consistency; changes must be coherent across all three.

---

## Objective
Update three agent/protocol files to reflect the isolated subtask-file format and session summary todo:
1. `opencode/agents/headwrench.md` — add session summary todo ownership + update "During Sessions" to load subtask files individually
2. `opencode/protocols/checkpoint.md` — add step to update the session summary todo
3. `opencode/agents/subagents/agent-delegation-expert.md` — clarify that delegation recommendations go into subtask-NN files, not spec.json

---

## Todolist

### 1. Read all three files
- [ ] Read `opencode/agents/headwrench.md`
- [ ] Read `opencode/protocols/checkpoint.md`
- [ ] Read `opencode/agents/subagents/agent-delegation-expert.md`

### 2. Update headwrench.md
- [ ] **During Sessions section**: update to say HW loads only the current subtask's `subtask-NN-{name}.md` file and passes it to the assigned subagent — not the full index.md
- [ ] **Add Session Summary Todo section**: HW creates a single todo item at session bootstrap containing session name, goal, `.opencode/sessions/{name}/index.md` path, and current subtask number + description. HW updates it at every checkpoint. This is for HW orientation only — subagents are given isolated, fully-specified single-task prompts and have no awareness of session context.

### 3. Update checkpoint.md
- [ ] Add a step to the checkpoint procedure (after "Update spec.json", before "Write Session Notes"): **Update session summary todo** — update the running todo item to reflect the new current subtask number and description

### 4. Update agent-delegation-expert.md
- [ ] Update the Output section and/or job description to clarify: ADE returns routing recommendations to HW; HW then writes those into the `## Delegation` section of each `subtask-NN-{name}.md` file — NOT into spec.json
- [ ] If there is any language suggesting agent/model go into spec.json, remove it

### 5. Verify coherence
- [ ] Re-read all three files
- [ ] Confirm headwrench.md "During Sessions" accurately describes loading one subtask file at a time
- [ ] Confirm checkpoint.md has the session summary todo update step in the right place
- [ ] Confirm ADE output description matches where delegation actually lives (subtask files)

---

## Scope
- **Write:** `opencode/agents/headwrench.md`
- **Write:** `opencode/protocols/checkpoint.md`
- **Write:** `opencode/agents/subagents/agent-delegation-expert.md`
- **Excluded:** All other files

---

## Patterns
```
✅ GOOD — "During Sessions: HW reads subtask-NN-{name}.md for the current subtask and passes it to the assigned subagent"
❌ BAD  — "During Sessions: HW loads index.md and runs subtasks"

✅ GOOD — checkpoint step: "Update session summary todo — update todo item with new current subtask"
❌ BAD  — no mention of session summary todo in checkpoint

✅ GOOD — ADE: "HW incorporates recommendations into the ## Delegation section of each subtask file"
❌ BAD  — ADE: "recommendations go into spec.json"
```

---

## Constraints
- Do not change any file outside the three listed above
- Session summary todo section in headwrench.md must make clear it is for HW orientation only — subagents are isolated and unaware of it
- The checkpoint step for updating the summary todo must come AFTER updating spec.json and BEFORE writing session notes

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
