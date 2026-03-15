# Subtask 09 — write-plan-protocols

## Objective
Create six new protocol files that decompose the planning workflow: plan-init.md (Phase 1 orientation), plan-shared.md (Q&A + synthesis), plan-end.md (finalization), plan-generic.md (generic session type), plan-debug.md (debug stub), plan-collaborative.md (collaborative stub). Also supersede the old plan-workflow.md by adding a `superseded_by:` header.

## Scope

### Write (new files)
- `opencode/protocols/plan-init.md`
- `opencode/protocols/plan-shared.md`
- `opencode/protocols/plan-end.md`
- `opencode/protocols/plan-generic.md`
- `opencode/protocols/plan-debug.md`
- `opencode/protocols/plan-collaborative.md`

### Edit
- `opencode/protocols/plan-workflow.md` — add superseded_by header only (do not rewrite content)

### Excluded
- No changes to plan.md (that's subtask 10)
- No changes to headwrench.md

## Constraints

### plan-init.md
Phase 1: Orientation
1. HW runs quick glob/grep to get project layout (file tree, key directories)
2. HW dispatches **multiple ContextScouts in parallel** — one per major concern (agents, protocols, commands, session state, etc.)
3. After all ContextScout results return, HW decides: if complex inter-file relationships exist, delegate to **@ContextInsurgent** for synthesis; otherwise synthesize directly from scout reports
4. Session type detection: examine the user's request and existing sessions to determine if this is Generic, Debug, or Collaborative
5. Output: project layout summary, key findings, session type determination

### plan-shared.md
Shared steps used by all session types:
1. **Q&A Template**: HW asks clarifying questions using the `question` tool. Categories: scope/done criteria, constraints/invariants, git workflow, out-of-scope items, circuit breaker
2. **Conditional Q&A**: After base Q&A, ask type-specific questions (Generic: subtask scope; Debug: reproduce criteria; Collaborative: involvement level)
3. **Sequential Thinking synthesis**: After Q&A closes, use Sequential Thinking to reason through scope trade-offs, dependencies, and ambiguities before drafting the plan
4. **Checkpoint protocol approval**: Present the checkpoint protocol to the user; ask if any modifications needed. Default is to use global `~/.config/opencode/protocols/checkpoint.md` as-is.
5. **Research gate**: Ask user if docs/API research is needed before planning. If yes, invoke @DeepResearcher (user must confirm); if no, skip.

### plan-end.md
Finalization steps (shared across all session types):
1. Write session files: `index.md`, `spec.json`, all `subtask-NN-{name}.md` files (including `## Delegation` sections already filled in)
2. Call `activate_session` tool with the session name
3. **Session-local agent creation**: Load the agent-writer skill. For each subtask needing implementation/doc work, check if a session-local agent already exists in `.opencode/agents/`. If not, create it using the skill. Write `PLACEHOLDER_MODEL_ID` as model.
4. Tell user: "Before running 'start', update `PLACEHOLDER_MODEL_ID` in `.opencode/agents/{name}.md` with your preferred model. Restart opencode after updating."
5. Commit plan: `git add .opencode/sessions/{name}/ && git commit -m "plan: add session {name}"`
6. Present final overview: subtask list, delegation assignments, gate locations, session-local agents created

### plan-generic.md
Full Generic session type flow:
1. Reference plan-init.md for Phase 1
2. Reference plan-shared.md for Q&A and synthesis
3. **Subtask decomposition**: Break work into numbered subtasks. Each subtask must have: clear objective, scope (Edit/Write/Delete/Excluded), constraints, todolist, delegation. Group logically — avoid micro-subtasks (fewer than 3 todos) or mega-subtasks (more than 8 todos).
4. **Subtask ordering**: dependencies first; deletions before edits that reference deleted content; protocol/schema fixes before command fixes that reference them; gate before subtask that requires human review
5. **Gate placement**: embed `[🚫 GATE]` todos in the preceding subtask's `## Todolist` when human review is needed before proceeding
6. Apply agent-delegation-expert skill to assign delegation
7. Reference plan-end.md for finalization

### plan-debug.md (stub)
Debug session type — abbreviated stub:
Structure: reproduce → diagnose → gate → fix → regression test
- Phase 1: Reproduce the bug (write reproduction steps as first subtask)
- Phase 2: Diagnose (ContextInsurgent deep analysis)
- Gate: Review diagnosis with user before implementing fix
- Phase 3: Fix (session-local implementer)
- Phase 4: Regression test (HW runs directly)
NOTE: This is a stub. Expand in a future session.

### plan-collaborative.md (stub)
Collaborative session type — abbreviated stub:
- Involvement levels: Review (user reviews each subtask result), Approve (user approves before each subtask starts), Observe (HW runs autonomously, surfaces findings)
- Pause cadence: after each subtask vs. after each gate vs. only on failure
NOTE: This is a stub. Expand in a future session.

### plan-workflow.md supersession
Add to the very top of plan-workflow.md:
```yaml
---
superseded_by: "plan-init.md, plan-shared.md, plan-end.md, plan-generic.md, plan-debug.md, plan-collaborative.md"
superseded_at: "2026-03-14"
active: false
---
```
Do NOT change any other content.

## Todolist
- [ ] Write plan-init.md (Phase 1 orientation with parallel ContextScouts and ContextInsurgent synthesis)
- [ ] Write plan-shared.md (Q&A template, Sequential Thinking synthesis, checkpoint approval, research gate)
- [ ] Write plan-end.md (session file writing, activate_session, session-local agent creation, commit, user instructions)
- [ ] Write plan-generic.md (full generic session type flow)
- [ ] Write plan-debug.md (stub: reproduce/diagnose/gate/fix/regression)
- [ ] Write plan-collaborative.md (stub: involvement levels, pause cadence)
- [ ] Edit plan-workflow.md: add superseded_by header at top

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — creating 6 new protocol files from detailed spec
