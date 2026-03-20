# Subtask 04 — Implement headwrench.md

## Delegation

**Agent:** HeadWrench (direct — no subagent)

---

## Objective

Rewrite `~/.config/opencode/agents/headwrench.md` from scratch. HeadWrench is the primary orchestrator agent — it plans, delegates, and drives sessions to completion. The new version must incorporate all design decisions from `design.md`, including: memory plugin usage enforcement, updated routing table, planning enforcement protocol, session type awareness, and the /plan-collaborative framing.

---

## Todolist

- [ ] Read `.opencode/sessions/config-rewrite/notes/design.md` for all orchestrator behavior decisions
- [ ] Read current `~/.config/opencode/agents/headwrench.md` for structural reference (the role, permission, and general orchestration protocol are keepers — derive everything else from design.md)
- [ ] Write new headwrench.md with updated system prompt covering:
  - Role + communication style (direct, no filler)
  - Memory plugin usage protocol (when to read, when to write, what to store — STRICT)
  - Planning enforcement protocol (how to initiate planning, how to detect missing plan, what to do)
  - Session type taxonomy + which /plan-<type> triggers each
  - /plan-collaborative definition: rough-idea-to-detailed-spec workflow (NOT general collaboration)
  - Updated routing table from design.md
  - Delegation rules + prompting philosophy (what, not how)
  - Session bootstrap + compaction recovery + subtask transition protocols (updated if design.md changes them)
  - 3-layer todo stack
  - Build-test-debug loop
  - Commit ownership
- [ ] Write final file to `~/.config/opencode/agents/headwrench.md`
- [ ] Verify: frontmatter is valid YAML, model field matches design.md tier, no PLACEHOLDER values remain

---

## Scope

- **Write:** `~/.config/opencode/agents/headwrench.md` (full replacement)
- **Read:** current headwrench.md (structural reference), `.opencode/sessions/config-rewrite/notes/design.md` (decisions)
- **Do NOT touch:** any other agent files, any protocol files, any command files

---

## Patterns

- Frontmatter: `model:`, `mode: primary`, `tools:`, `permissions:` — follow existing headwrench.md structure
- Memory plugin usage must be STRICT — enumerate exact trigger conditions for read vs write, not vague guidance
- Routing table entry format: `task_type | complexity | agent | model_tier | rationale`
- /plan-collaborative must have a prominent definition box distinguishing it from general collaboration

---

## Constraints

- HeadWrench does NOT write large code blocks itself — always delegates
- HeadWrench does NOT do deep codebase exploration itself — delegates to ContextScout/ContextInsurgent
- HeadWrench owns all git commits (subagents never commit)
- Memory plugin reads happen at session bootstrap; writes happen at checkpoint
- The model field must match whatever sonnet-tier model was decided in design.md

---

## Success Criteria

- Frontmatter is valid YAML and model field is set (no placeholder)
- Memory plugin usage protocol is enumerated with explicit trigger conditions (not vague)
- /plan-collaborative definition clearly states: rough-idea-to-detailed-spec, not general collaboration
- Routing table matches design.md exactly
- All protocols (bootstrap, recovery, transition, checkpoint) are present and consistent with design.md

---

_Checkpoint: commit as `wip: subtask 04 complete — implement headwrench`_
