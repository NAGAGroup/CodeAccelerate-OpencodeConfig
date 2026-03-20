# Subtask 02 — context-management

## Delegation
**Agent:** @session-local-implementer (config-implementer)  
**Reason:** Editing multiple protocol and context markdown files; requires consistent YAML frontmatter additions across ~11 files.

## Objective
Upgrade the context management system to support 3-tier memory, SLA-based staleness metadata, a 60% compaction trigger policy, and position-aware placement rules. This involves updating context-management.md, updating headwrench.md's context loading section, and adding YAML frontmatter metadata to all existing context files.

## Todolist
- Read `~/.config/opencode/protocols/context-management.md` in full
- Read the Session Bootstrap section of `~/.config/opencode/agents/headwrench.md`
- Glob/list all files in `~/.config/opencode/context/` and `.opencode/context/` to identify targets
- Read each context file before editing (to preserve existing content and determine correct context_type)
- Update context-management.md: add 3-tier memory section, SLA staleness model, 60% compaction trigger policy, position-aware placement rules, and YAML metadata spec
- Add YAML frontmatter (active, created, context_type, freshness_sla, superseded_by) to all context files in `~/.config/opencode/context/` and `.opencode/context/`
- Update headwrench.md Session Bootstrap section: add checks for active: false + superseded_by before loading; add 60% trigger note; add position-aware placement instruction

## Scope
**Edit:**
- `~/.config/opencode/protocols/context-management.md`
- `~/.config/opencode/agents/headwrench.md` (Session Bootstrap section only)
- All `.md` files in `~/.config/opencode/context/` (~8 files)
- All `.md` files in `.opencode/context/` (~3 files)

**Write:** none

**Excluded:** All other files. Do not touch headwrench.md sections outside Session Bootstrap. Do not touch session files, subtask files, or any protocol other than context-management.md.

## Patterns
- YAML frontmatter format for context files:
  ```yaml
  ---
  active: true
  created: "YYYY-MM-DD"
  context_type: semantic
  freshness_sla: indefinite
  superseded_by: null
  ---
  ```
- context_type values: `semantic` (conventions/global patterns), `episodic` (session-scoped findings)
- freshness_sla values: `indefinite` for global context files, `30d` for episodic notes
- All existing `~/.config/opencode/context/` files are `semantic` type with `indefinite` SLA
- All existing `.opencode/context/` files are `semantic` type with `indefinite` SLA
- Do not change any existing content in context files — only prepend the YAML frontmatter block
- In context-management.md, insert new sections without removing existing content

## Constraints
- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT modify any files outside the Scope list above.
- Use today's date (2026-03-19) as the `created` value for all context files that don't already have one.
- The 60% compaction trigger is a convention/guideline for HeadWrench, not an automated enforcement mechanism.
- Position-aware placement rule: critical context (current subtask, key constraints) at start; background notes at end; avoid placing important information in the middle of the context window.
- Do NOT add staleness metadata to protocol files (*.md in protocols/) — only context files.

## Success Criteria
- context-management.md contains a new section describing 3-tier memory (working/episodic/semantic) with clear definitions
- context-management.md contains a YAML metadata spec with active, created, context_type, freshness_sla, superseded_by fields
- context-management.md contains a 60% compaction trigger policy
- context-management.md contains position-aware placement rules
- All ~11 context files have YAML frontmatter with the required fields
- headwrench.md Session Bootstrap references checking active: false and superseded_by before loading context files

## Context Files
- `~/.config/opencode/protocols/context-management.md` — primary protocol to update
- `~/.config/opencode/agents/headwrench.md` — update Session Bootstrap section
- `~/.config/opencode/context/` — all files need YAML frontmatter added
- `.opencode/context/` — all files need YAML frontmatter added

---
*Checkpoint: WIP commit after this subtask completes. Circuit breaker threshold: 3.*
