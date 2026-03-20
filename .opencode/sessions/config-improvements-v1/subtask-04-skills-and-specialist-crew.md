# Subtask 04 — skills-and-specialist-crew

## Delegation
**Agent:** @session-local-implementer (config-implementer)  
**Reason:** Editing two SKILL.md files with structural improvements to progressive disclosure and model tier guidance.

## Objective
Restructure both SKILL.md files to support progressive disclosure (TL;DR section, version field), and add model tier suggestion guidance and specialist crew templates to the delegation expert skill.

## Todolist
- Read `~/.config/opencode/skills/agent-writer/SKILL.md` in full
- Read `~/.config/opencode/skills/agent-delegation-expert/SKILL.md` in full
- Update agent-writer/SKILL.md: add version: field to SKILL.md frontmatter; add ## TL;DR section near the top (before ## When to Create); add model tier suggestion table; strengthen model recommendation guidance
- Update agent-delegation-expert/SKILL.md: add version: field to frontmatter; add ## TL;DR section; add specialist crew routing table with capability tiers; add complexity_class to ## Delegation output format

## Scope
**Edit:**
- `~/.config/opencode/skills/agent-writer/SKILL.md`
- `~/.config/opencode/skills/agent-delegation-expert/SKILL.md`

**Write:** none

**Excluded:** All other files. Do not touch protocols, agents, commands, or context files.

## Patterns
- SKILL.md frontmatter addition: add `version: "1.1.0"` (both files)
- ## TL;DR placement: insert after frontmatter/title, before the first ## section in the body
- TL;DR content: 2-3 sentences max, ~200 tokens; captures the core purpose and the single most important constraint
- Model tier suggestion table for agent-writer (add in "Communicating Model Recommendations" section):
  | Task Type | Recommended Tier | Example Models |
  |-----------|-----------------|----------------|
  | Mechanical (renames, format-only) | Fast/cheap | claude-haiku-4-5, gpt-4o-mini |
  | Standard implementation (code, docs, config) | Mid-tier | claude-sonnet-4-6, gpt-4o |
  | Complex architecture / deep reasoning | Strong | claude-opus-4, o1-mini |
- Specialist crew routing table for agent-delegation-expert (add after current routing table):
  | Specialist | Capability Tier | Recommended Model Class | Primary Tools |
  |-----------|----------------|------------------------|---------------|
  | ContextScout | Fast/cheap | Haiku-class | read, glob, grep, bash read-only |
  | ContextInsurgent | Mid-tier | Sonnet-class | +sequential-thinking, +write(notes only) |
  | DeepResearcher | Mid-tier | Sonnet-class | exa*, context7* only |
  | Implementer | Mid-tier | Sonnet-class | edit, write, read, bash read-only |
  | Architect | Strong | Opus/o1-class | edit, write, read, +sequential-thinking |
- complexity_class in ## Delegation output format: add `**Complexity:** Mechanical | Standard | Complex | Breakthrough` line after **Reason:**

## Constraints
- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT modify any files outside the Scope list above.
- Do NOT restructure or remove existing content; only add new sections and fields.
- Version field uses semantic versioning; "1.1.0" indicates minor enhancement to existing skills.
- The TL;DR section is for progressive disclosure — keep it under 3 sentences so HW can load it without reading the full skill.
- Model recommendations are suggestions only; users control actual model IDs via PLACEHOLDER_MODEL_ID.

## Success Criteria
- Both SKILL.md files have `version: "1.1.0"` in frontmatter
- Both SKILL.md files have a ## TL;DR section placed before the first major content section
- agent-writer/SKILL.md contains a model tier suggestion table
- agent-delegation-expert/SKILL.md contains a specialist crew routing table with capability tiers
- agent-delegation-expert/SKILL.md ## Delegation output format includes a `**Complexity:**` field

## Context Files
- `~/.config/opencode/skills/agent-writer/SKILL.md` — edit target
- `~/.config/opencode/skills/agent-delegation-expert/SKILL.md` — edit target

---
*Checkpoint: WIP commit after this subtask completes. Circuit breaker threshold: 3.*
