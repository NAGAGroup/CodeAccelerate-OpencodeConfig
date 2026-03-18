# Subtask 02 — Rewrite Skill Files

## Delegation
**Agent:** @session-local-implementer  
**Model tier:** standard (`github-copilot/claude-sonnet-4.6`)  
**Reason:** Targeted markdown edits to 2 skill files — well within implementer scope.

---

## Objective

Rewrite both skill files to fix framing and remove any slash command references. Skills are loaded by HeadWrench during planning — they should address HeadWrench in second person ("you") and never reference slash commands like "/plan" by name (use "planning session" instead). Preserve all operational content exactly.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent (`@session-local-implementer`) as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Scope

- **Edit:**
  - `opencode/skills/agent-delegation-expert/SKILL.md`
  - `opencode/skills/agent-writer/SKILL.md`
- **Read:** Both files above before editing
- **Write:** None
- **Excluded:** Everything else

---

## Patterns

```
✅ GOOD — "Load during Step 4 of the planning session, after the plan is drafted."
❌ BAD  — "Load during Step 4 of /plan, after the plan is drafted." (slash command reference)

✅ GOOD — "You apply the routing rules below to assign an agent to each subtask."
❌ BAD  — "Apply the rules below..." when the existing phrasing uses "you" inconsistently.

✅ GOOD — Preserving all routing tables, permission templates, and output format sections verbatim.
❌ BAD  — Restructuring or removing any existing operational content.
```

---

## Constraints

- Use second person "you" throughout — skills are loaded into HeadWrench's context and address HeadWrench directly
- Replace any occurrence of "/plan" (as a command reference) with "the planning session" or "your planning workflow"
- Preserve all routing tables, permission templates, common mistake lists, and output format sections exactly
- Do not add persona sections — skills are loaded instructions, not agent identities
- Keep all YAML frontmatter (`name`, `description`) unchanged

---

## Todolist

### 1. Read skill files
- [ ] Read `opencode/skills/agent-delegation-expert/SKILL.md`
- [ ] Read `opencode/skills/agent-writer/SKILL.md`

### 2. Rewrite skill files
- [ ] Edit `agent-delegation-expert/SKILL.md` — replace "/plan" references with "planning session"; convert any third-person HW references to second person "you"
- [ ] Edit `agent-writer/SKILL.md` — same framing fixes; verify no slash command references remain

### 3. Verify
- [ ] Confirm all routing tables, templates, and operational content are intact and unchanged
- [ ] Confirm no "/plan", "/context-audit", or other slash command strings remain (except in example paths or git commands where they're literal strings)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
