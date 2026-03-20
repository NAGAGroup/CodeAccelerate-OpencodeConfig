# Session: config-reimplementation

**Goal**: Rewrite the opencode config in `./opencode` to incorporate all findings from the config-reimplementation-research session. Closes 10 identified gaps across context management, skills, agent design, session schema, plan protocols, and checkpoint commands. Phases 1-4 with gates before Phase 3 and Phase 4.

**Status**: pending

**Created**: 2026-03-19

---

## Subtask Table

| # | Name | Status | Notes |
|---|------|--------|-------|
| 01 | context-management-upgrades | pending | Add freshness_sla, context_type, 60% cliff guidance to context-management.md |
| 02 | skills-progressive-disclosure | pending | Rewrite SKILL.md files with 3-tier progressive disclosure structure |
| 03 | subtask-schema-improvements | pending | Add Context Files + Success Criteria sections to session-plan-schema.md |
| 04 | agent-operational-limits | pending | Add max_iter/max_rpm/max_execution_time to agent frontmatter and skill templates |
| 05 | plan-protocol-upgrades | pending | Add mode differentiation, 3-pass synthesis, pre-execution validation gate |
| 06 | checkpoint-commands | pending | Create /save and /restore commands, update checkpoint.md |
| 07 | phase3-plugin-work | pending | TypeScript plugin work (behind GATE — requires user approval) |
| 08 | phase4-advanced-features | pending | Advanced features: earned autonomy, complexity routing (behind GATE) |

---

## Gates

- **After subtask 06** → Phase 3 eval: user approves TypeScript plugin work before subtask 07 begins
- **After subtask 07** → Phase 4 eval: user approves advanced features before subtask 08 begins

---

## Key Constraints

- `opencode/` IS `~/.config/opencode/` via symlink — edits are immediately live
- All implementation delegated to `@config-implementer` (session-local agent)
- WIP commit after each subtask
- Review mode: pause after each subtask for user sign-off
- Circuit breaker: 3 consecutive failures
