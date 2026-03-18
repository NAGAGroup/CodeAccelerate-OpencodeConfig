# Subtask 05 — Rewrite Plan-Phase Protocols

## Delegation
**Agent:** @session-local-implementer  
**Model tier:** standard (`github-copilot/claude-sonnet-4.6`)  
**Reason:** 6 protocol files with moderate fixes needed — slash command references to remove, second-person voice to establish. Within implementer scope.

---

## Objective

Rewrite 6 plan-phase protocol files to address HeadWrench in second person ("you") and remove all slash command references. Protocols are read by HeadWrench during planning — they should say "you dispatch @ContextScout", not "HW dispatches @ContextScout" and not "when /plan is invoked". Preserve all operational content exactly; only fix audience framing and remove slash command references.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent (`@session-local-implementer`) as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Scope

- **Edit:**
  - `opencode/protocols/plan-init.md`
  - `opencode/protocols/plan-shared.md`
  - `opencode/protocols/plan-generic.md`
  - `opencode/protocols/plan-debug.md`
  - `opencode/protocols/plan-collaborative.md`
  - `opencode/protocols/plan-end.md`
- **Read:** All 6 files above before editing
- **Write:** None
- **Excluded:** Core protocols (checkpoint.md, context-management.md, session-plan-schema.md, plan-deep-research.md protocol) — those are subtask 06

---

## Patterns

```
✅ GOOD — "Phase 1 runs at the start of every planning session."
❌ BAD  — "Phase 1 runs at the start of every /plan invocation." (slash command reference)

✅ GOOD — "You run a quick glob/grep to get project layout..."
❌ BAD  — "HW runs a quick glob/grep to get project layout..." (third person when second person applies)

✅ GOOD — "You dispatch multiple ContextScouts in parallel — one per major concern."
❌ BAD  — "Dispatch multiple ContextScouts in parallel..." (imperative without subject — already fine, keep as-is)

✅ GOOD — "After you approve, proceed to type-specific subtask decomposition."
❌ BAD  — No change needed if phrasing is already natural imperative (don't add "you" where the imperative is already clear)

✅ GOOD — "Skip Step 5 for Deep Research session type." (already in plan-shared.md — preserve exactly)
❌ BAD  — Rewording operational rules because the voice changed

✅ GOOD — Preserving pause marker syntax [⏸ PAUSE], gate syntax [🚫 GATE], and all example markdown in plan-collaborative.md exactly
❌ BAD  — "Improving" example formatting in ways that change what the example shows
```

---

## Constraints

- Use second person "you" for HeadWrench — but do NOT add "you" to every sentence mechanically; natural imperative ("Dispatch scouts", "Read the file") is fine and should be preserved as-is
- Replace "HW" with "you" only when "HW" is being used as the subject of an action in a context where second-person address is appropriate (i.e., the protocol is telling you what to do)
- Do NOT replace "HW" with "you" in contexts like "This todo is for HeadWrench's awareness only" (third person is correct there — it's describing HW's role to an external reader)
- Replace all "/plan invocation", "/plan workflow", "/plan command" with "planning session" or "this planning workflow"
- Keep references like "Step 5 in plan-shared.md" or "see plan-generic.md" — these are protocol cross-references, not slash command references
- Preserve ALL example todolists, markdown templates, and table structures in plan-collaborative.md exactly — these are canonical syntax examples
- plan-debug.md is a stub — apply only minimal fixes to the abbreviated flow; do not expand it

---

## Todolist

### 1. Read all 6 protocol files
- [ ] Read `opencode/protocols/plan-init.md`
- [ ] Read `opencode/protocols/plan-shared.md`
- [ ] Read `opencode/protocols/plan-generic.md`
- [ ] Read `opencode/protocols/plan-debug.md`
- [ ] Read `opencode/protocols/plan-collaborative.md`
- [ ] Read `opencode/protocols/plan-end.md`

### 2. Apply fixes to each file
- [ ] Edit `plan-init.md` — fix "/plan invocation" references; convert "HW runs/dispatches" to "you run/dispatch" where appropriate
- [ ] Edit `plan-shared.md` — fix "/plan" references; convert applicable "HW" to "you"; preserve "Skip this step for Deep Research" and all operational rules verbatim
- [ ] Edit `plan-generic.md` — fix any slash command references; verify second-person consistency; preserve all sizing guidelines and gate placement rules
- [ ] Edit `plan-debug.md` — minimal fixes only (it's a stub); fix any "/plan" references
- [ ] Edit `plan-collaborative.md` — fix any "/plan" references; preserve ALL pause marker examples and table formatting exactly
- [ ] Edit `plan-end.md` — fix slash command references; convert "HW" to "you" where applicable; preserve PLACEHOLDER_MODEL_ID messaging exactly

### 3. Verify
- [ ] Confirm no "/plan invocation", "/plan command", or "/plan workflow" strings remain
- [ ] Confirm all example todolists and markdown templates are byte-for-byte identical to the originals
- [ ] Confirm all operational steps, sizing rules, and gate placement rules are intact

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
