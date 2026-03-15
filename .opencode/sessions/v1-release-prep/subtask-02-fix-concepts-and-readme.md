# Subtask 02 — fix-concepts-and-readme

## Objective
Fix `docs/CONCEPTS.md` and `README.md` to accurately reflect the current agent roster, skill count, command count, and MCP status.

## TL;DR
Both files refer to deleted agents, wrong counts, and stale MCP info. This subtask brings them in sync with the corrected FEATURES.md.

## Scope
### Edit
- `docs/CONCEPTS.md`
- `README.md`

### Read
- `FEATURES.md` (already corrected in subtask 01 — use as authoritative reference)

### Write
- None

### Excluded
- All other files

## Constraints
- Do NOT modify any file other than `docs/CONCEPTS.md` and `README.md`
- Use `FEATURES.md` as the ground truth for counts and names
- Preserve existing prose structure; only update the stale content

## Changes Required

### docs/CONCEPTS.md

1. **Subagent count/list** — Currently says "7 subagents" listing: context-scout, deep-researcher, gates-expert, subagent-builder, code-writer, doc-writer, architect
   - Change to "3 subagents": context-scout, context-insurgent, deep-researcher
   - Remove all 5 deleted agent entries (gates-expert, subagent-builder, code-writer, doc-writer, architect)
   - Add context-insurgent entry with a description: deep codebase exploration specialist with sequential thinking capability

2. **HeadWrench "does not" section** — Currently says something like "delegates to code-writer"
   - Remove the code-writer reference; HeadWrench delegates implementation to session-local agents created via the agent-writer skill

3. **Skills count** — Currently says "one skill: agent-delegation-expert"
   - Change to "two skills: agent-delegation-expert and agent-writer"
   - Add brief description of agent-writer: "Creates session-local agent files during plan finalization"
   - Note that skills are loaded on demand (not auto-loaded)

4. **Slash commands count** — Currently says "9 slash commands"
   - Change to "11 slash commands"
   - Add /context-audit, /quick-plan, /session-status to the list

### README.md

1. **Subagent count/list** — Currently says "7 specialized subagents — context-scout, deep-researcher, gates-expert, code-writer, doc-writer, subagent-builder, architect"
   - Change to "3 subagents — context-scout, context-insurgent, deep-researcher"

2. **Skills** — Currently says "1 skill — agent-delegation-expert"
   - Change to "2 skills — agent-delegation-expert, agent-writer"

3. **MCPs** — Currently says exa is "disabled by default"
   - Change to "enabled (requires EXA_API_KEY env var)"

## Todolist
- [ ] Read docs/CONCEPTS.md current content
- [ ] Read README.md current content
- [ ] Fix CONCEPTS.md: subagent count/list (7→3, add context-insurgent, remove 5 deleted)
- [ ] Fix CONCEPTS.md: HeadWrench "does not" section (remove code-writer reference)
- [ ] Fix CONCEPTS.md: skills (1→2, add agent-writer)
- [ ] Fix CONCEPTS.md: slash command count (9→11, add 3 missing)
- [ ] Fix README.md: subagent count/list
- [ ] Fix README.md: skills count/list
- [ ] Fix README.md: exa MCP status

## Delegation
**Agent:** @session-local-implementer  
**Reason:** File editing task — updates two documentation files to match current framework state.
