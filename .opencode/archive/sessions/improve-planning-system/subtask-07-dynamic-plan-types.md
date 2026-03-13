# Subtask 06 — Dynamic Plan Types

## Delegation
**Agent:** @CodeWriter
**Model:** standard (claude-sonnet) — behavioral change to the primary planning workflow; requires judgment about how to structure conditional branches cleanly

---

## Objective

Add session type detection to `plan.md` so that HeadWrench asks "What kind of session is this?" at the start of Phase 2 and branches the Q&A accordingly. Session types: **Generic** (feature work, refactors, new systems — current default behavior), **Debug** (investigating bugs/failures), and **Collaborative** (user wants to work alongside HW, not just direct it). Also update `plan-workflow.md` to document this new step (Step 1.5) and the conditional branching design. While touching `plan.md`, fix the Phase 4a/4b ordering issue (plan must be drafted before routing is applied).

---

## Todolist

### 1. Read current state
- [ ] Read `~/.config/opencode/commands/plan.md` in full
- [ ] Read `~/.config/opencode/protocols/plan-workflow.md` in full

### 2. Add session type detection to plan.md
- [ ] After Phase 1 (Situational Awareness) and before Phase 2 (Q&A), add a new step: **Phase 1.5 — Session Type Detection**
  - HW asks one question: "What kind of session is this?" with three options: Generic / Debug / Collaborative
  - Based on the answer, HW loads the appropriate Q&A branch in Phase 2
- [ ] Add conditional Q&A branches to Phase 2:
  - **Generic:** current Q&A questions (done criteria, scope, reference patterns, uncertainties, build/test, git, circuit breaker, CI, architect opt-in) — no change
  - **Debug:** add to the standard Q&A — symptom description, when it started / last known good state, what's already been tried, suspected components, existing reproduction test?, should HW write a regression test?
  - **Collaborative:** add to the standard Q&A — user's preferred involvement level (approve every subtask? review changes? hands-off?), decisions the user wants to make personally, should HW pause before each subtask to discuss?
- [ ] Fix Phase 4a/4b ordering: rename to clarify that plan drafting (4b) must happen before routing (4a). Consider renaming to "Phase 4 — Draft Plan" and "Phase 4a — Apply Agent Routing" or similar to make the sequence unambiguous.

### 3. Update plan-workflow.md
- [ ] Add "Step 1.5 — Session Type Detection" between Step 1 and Step 2
- [ ] Document the three session types and their Q&A branch descriptions
- [ ] Update Step 2 to reference the conditional branches
- [ ] Fix any Phase 4 ordering references to match the corrected plan.md

### 4. Commit all changes
- [ ] Stage and commit: `git add -A && git commit -m "feat: add session type detection and conditional Q&A branches to /plan"`

---

## Scope
- **Edit:** `~/.config/opencode/commands/plan.md`
- **Edit:** `~/.config/opencode/protocols/plan-workflow.md`
- **Read:** same two files above
- **Write:** nothing new
- **Excluded:** All other files. Do not touch schema, headwrench.md, amend.md, or subagent defs.

---

## Patterns

```
✅ GOOD — Session type is detected with ONE question, not a long branching interrogation
✅ GOOD — Generic type = no behavioral change from today; new types are additive branches
✅ GOOD — Phase 4 ordering clearly shows: draft first → apply routing second
❌ BAD  — Creating three separate plan commands (/plan-debug, /plan-collaborative)
❌ BAD  — Debug and collaborative branches replace the standard Q&A questions (they extend them)
❌ BAD  — Phase 4a before 4b (you can't apply routing before you have subtasks to route)
```

---

## Constraints
- The Generic type must preserve existing behavior exactly — this is a new opt-in feature, not a replacement.
- Debug and Collaborative Q&A branches ADD questions to the base Q&A — they do not replace it.
- The session type must be recorded somewhere accessible to HeadWrench during planning (either in the Q&A context or in `spec.json` — add a `sessionType` field to the spec.json schema if it's useful).
- Keep plan.md readable — don't make it 300 lines. Aim for clear, scannable sections.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
