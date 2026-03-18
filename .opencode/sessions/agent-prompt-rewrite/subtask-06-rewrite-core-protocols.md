# Subtask 06 — Rewrite Core Protocols

## Delegation
**Agent:** @session-local-implementer  
**Model tier:** standard (`github-copilot/claude-sonnet-4.6`)  
**Reason:** 4 large protocol files requiring careful editing — preserving complex operational logic while fixing framing. Implementer has the edit/read permissions needed.

---

## Objective

Rewrite 4 core protocol files — the largest and most complex in the system. Apply the same framing fixes as subtask 05 (second person "you" for HW, no slash command references), plus one additional change specific to `session-plan-schema.md`: add an audience note to the subtask file template clarifying that HeadWrench reads it first, then passes subtask content to the assigned subagent. Preserve all operational content with extreme care — these are high-stakes files.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent (`@session-local-implementer`) as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Scope

- **Edit:**
  - `opencode/protocols/plan-deep-research.md`
  - `opencode/protocols/checkpoint.md`
  - `opencode/protocols/context-management.md`
  - `opencode/protocols/session-plan-schema.md`
- **Read:** All 4 files above before editing
- **Write:** None
- **Excluded:** Everything edited in prior subtasks

---

## Patterns

```
✅ GOOD — "When you begin a Deep Research planning session..." 
❌ BAD  — "When /plan-deep-research is invoked..." (slash command reference)

✅ GOOD — Checkpoint step: "You own ALL commits. Subagents do not commit."
❌ BAD  — "HeadWrench owns ALL commits." in a context where the protocol is addressing HW directly

✅ GOOD — session-plan-schema.md subtask template gets an audience note: 
         "> **Audience:** HeadWrench reads this file first. Only the subtask content is then passed to the assigned subagent."
❌ BAD  — Inserting the audience note inside an existing section where it would disrupt the schema

✅ GOOD — Preserving all JSON schema field definitions, YAML examples, and table structures in session-plan-schema.md exactly
❌ BAD  — Reformatting or "improving" JSON or YAML examples in session-plan-schema.md

✅ GOOD — Preserving all 8 checkpoint steps with their exact case logic (Case 1, 2, 3, 4) verbatim
❌ BAD  — Rewriting checkpoint step descriptions in a way that changes their meaning

✅ GOOD — Preserving all tier table, inbox destination rules, and archival process steps in context-management.md exactly
❌ BAD  — Simplifying the staleness rules or conflict resolution section
```

---

## Constraints

- These are the highest-stakes files — apply maximum caution; preserve operational content with zero ambiguity
- Use second person "you" for HeadWrench-directed content only; context-management.md has sections written for a more general audience (e.g., the overview and example workflows) — these can stay in third person or general tone where appropriate
- Replace all "/plan-deep-research", "/plan invocation", and slash command references in protocol body text
- The audience note in `session-plan-schema.md` must be added to the subtask file template section (the markdown template inside the `## subtask-NN-{name}.md Specification` section), placed immediately after the opening `## Objective` section description, so it's visible to anyone reading a subtask file
- Do NOT alter any JSON schema examples, YAML frontmatter templates, or the 5-tier context table in context-management.md
- Do NOT change the 8-step checkpoint numbering, case labels (Case 1/2/3/4), or any git command strings in checkpoint.md
- The `/context-audit` command reference in context-management.md is acceptable — it's a cross-reference to a command, not a slash command invocation metaphor
- plan-deep-research.md (protocol) is a full file; apply the same fixes as subtask 05 — second person where HW is the subject, no slash command references

---

## Todolist

### 1. Read all 4 core protocol files
- [ ] Read `opencode/protocols/plan-deep-research.md`
- [ ] Read `opencode/protocols/checkpoint.md`
- [ ] Read `opencode/protocols/context-management.md`
- [ ] Read `opencode/protocols/session-plan-schema.md`

### 2. Rewrite core protocol files
- [ ] Edit `plan-deep-research.md` — fix slash command references; apply second-person framing; preserve all research Q&A, subtask decomposition, sizing rules, and execution behavior sections exactly
- [ ] Edit `checkpoint.md` — convert "HeadWrench owns" to "you own" where HW is being addressed; preserve all 8 steps, all case labels, all git command strings, and the Session Close procedure exactly
- [ ] Edit `context-management.md` — fix any slash command references; apply second-person where HW is the subject; preserve all tier tables, inbox destination rules, metadata headers, staleness rules, conflict resolution, archival process, and example workflows exactly
- [ ] Edit `session-plan-schema.md` — fix any slash command references; add audience note to subtask file template; preserve all JSON schema definitions, YAML examples, delegation sizing guidelines, and invariants exactly

### 3. Verify
- [ ] Confirm no slash command name references remain in body text
- [ ] Confirm all JSON schema, YAML, and table structures are intact
- [ ] Confirm all 8 checkpoint steps with case logic are intact
- [ ] Confirm audience note added to subtask template in session-plan-schema.md

### 4. [🚫 GATE] — User reviews full diff before final commit
- [ ] [🚫 GATE] All 30 files (minus session-status.md) have been rewritten. Present a summary of all changes made across all 6 subtasks. Wait for user approval before the final session commit is made.

---

*At the end of this subtask (after gate clears), make the final session commit: `git commit -m "feat: complete session — agent-prompt-rewrite"` rather than a WIP commit. Follow the Session Close procedure in `~/.config/opencode/protocols/checkpoint.md`.*
