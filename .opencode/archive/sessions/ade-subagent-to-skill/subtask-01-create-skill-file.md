# Subtask 01 — create-skill-file

## Delegation
**Agent:** @DocWriter
**Model:** standard (sonnet) — requires synthesizing the existing subagent logic into a well-structured skill format with clear trigger conditions

## Objective
Create `opencode/skills/agent-delegation-expert/SKILL.md` — a native opencode skill that HeadWrench loads during Phase 5 of `/plan` to apply delegation rules itself.

The skill replaces the `agent-delegation-expert` subagent. Instead of dispatching a subagent that returns recommendations, HW loads this skill and directly applies its rules when assigning agents and models to each subtask.

## Todolist
- [ ] Create directory `opencode/skills/agent-delegation-expert/`
- [ ] Write `SKILL.md` with valid YAML frontmatter (`name: agent-delegation-expert`, `description` ≤1024 chars describing what + when)
- [ ] Include all delegation rules (agent routing, model tier, decision table)
- [ ] Include SubagentBuilder briefing guidance
- [ ] Include output format instructions

## Scope
**Create:**
- `opencode/skills/agent-delegation-expert/SKILL.md`

**Do not touch:**
- `opencode/agents/subagents/agent-delegation-expert.md` — removed in subtask 02
- `opencode/opencode.json` — updated in subtask 02
- `opencode/agents/headwrench.md` — updated in subtask 03
- `opencode/protocols/plan-workflow.md` — updated in subtask 03
- `opencode/commands/plan.md` — updated in subtask 03

## Patterns & Constraints

### Skill file rules
- Path: `opencode/skills/agent-delegation-expert/SKILL.md`
- File must be named `SKILL.md` (all caps)
- `name` field in frontmatter must exactly match directory name: `agent-delegation-expert`
- `description` must describe **what** the skill does AND **when** to invoke it (≤1024 chars)

### Content requirements
The skill body must cover all of the following:

**1. When to invoke**
Load this skill during Phase 5 of `/plan`, after the session plan is drafted. Apply the rules below to assign agent and model to each subtask, then write those assignments into the `## Delegation` section of each `subtask-NN-{name}.md` file.

**2. Agent routing rules**
- `@CodeWriter` — clear implementation specs with known patterns
- `@DocWriter` — documentation, comments, READMEs
- `@explorer` — pure codebase search/exploration
- `@Architect` — only if user opted in AND the problem genuinely requires deep reasoning
- `HeadWrench directly` — git ops, build/test/CI, small tightly-coupled tasks. Never assign build or test steps to CodeWriter.
- `CUSTOM → SubagentBuilder` — when no default agent fits

**3. Model tier rules**
- `fast (haiku)` — unambiguous specs, clear inputs/outputs
- `standard (sonnet)` — requires judgment, interpretation, or multiple interacting systems
- `deep (opus)` — genuinely hard reasoning, only if Architect is enabled

**4. Decision table** (replicate from existing subagent):

| Situation | Agent | Tier |
|-----------|-------|------|
| Clear spec, known patterns | CodeWriter | fast |
| Multiple interacting systems | CodeWriter | standard |
| Critical output for other subtasks | CodeWriter | standard (min) |
| Pure exploration/search | explorer | fast |
| Infrastructure, git, CI, build, test | HeadWrench | — |
| Genuinely hard reasoning | Architect | deep |

**5. SubagentBuilder briefing guidance**
When no default agent fits and a custom agent is needed:
- Identify the subtask that needs a custom agent and describe what it needs to do
- Brief `@SubagentBuilder` with: the agent's purpose, the behavior you need, and any constraints (read-only, no bash, etc.)
- Do NOT attempt to write the agent spec or frontmatter yourself — SubagentBuilder has the specialized knowledge to produce a well-formed agent definition
- SubagentBuilder will create the agent file in `.opencode/sessions/{name}/agents/` for use in this session

**6. Output format**
Write each subtask's delegation assignment into the `## Delegation` section of the corresponding `subtask-NN-{name}.md` file:

```
## Delegation
**Agent:** @AgentName
**Model:** tier (model-id) — brief reason
```

Assignments go in subtask files only — never in `spec.json` or `index.md`.

### Reference
Source material: `opencode/agents/subagents/agent-delegation-expert.md` — read this to extract and adapt the existing rules.

---

## Checkpoint
After completing this subtask:
1. WIP commit: `git add -A && git commit -m "wip: subtask-01 — create agent-delegation-expert skill file"`
2. Update `index.md` subtask table: mark 01 ✅ completed, mark G1 as next
3. Update `spec.json`: `currentSubtask` → G1, subtask 01 status → `completed`
4. Update session summary todo
5. Write notes if any conventions or decisions were made
6. Surface G1 gate findings to user and wait for approval before proceeding
