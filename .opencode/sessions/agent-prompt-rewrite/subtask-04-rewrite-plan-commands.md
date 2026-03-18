# Subtask 04 — Rewrite Plan Commands

## Delegation
**Agent:** @session-local-implementer  
**Model tier:** standard (`github-copilot/claude-sonnet-4.6`)  
**Reason:** Significant rewrite needed for plan.md (user-doc framing to agent-directive); the other two files need moderate fixes.

---

## Objective

Rewrite 3 plan-related command files to remove all user-doc framing and slash command references. `plan.md` is the most critical — it currently opens with "## How to Run /plan" and treats the agent as a user reading documentation. This subtask converts it to pure agent-directive: the agent is told what to do, not how to operate a tool. `plan-deep-research.md` uses a "MANDATORY EXECUTION PROTOCOL" redirect approach that is acceptable but references `plan.md` framing issues. `quick-plan.md` is mostly clean but needs minor fixes. Preserve all operational logic and phase routing exactly.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent (`@session-local-implementer`) as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Scope

- **Edit:**
  - `opencode/commands/plan.md`
  - `opencode/commands/plan-deep-research.md`
  - `opencode/commands/quick-plan.md`
- **Read:** All 3 files above before editing
- **Write:** None
- **Excluded:** Protocol files (plan-init.md, plan-shared.md, etc. are handled in subtasks 05–06), agent files, skill files

---

## Patterns

```
✅ GOOD — plan.md opens: "You are starting a planning session. Work through these phases in order:"
❌ BAD  — plan.md opens: "## How to Run /plan" (user-doc heading treating agent as a user)

✅ GOOD — "Phase 1 — Orientation: read `opencode/protocols/plan-init.md` and follow the steps there."
❌ BAD  — "### Phase 1 — Orientation: See `~/.config/opencode/protocols/plan-init.md`" (pointer with no imperative)

✅ GOOD — plan-deep-research.md: "You are running a planning session with Deep Research pre-selected." 
❌ BAD  — plan-deep-research.md: "You are executing /plan with exactly two overrides applied." (slash command reference)

✅ GOOD — quick-plan.md preserves all 3 steps (Orient, Q&A, Confirm and Execute) verbatim
❌ BAD  — Restructuring or removing the parallel ContextScout dispatch or ContextInsurgent synthesis steps

✅ GOOD — Preserving all 4 phase-routing entries in plan.md exactly (Generic, Debug, Collaborative, Deep Research)
❌ BAD  — Removing or changing the protocol file paths in the phase routing
```

---

## Constraints

- `plan.md` must become a direct instruction to the agent — "You are starting a planning session. Work through these phases:" — not documentation about the slash command
- The 4 protocol file paths in `plan.md`'s phase routing must be preserved exactly as written
- The Invariants section in `plan.md` must be preserved exactly
- `plan-deep-research.md` redirect approach (read plan.md, apply overrides) is architecturally sound — keep the redirect; only fix the slash command references and user-doc framing
- `quick-plan.md` is mostly clean — apply only what's actually needed; avoid over-editing
- Do not reference slash command names like "/plan", "/plan-deep-research" in the body text of these files (the frontmatter `description:` field may keep them for tooling metadata)
- `$ARGUMENTS` interpolation must be preserved exactly in all 3 files

---

## Todolist

### 1. Read all 3 plan command files
- [ ] Read `opencode/commands/plan.md`
- [ ] Read `opencode/commands/plan-deep-research.md`
- [ ] Read `opencode/commands/quick-plan.md`

### 2. Rewrite plan.md
- [ ] Replace "## How to Run /plan" heading and user-doc framing with direct agent instruction ("You are starting a planning session...")
- [ ] Convert phase descriptions from pointer-only ("See protocol-file.md") to imperative ("Read `protocol-file.md` and follow the steps there")
- [ ] Preserve all 4 phase routes and Invariants section exactly

### 3. Rewrite plan-deep-research.md
- [ ] Replace "You are executing /plan" with "You are running a planning session (Deep Research type pre-selected)"
- [ ] Fix any other slash command references in the body
- [ ] Preserve the redirect approach (read plan.md then apply overrides) and the two override rules exactly

### 4. Rewrite quick-plan.md
- [ ] Review for any slash command references or user-doc framing
- [ ] Apply minimal fixes only — this file is mostly clean
- [ ] Preserve all 3 steps and all sub-steps (Orient including parallel scouts, Q&A, Confirm and Execute) exactly

### 5. Verify
- [ ] Confirm all 3 files contain their complete original operational content
- [ ] Confirm no "/plan", "/plan-deep-research" body text references remain (frontmatter `description:` field excepted)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
