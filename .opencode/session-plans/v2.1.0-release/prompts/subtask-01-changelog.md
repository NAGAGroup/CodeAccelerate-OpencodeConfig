<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01 — Write CHANGELOG.md [2.1.0] Section

## Objective

Write the `[2.1.0]` changelog section in `CHANGELOG.md`, documenting all user-facing changes made since v2.0.0 (commit `695d9a98bcabacbcc623ee057c1c6f23c1277692`, tagged `v2.0.0`). This section must be inserted above `[2.0.0]` and must follow the Keep a Changelog format. Housekeeping-only commits (session archives, `plan: add session …`, `chore: archive …`, `WIP`) must be excluded.

## Scope

- **Edit:** `CHANGELOG.md`
- **Excluded:** all other files

## Constraints

- Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format exactly: `### Added`, `### Changed`, `### Fixed`, `### Removed`
- Only include user-facing changes — filter out internal planning commits, session archives, and WIP commits
- Version date: `2026-03-21` (today)
- Update the version comparison links at the bottom of the file — add a `[2.1.0]` entry comparing against `v2.0.0`, and update `[Unreleased]` to compare against `v2.1.0`
- GitHub compare URL format: `https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/vX.Y.Z...vA.B.C`

## Commits to Categorize (since v2.0.0)

These are the raw commits — you must determine which are user-facing and how to group them:

```
0d1728b chore: helper script
c8a0fb9 Add terminal node constraint to session plan generation
9fb03ba plan: add session terminal-node-instruction
75f467c chore: harden all planning workflow prompts with strict language patterns
e71dfc7 chore: archive completed harden-planning-prompts session
2283c0f plan: add session harden-planning-prompts
5ee6972 chore: cleanup
adcf6af Revise README for clarity on multi-agent system
3508e14 refactor: use config-root-relative paths for OCX-installed planning DAGs
568cd8a chore: archive ocx-docs-update session plan
5034be4 docs: update installation flow to OCX-based distribution
bb764dc plan: add session ocx-docs-update
85b1214 deploy: 2.0.0
f3c02a7 feat: move to ocx distribution
e6997fb chore: archive sessions
9df79f0 plan: add deep-research session ocx-distribution-research
b24b435 Enrich plan.json next field with desc and choose_when; inject guidance via next_step; guard close_session to terminal nodes
03660e0 plan: add session plan-schema-next-enrichment
e78b329 WIP
aa1f1f5 plan: add session close-session-archive
9974cb0 fix: planning prompts
8e03c7a chore: archived session plans
2683437 chore: session plan update
295408d feat: improved planning flows
8dea963 plan: add session add-scout-to-all-workflows
140fd9a fix: correct headwrench model ID and reset plan-generic clarify visit counter
99eec4f docs: enforce no-implementation rule in all planner session-overview nodes
aa4f443 feat: add plan-deep-review planning workflow
717ad0d chore: session plan updates
bec4986 plan: add session plan-deep-review-impl
c569730 refactor: restructure all four planning workflows per workflow-audit
c668e94 plan: add collaborative session workflow-audit
cda6a3d plan: add session compaction-hook
b9b5e1e feat: write execution progress into plan.json from activate_plan, next_step, close_session
911dbd9 plan: add session plan-progress-tracking
1eac221 chore: archive all session plans to .opencode/archived-plans
d67afc8 chore: update plan-deep-research dag state
734db63 feat: add plan-deep-research planning mode
5547d17 fix: missing schema task node
156c4ab plan: add session plan-deep-research
Append Available Next Steps block on successful activation too
```

## Todolist

1. Read the current `CHANGELOG.md` to understand its structure and existing bottom links
2. Identify which commits are user-facing vs. housekeeping
3. Group user-facing changes under Added/Changed/Fixed/Removed
4. Insert the `[2.1.0] - 2026-03-21` section above `[2.0.0]` in `CHANGELOG.md`
5. Update the version comparison links at the bottom of the file

## Delegation

**Agent:** HW (direct)
**Reason:** Requires judgment to filter housekeeping commits, group entries accurately, and draft changelog prose that matches the project's tone and format.

## Advance

Call `next_step()` when this subtask is complete.
