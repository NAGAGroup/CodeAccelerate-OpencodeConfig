# Subtask 03 — update-references

## Delegation
**Agent:** @DocWriter
**Model:** standard (sonnet) — requires understanding the behavioral change (subagent dispatch → skill load) and expressing it consistently across three files

## Objective
Update all files that reference `@AgentDelegationExpert` as a subagent dispatch, replacing with skill invocation language.

The key behavioral change to express: HeadWrench no longer dispatches a subagent and waits for recommendations — instead HW loads the `agent-delegation-expert` skill and applies its delegation rules directly.

## Todolist
- [ ] Update `opencode/agents/headwrench.md` — replace "Delegate to @AgentDelegationExpert" with skill-load language
- [ ] Update `opencode/protocols/plan-workflow.md` — update Phase 5 to describe skill invocation
- [ ] Update `opencode/commands/plan.md` — update Phase 5 to match plan-workflow.md

## Scope
**Edit:**
- `opencode/agents/headwrench.md`
- `opencode/protocols/plan-workflow.md`
- `opencode/commands/plan.md`

**Do not touch anything else.**

## Patterns & Constraints

### Language to use
- Old: "Delegate to **@AgentDelegationExpert** — returns routing + model recommendations (read-only)"
- New: "Load the **agent-delegation-expert** skill and apply its delegation rules to assign agent and model to each subtask"

### headwrench.md
- In the `## Delegation Rules` section (or equivalent): remove the `@AgentDelegationExpert` bullet, add a note that delegation rules come from the `agent-delegation-expert` skill loaded during planning
- In the system prompt summary at the top: update any mention of dispatching ADE

### plan-workflow.md — Phase 5
Old Phase 5 was: "Delegate to @AgentDelegationExpert — pass the drafted plan, get routing + model recommendations back"
New Phase 5: "Load the `agent-delegation-expert` skill. Apply its delegation rules to assign agent and model to each subtask. Write the assignments into the `## Delegation` section of each subtask-NN file."

### plan.md — Phase 5
Mirror the same change as plan-workflow.md.

### Invariant to preserve
Agent/model assignments go into subtask-NN `## Delegation` sections only — never in spec.json or index.md. Reinforce this where relevant.

---

## Checkpoint
After completing this subtask:
1. WIP commit: `git add -A && git commit -m "wip: subtask-03 — update references from ADE subagent dispatch to skill invocation"`
2. Update `index.md` subtask table: mark 03 ✅ completed, mark 04 as next
3. Update `spec.json`: `currentSubtask` → 4, subtask 03 status → `completed`
4. Update session summary todo
5. Write notes on any non-obvious phrasing decisions
6. No gate — proceed to subtask 04 (final commit)
