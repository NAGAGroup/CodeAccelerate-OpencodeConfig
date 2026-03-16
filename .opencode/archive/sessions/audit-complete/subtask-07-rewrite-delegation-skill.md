# Subtask 07 — rewrite-delegation-skill

## Objective
Rewrite `opencode/skills/agent-delegation-expert/SKILL.md` to remove dead agent references (@explorer, @Architect), remove model tier language entirely, add @ContextInsurgent routing, add guidance on creating session-local agents via the agent-writer skill, fix the invocation point reference, and standardize naming.

## Scope

### Edit (full rewrite)
- `opencode/skills/agent-delegation-expert/SKILL.md`

### Excluded
- No changes to any other files

## Constraints

The rewrite must preserve the skill's core purpose (routing subtasks to the right agent) while removing all dead references and the broken tier model. Key requirements:

### Remove
- All references to `@explorer` (C-A5) — this agent is disabled
- All references to `@Architect` (H-A2) — this agent is deleted
- All references to `@CodeWriter` and `@DocWriter` as global agents — they no longer exist globally
- Model tier language: fast/haiku, standard/sonnet, deep/opus — these are runtime no-ops (M-A1)
- `AgentDelegationExpert` CamelCase references — use `agent-delegation-expert` (M-A5)

### Add / Update
- Add `@ContextInsurgent` to the routing table for deep exploration (H-A3): "deep codebase exploration, multi-file analysis, complex investigation requiring sequential reasoning"
- Update invocation point: currently says "Phase 5" (M-A4) — change to "Step 4 of /plan, after the session plan is drafted"
- Add guidance: "For implementation and documentation subtasks, HeadWrench creates session-local agents using the **agent-writer skill** (`~/.config/opencode/skills/agent-writer/SKILL.md`) during plan finalization. Load that skill when you need to create an implementation or doc agent."

### Agent Taxonomy (new routing table)

Replace the old table with this taxonomy:

| Agent | Type | When to use |
|-------|------|-------------|
| @ContextScout | read-only | Pre-planning situational awareness, quick codebase questions |
| @ContextInsurgent | read-only + deep | Deep multi-file exploration, complex investigation, sequential reasoning |
| @DeepResearcher | research | Web search, documentation lookup, external API research |
| @session-local-implementer | implementation | File edits, code changes, writing new files — created via agent-writer skill |
| HeadWrench directly | infrastructure | git ops, build/test, small tightly-coupled tasks, session management |

### Model Guidance (replace tier system)
Remove tier assignments. Replace with: "For session-local implementation agents, recommend a capable writing/editing model to the user. Do not specify a model ID yourself — write `PLACEHOLDER_MODEL_ID` in the agent frontmatter and instruct the user to fill it in before running 'start'. See the agent-writer skill for the full workflow."

### Permission Templates
Keep the existing permission block templates (read-only, implementation, research) — they are correct. Update template names to match the new taxonomy. Remove any `"*": ask` examples; ensure all templates use `"*": deny` as default.

### Preserve
- The deny-by-default principle section (it's correct and important)
- The permission template examples (implementation, read-only, specialized-tool)
- The general structure (When to Invoke, routing table, permission templates, output format)

## Todolist
- [ ] Read current SKILL.md to understand existing structure before rewriting
- [ ] Rewrite SKILL.md: remove dead refs, remove tier language, update routing table
- [ ] Add @ContextInsurgent to routing table
- [ ] Add session-local agent creation guidance referencing agent-writer skill
- [ ] Fix invocation point from "Phase 5" to "Step 4 of /plan"
- [ ] Standardize to kebab-case (remove AgentDelegationExpert CamelCase)
- [ ] [🚫 GATE] Review all foundational fixes (subtasks 01–07) are solid before proceeding to headwrench.md and plan redesign

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — full rewrite of a skill document with clear spec
