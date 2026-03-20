# Subtask 02 — skills-progressive-disclosure

## Delegation
**Agent:** @config-implementer  
**Reason:** File rewrite task requiring a structural overhaul of two SKILL.md files — standard implementation work.

---

## Objective

Rewrite both skill files (`opencode/skills/agent-writer/SKILL.md` and `opencode/skills/agent-delegation-expert/SKILL.md`) to implement the progressive disclosure pattern from research findings: a 3-tier structure that dramatically reduces token cost when skills are not in active use.

The three tiers are:
1. **Discovery** (~50 tokens) — just enough to know when to invoke this skill. A one-sentence description and when-to-use trigger.
2. **Summary** (~200 tokens) — key rules and quick reference. Enough to apply the skill without reading the full content.
3. **Full content** (1000-5000 tokens) — the complete skill as it exists today, invoked on explicit demand.

The YAML frontmatter should encode the discovery and summary tiers so they can be read without loading the full file body.

---

## Scope

### In Scope
- `opencode/skills/agent-writer/SKILL.md`
- `opencode/skills/agent-delegation-expert/SKILL.md`

### Out of Scope
- All other files
- Changing the actual rules/content of the skills (only restructuring presentation)
- Creating sub-skill files (Phase 3 hierarchical composition — not in scope here)

---

## Patterns

- YAML frontmatter already has `name` and `description` fields — extend with `summary` field
- The `summary` field should be a multi-line YAML string (~200 tokens) with key rules in bullet form
- Body of the file is the "full content" tier — keep all existing content intact
- Add a brief "## When to Invoke" section at the top of the body (before existing content) if one doesn't exist
- The discovery tier is the `description` field (~50 tokens) — already exists, may need sharpening

---

## Constraints

- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT remove or shorten any existing full-content sections — the body should remain complete
- The `summary` YAML field should be usable standalone — someone reading only the frontmatter can apply the skill
- Preserve all existing permission templates verbatim in the body
- `description` field (discovery tier) should be ≤ 2 sentences, trigger-focused
- `summary` field should cover: routing table, one-agent-vs-multiple rule, permission deny-by-default principle — as bullets, ≤ 200 tokens

---

## Success Criteria

- Both SKILL.md files have a `summary` field in YAML frontmatter with key rules as bullets
- `description` fields are tight trigger-focused sentences (~50 tokens each)
- Body content is unchanged in completeness — all templates, rules, and examples remain
- A "## When to Invoke" section exists at the top of the body for both files

---

## Todolist

- [ ] Read both SKILL.md files in full
- [ ] Rewrite `agent-writer/SKILL.md` frontmatter: sharpen `description`, add `summary` field with key rules
- [ ] Add/verify "## When to Invoke" section in `agent-writer/SKILL.md` body
- [ ] Rewrite `agent-delegation-expert/SKILL.md` frontmatter: sharpen `description`, add `summary` field with key rules
- [ ] Add/verify "## When to Invoke" section in `agent-delegation-expert/SKILL.md` body
- [ ] [⏸ PAUSE] — Summarize all changes made, show key additions, wait for user sign-off before checkpoint
