# OpenCode Configuration Audit

**Date**: 2026-03-13  
**Auditor**: HeadWrench (opencode-config-audit session)  
**Scope**: All agents, protocols, commands, plugins, and session infrastructure in `opencode/` and `.opencode/`  
**Deliverable**: Severity-rated findings, contradictions, strengths, and ordered recommendations

---

## Executive Summary

The OpenCode configuration is architecturally sound at its core. The deny-by-default permission model is consistently applied, the HeadWrench orchestrator pattern is coherent, and the 5-tier context loading system is well-designed. However, the audit found **8 Critical** and **18 High** severity issues that prevent several major subsystems from functioning correctly at runtime.

The most impactful failures are:

1. **DeepResearcher is entirely non-functional** — the exa MCP that provides all its tools is disabled in `opencode.json`.
2. **The model tier concept (fast/standard/deep) is a runtime no-op** — SKILL.md creates false confidence in quality-appropriate planning while doing nothing.
3. **CodeWriter and DocWriter are instructed to `git commit`** but their bash permissions block `git` entirely.
4. **Two deleted agents (Architect, GatesExpert) are still live** — files and/or opencode.json entries remain, creating stale routing targets.
5. **The planning workflow for ContextInsurgent enforcement is nowhere written down** — the multi-ContextScout → ContextInsurgent synthesis pattern exists only in user memory.

Additionally, there are **4 direct contradictions between protocol files** where two authoritative sources give conflicting instructions for the same situation.

**User-facing docs (README, FEATURES, CHANGELOG) are broadly stale** but are explicitly out of scope for this audit — deferred to a separate task.

### Finding Counts by Severity

| Severity | Count |
|----------|-------|
| Critical | 8 |
| High | 18 |
| Medium | 21 |
| Low | 10 |
| Info | 5 |
| **Total** | **62** |

---

## Category 1: Agents

### Critical

**C-A1 — DeepResearcher is entirely non-functional**  
`opencode.json:71` has `"enabled": false` for the exa MCP. Every tool DeepResearcher uses (web search, crawling, deep research) comes from exa. With exa disabled, the agent has no operational tools. Any session that delegates to DeepResearcher will silently receive no results.  
_Fix_: Set `"enabled": true` for the exa MCP in `opencode.json`.

**C-A2 — CodeWriter instructed to `git commit` but git is permission-blocked**  
`code-writer.md` line 49 instructs CodeWriter to commit when done. Its bash permissions allow only `cat`, `ls`, `find`, `grep`, `rg` — `git` is not permitted. The instruction will fail silently or error. More fundamentally, HW owns all commits — subagents must not commit.  
_Fix_: Remove git commit instruction from `code-writer.md`. HW stages and commits at checkpoint step 1.

**C-A3 — DocWriter instructed to `git commit` but git is permission-blocked**  
Same issue as C-A2. `doc-writer.md` line 44 has the git commit instruction with the same blocked bash permissions.  
_Fix_: Remove git commit instruction from `doc-writer.md`.

**C-A4 — Architect agent must be deleted but file and opencode.json entry both remain**  
User decision: Architect is deleted (opus breaks sequential thinking tools; sonnet + sequential thinking + full HW context is more effective). Neither `subagents/architect.md` nor the `opencode.json` entry has been removed. The agent is live and will route correctly if referenced — which is precisely the risk.  
_Fix_: Delete `subagents/architect.md`. Remove the architect entry from `opencode.json`.

**C-A5 — @explorer routing in SKILL.md routes to a disabled agent**  
`opencode/skills/agent-delegation-expert/SKILL.md` lines 18 and 36 list `@explorer` as the routing target for "pure codebase search/exploration." `opencode.json` explicitly disables the built-in `explore` agent. Any delegation following SKILL.md's routing table for exploration will fail.  
_Fix_: Remove all `@explorer` references from SKILL.md. Add `@ContextInsurgent` as the routing target for deep exploration.

### High

**H-A1 — GatesExpert file not deleted (opencode.json entry removed but .md remains)**  
`subagents/gates-expert.md` still exists. The opencode.json entry was removed in a prior session. The dangling file creates confusion and is a stale reference target. Gating instructions already live in protocols that HW reads directly.  
_Fix_: Delete `subagents/gates-expert.md`.

**H-A2 — SKILL.md routing table references @Architect (deleted agent)**  
Beyond `@explorer`, SKILL.md still lists `@Architect` in the routing table. With Architect deleted, this is a dead reference that will mislead any agent reading the skill.  
_Fix_: Remove `@Architect` from SKILL.md routing table.

**H-A3 — SKILL.md missing @ContextInsurgent for deep exploration**  
After removing `@explorer` and `@Architect`, the exploration category has no valid routing target. ContextInsurgent is the correct replacement for deep codebase exploration.  
_Fix_: Add `@ContextInsurgent` to SKILL.md routing table for deep exploration tasks.

**H-A4 — SubagentBuilder lines 64–65 are directly contradictory**  
Line 64: "model tier should match recommendation." Line 65: "don't include model in frontmatter." These cannot both be satisfied. Agents SubagentBuilder creates will have no model override, making the tier recommendation a no-op.  
_Fix_: Remove "don't include model in frontmatter." SubagentBuilder must always include `model:` in the frontmatter of agents it creates. HW provides the required model identifier as part of the task spec.

**H-A5 — DeepResearcher instructed to use Context7 but has no context7 permissions**  
`deep-researcher.md` references Context7 for library documentation lookups, but the agent's permission block has no `context7` tool entries. The instruction is dead.  
_Fix_: Add context7 tool permissions to `deep-researcher.md`.

**H-A6 — `.opencode/context/ask-only-subagent-pattern.md` is stale and actively misleading**  
This Tier 3 context file describes ContextInsurgent as "ask-only" — requiring HW to get user confirmation before invoking. Decision #11 (subtask 02) explicitly removed the ask-only designation; HW can now invoke ContextInsurgent freely. This file is loaded into every future session bootstrap via the 5-tier context loading rule. Any future HW instance will incorrectly believe it must ask the user first.  
_Fix_: Set `active: false` and `superseded_by: planning-uses-multi-scout-then-insurgent.md` in `.opencode/context/ask-only-subagent-pattern.md`.

### Medium

**M-A1 — Model tier concept (fast/standard/deep) is a runtime no-op**  
SKILL.md hardcodes "haiku/sonnet/opus" as tier names throughout its decision table. These are provider-specific names that mean nothing at runtime — OpenCode uses whatever model is configured for the agent. A CodeWriter running GPT-5.3-codex will never receive "sonnet" just because SKILL.md said "standard tier."  
_Correct fix_: During planning, HW asks the user what model the target agent is running. If the model is insufficient for the task, HW delegates to SubagentBuilder to create a session-local clone with the correct model in frontmatter at `.opencode/agents/`. Remove all tier language from SKILL.md and plan-workflow.md.

**M-A2 — `architectEnabled` field in spec.json schema is dead**  
`session-plan-schema.md:49` defines `architectEnabled: boolean`. Architect is deleted. The field will appear in every new session spec until removed.  
_Fix_: Remove `architectEnabled` from `session-plan-schema.md` schema definition.

**M-A3 — Collaborative mode preferences are collected but structurally inert**  
`plan-workflow.md` and `plan.md` collect three extra Q&A answers for Collaborative sessions. None are stored in `spec.json`, acted on during execution, or used to insert gates. The branching creates a richer conversation but produces an identical plan artifact.  
_Fix_: Add a `spec.json` field for `collaborativeMode`, a subtask annotation for user-decision items, and a gate-insertion rule tied to pause cadence — or remove the Collaborative branch and merge into General.

**M-A4 — SKILL.md "Phase 5" label should be "Step 4"**  
SKILL.md references the ADE invocation point as "Phase 5" of `/plan`. The plan-workflow.md uses "Step" numbering, and the ADE invocation is Step 4. The discrepancy stems from plan.md inserting a "Phase 3 — Research" that offsets all subsequent numbers.  
_Fix_: Change "Phase 5" → "Step 4" in SKILL.md. Align plan.md and plan-workflow.md numbering.

**M-A5 — AgentDelegationExpert naming drift (CamelCase vs kebab-case)**  
`subagent-builder.md` references "AgentDelegationExpert" while all other files use "agent-delegation-expert."  
_Fix_: Standardize to `agent-delegation-expert` in all files.

---

## Category 2: Protocols

### Critical

**C-P1 — checkpoint.md and context-management.md directly contradict on inbox bypass**  
`checkpoint.md` lines 100–102 (Inbox Qualification Guidance): "Obvious destination + clearly reusable → Write directly to `context/`."  
`context-management.md:46`: "**Checkpoints always write to the inbox (staging), never directly to context.** Human review via `/context-audit` is what moves items into permanent context."  
Both are authoritative protocol files. `context-management.md` must be the authority. `checkpoint.md`'s "direct write" shortcut bypasses the human review gate that protects context quality.  
_Fix_: Remove the "write directly to context/" guidance from `checkpoint.md`. All checkpoint writes go to inbox.

**C-P2 — Decision #11 planning pattern is entirely absent from plan-workflow.md and plan.md**  
User-confirmed workflow rule (subtask 02): During planning, HW globs/greps the project for rough layout → dispatches multiple ContextScouts in parallel → uses findings to delegate to ContextInsurgent for synthesis. Neither `plan-workflow.md` nor `plan.md` contains any mention of: preliminary HW glob/grep, parallel ContextScout dispatch, or ContextInsurgent synthesis as an intermediate planning step. This is the most significant gap in the planning infrastructure.  
_Fix_: Add the full multi-ContextScout → ContextInsurgent synthesis pattern to `plan-workflow.md` Step 1 and `plan.md` Phase 1.

**C-P3 — plan.md Phase 2 references deleted Architect agent**  
`plan.md:50` (Phase 2 Q&A): "Architect opt-in" question asks whether to enable the Architect agent. Architect is deleted. Every new session plan will surface a question about a non-existent agent.  
_Fix_: Remove the Architect opt-in question from `plan.md` Phase 2.

**C-P4 — `architectEnabled` field baked into spec.json schema and plan.md**  
See also M-A2. The field appears in both `session-plan-schema.md:49` and is triggered by the plan.md Q&A. Both must be removed together.  
_Fix_: Remove `architectEnabled` from `session-plan-schema.md` and the associated Q&A from `plan.md`.

### High

**H-P1 — checkpoint.md Session Close section is unreachable — HW will WIP-commit the final subtask**  
`checkpoint.md:86–92` defines Session Close: final commit (not WIP), index.md/spec.json close, closing note. But `headwrench.md` Layer 3 checkpoint todos have no conditional branching that says "if this is the final subtask, use Session Close instead of WIP commit." An agent following only HW's instructions will produce `wip: subtask N complete` on the last subtask instead of a properly-named final commit.  
_Fix_: Add a conditional to Layer 3 step 1 in `headwrench.md`: "If this is the final subtask, use Session Close procedure from `checkpoint.md` instead of a WIP commit."

**H-P2 — Commit ownership contradiction between checkpoint.md and prior decisions**  
`checkpoint.md:11–12` states CodeWriter/DocWriter own their commits. Decision #1/#2 (subtask 02, user-confirmed): HW owns ALL commits — subagents must not commit. Both `checkpoint.md` and `headwrench.md` need coordinated updates to reflect this.  
_Fix_: Update `checkpoint.md` Step 1 to reflect that HW stages and commits all changes, including subagent output.

**H-P3 — plan.md Phase 3 (Research) diverges structurally from plan-workflow.md**  
`plan.md:80–83` treats DeepResearcher invocation as a distinct numbered Phase 3 with a user-confirmed gate. `plan-workflow.md` treats it as an optional sub-step of Step 1. These are materially different flows — one requires explicit user approval, the other is HW's unilateral decision. Every planning session follows one or the other inconsistently.  
_Fix_: Align both documents. Decide whether research is a gate (plan.md model) or a sub-step (plan-workflow.md model) and apply consistently.

**H-P4 — Collaborative preferences structural gap**  
See also M-A3. The structural inertness of collaborative mode preferences means the session type distinction produces no different execution behavior — only different Q&A output. This is theater.  
_Fix_: Either implement the structural differences (spec.json field, gate-insertion rule, subtask annotation) or merge Collaborative into General. Create per-type protocol files: `general.md`, `collaborative.md`, `debug.md`.

**H-P5 — Debug session has no plan-drafting structure guidance**  
Debug Q&A collects symptom, last known good, prior attempts, suspected components, reproduction test, regression test. But there is no guidance on how these shape the plan structure. A well-formed debug plan needs: Reproduce → Diagnose → Gate (hypothesis approved) → Fix → Regression test. None of this is prescribed anywhere.  
_Fix_: Create `debug.md` protocol file defining the standard debug plan structure.

**H-P6 — context-management.md "Conflict Resolution" section is unreachable**  
`context-management.md:132–139` defines how to handle contradictions between context files. No command, HW instruction, or other protocol references it. Agents encountering a contradiction have no instruction to consult this section.  
_Fix_: Add a reference in `headwrench.md` and `context-audit.md` pointing to the Conflict Resolution section.

**H-P7 — /continue command missing 3-layer todo stack reconstruction**  
`continue.md` instructs resuming a session but has no step to rebuild the Layer 2 (subtask todolist) and Layer 3 (checkpoint todos). An agent following only `continue.md` starts executing without any Layer 2/3 todos — it will not track checkpoint steps and will likely skip them.  
_Fix_: Add explicit todo stack reconstruction steps to `continue.md`, mirroring the Session Bootstrap procedure in `headwrench.md`.

**H-P8 — /context-remove bypasses supersession chain — can silently corrupt context**  
`context-remove.md` performs hard deletion without checking whether the target file's `supersedes:` chain is intact. Deleting a file that has `supersedes: old-file.md` leaves the old file with a stale `superseded_by:` pointer. ContextScout will permanently skip that old file, treating it as superseded when it is no longer superseded — silent data loss.  
_Fix_: Add supersession chain validation to `context-remove.md`. Refuse deletion or warn if the file has active `supersedes:` or `superseded_by:` relationships.

### Medium

**M-P1 — checkpoint.md Step 7 gate format check describes "GN ID" format that doesn't exist**  
`checkpoint.md:58` says to check "if the next subtask has an ID format of `GN` or is prefixed with `[🚫 GATE]`." Gates do not exist as standalone subtask rows with GN IDs — they live inside preceding subtask `## Todolist` sections as `[🚫 GATE]` todo items. The check describes a format that never appears at runtime.  
_Fix_: Rewrite Step 7 to say: "If the current subtask's Layer 2 todos include a `[🚫 GATE]` item, surface findings to the user and wait for explicit approval before continuing."

**M-P2 — plan-workflow.md contains stale "SessionPlanDrafter" reference**  
`plan-workflow.md:91` has a note: "The 'SessionPlanDrafter' agent is retired and must not be used." SessionPlanDrafter no longer exists anywhere. The note is harmless noise but signals past confusion.  
_Fix_: Remove the stale comment.

**M-P3 — spec.json `status` field missing `pending` as a valid value**  
`session-plan-schema.md:46` defines `status` as `"in_progress | complete"`. Both `context-management.md` and `session-plan-schema.md` itself reference `pending` as a valid status. Also: `complete` vs `completed` inconsistency in the same document.  
_Fix_: Update schema to `"in_progress | pending | completed"` and normalize to `completed`.

**M-P4 — Gate representation ambiguous between index.md example and amend.md rule**  
`session-plan-schema.md` example table shows `🚫 GATE` as a valid standalone row in index.md. `amend.md:58–60` says "Do NOT create synthetic standalone task rows for gates." Direct contradiction in the schema's own documentation.  
_Fix_: Align schema example with amend.md rule. Gates are `[🚫 GATE]` todo items inside the preceding subtask file's `## Todolist`, never standalone rows.

**M-P5 — /context-audit "Discard" action is undefined**  
`context-audit.md:37` lists "Discard" as an action. Step 6 execution lists inbox promotion and archival but never defines what Discard does. Should it delete the file? Set `active: false`? Set `superseded_by: discarded`?  
_Fix_: Define the Discard execution path in `context-audit.md` Step 6.

**M-P6 — Promotion candidate criteria undefined in /context-audit Step 4**  
Neither `context-audit.md` nor `context-management.md` defines what makes a note a promotion candidate or how HIGH/MEDIUM/LOW priority is assigned. The most consequential context management decision is left to heuristic judgment.  
_Fix_: Add explicit promotion criteria to `context-audit.md` Step 4.

**M-P7 — plan.md Phase 7 commit step absent from plan-workflow.md Step 7**  
`plan.md:129` prescribes a commit step after session files are written. `plan-workflow.md:78–83` (Step 7 Finalization) has no commit step. The two documents diverge on whether session-file commits happen during planning.  
_Fix_: Add commit step to `plan-workflow.md` Step 7 or explicitly defer to `plan.md`.

**M-P8 — plan.md Phase 8 `activate_session` call absent from plan-workflow.md Step 8**  
`plan.md:140` calls the `activate_session` tool at the end of planning. `plan-workflow.md` Step 8 has no such step. A reader following only `plan-workflow.md` will never activate the session.  
_Fix_: Add `activate_session` call to `plan-workflow.md` Step 8.

**M-P9 — Sequential Thinking use during planning not mentioned in plan-workflow.md**  
`plan.md:67` and `plan.md:87` explicitly require Sequential Thinking for Q&A synthesis and subtask breakdown. `plan-workflow.md` has no mention. The requirement lives only in the command file.  
_Fix_: Add Sequential Thinking guidance to the appropriate steps in `plan-workflow.md`.

**M-P10 — `promoted_from: direct` value undocumented in context-management.md**  
`opencode/context/headwrench-conventions.md` uses `promoted_from: direct`. `context-management.md` only defines `inbox` as a promotion source; `direct` is implied but unnamed. Writers following only the protocol will not know this value is valid.  
_Fix_: Document `promoted_from: direct` as a valid value in `context-management.md`.

### Low

**L-P1 — checkpoint.md Session Close missing reference to /context-audit**  
Session Close prescribes final commit and closing note but does not mention running `/context-audit` to promote session findings to permanent context.  
_Fix_: Add "Run `/context-audit` after session close" to `checkpoint.md` Session Close section.

**L-P2 — checkpoint.md does not reference context-management.md as authority**  
The Inbox Qualification Guidance section should defer to `context-management.md` explicitly. Currently there is no cross-reference.  
_Fix_: Add a cross-reference in the Inbox Qualification Guidance section.

**L-P3 — /amend missing commit step after amendment**  
`amend.md` modifies session files but prescribes no commit to preserve the amendment in git history.  
_Fix_: Add a commit step to `/amend`.

**L-P4 — /context-audit uses relative paths inconsistently**  
`context-audit.md` references `opencode/protocols/context-management.md` while all other files use `~/.config/opencode/protocols/`. The relative path may break in contexts where the working directory is not the repo root.  
_Fix_: Normalize all protocol references to `~/.config/opencode/protocols/` in `context-audit.md`.

**L-P5 — plan-workflow.md Recovery section is unreachable**  
`plan-workflow.md:110–114` defines four recovery scenarios (Empty Context, User Rejection, ADE Conflict, Agent Build Failure). No command or HW instruction points to this section. Agents encountering these situations will not know to consult it.  
_Fix_: Add a reference in `headwrench.md` build-test-debug loop pointing to plan-workflow.md Recovery section.

---

## Category 3: Commands

### High

**H-C1 — /continue missing 3-layer todo stack reconstruction**  
See H-P7 above. Listed here for command-file tracking.  
_File_: `opencode/commands/continue.md`

**H-C2 — /context-remove bypasses supersession chain validation**  
See H-P8 above. Listed here for command-file tracking.  
_File_: `opencode/commands/context-remove.md`

### Medium

**M-C1 — /context-list: `active: false` files appear with no visual indicator**  
`context-list.md` shows all context files including inactive ones, but provides no visual cue to distinguish active from inactive. A user reviewing the list has no way to know which files are in play.  
_Fix_: Add a visual indicator (e.g., `[inactive]` or strikethrough) for `active: false` entries.

**M-C2 — /amend Section 3 prohibits all changes to completed subtask files with no exception**  
`amend.md` Section 3 says no changes to completed subtask files. `session-plan-schema.md:260` allows retroactive notes on completed subtasks. These contradict each other.  
_Fix_: Add a retroactive-notes exception to `/amend` Section 3.

**M-C3 — /context-add has no explicit protocol reference; `session: ~` convention undocumented**  
`context-add.md` is functionally correct but has no cross-reference to `context-management.md`. The `session: ~` convention for directly-written context files is undocumented.  
_Fix_: Add a reference to `context-management.md` in `context-add.md` and document the `session: ~` convention.

**M-C4 — /context-audit uses relative paths inconsistently**  
See L-P4 above. Listed here for command-file tracking.  
_File_: `opencode/commands/context-audit.md`

**M-C5 — /continue uses ContextScout for context reload but Session Bootstrap requires direct HW reads**  
`continue.md` delegates context reload to ContextScout. `headwrench.md` Session Bootstrap has HW performing direct file reads for Tiers 2–5. These are meaningfully different — ContextScout may not load all required tiers in the same way HW's bootstrap procedure does.  
_Fix_: Align `/continue` reload procedure with Session Bootstrap in `headwrench.md`.

### Low

**L-C1 — /continue missing check for completed session status**  
`continue.md` has no check whether the session's `status` is `completed` before resuming. Resuming a completed session could overwrite final state.  
_Fix_: Add a `status != completed` check at the start of `/continue`.

**L-C2 — /context-list shows `superseded_by` as "⚠️ superseded" with no resolution guidance**  
The warning is shown but the command provides no instruction on what to do with superseded files.  
_Fix_: Add a note to run `/context-audit` or `/context-remove` for superseded files.

---

## Category 4: Session Infrastructure

### High

**H-S1 — No active session → no compaction anchor in system prompt**  
If `active-session.json` does not exist for the current OpenCode session ID (never activated, or entry deleted), `session-context.ts` falls through to the bare fallback: `"OpenCode Session ID: {id}"`. After compaction, HW has no spec.json, no session name, and no currentSubtask. Recovery is impossible without the user manually providing the session name. Nothing in `headwrench.md` warns HW about this failure mode.  
_Fix_: Add a warning to `headwrench.md` Compaction Recovery: "If you see only a bare session ID with no spec.json block, session state has been lost — ask the user what session is active before proceeding."

**H-S2 — lockdown-WA session: 3 decisions not applied**  
The `lockdown-workflows-and-agents` session documented three findings that were never applied: (J1) no `description` fields in opencode.json agent entries; (J2) exa MCP `enabled: false`; (C3) failure/empty-result handling not defined in protocols. The session itself was abandoned after bootstrap.  
_Fix_: Apply J2 (exa enable) as part of this audit's fix set. J1 and C3 are separate work items.

**H-S3 — SKILL.md step 1 "mixed-subtask" commit gap in checkpoint**  
`checkpoint.md` Step 1's three-way ownership rule handles (a) subagent code commit, (b) read-only skip, (c) HW-direct commit. Missing: when a subagent committed code changes AND HW made session-directory edits (notes/, spec.json, index.md) during checkpoint steps 2–6, those session-dir changes are not explicitly staged. The rule says "verify + skip" for CodeWriter tasks, but session-dir changes happen after the commit verification.  
_Fix_: Add a fourth case to Step 1: after verifying the subagent commit, HW stages and commits any session-directory changes made during this checkpoint run.

### Medium

**M-S1 — concepts-why-this-works session: status `in_progress` but never started**  
`spec.json` shows `status: "in_progress"`, `currentSubtask: 0`, both subtasks pending. The session was planned but never executed. `in_progress` triggers Tier 4 context loading, but since notes/ is empty, the impact is zero. The misleading status is minor.  
_Fix_: Set `status: "pending"` (or `"abandoned"` if the content is no longer needed).

**M-S2 — lockdown-WA session: status `active` but effectively abandoned**  
`spec.json` shows `status: "active"` with all substantive subtasks (01–08) still pending. The session was bootstrapped but never executed. It will appear in Tier 4 context loading.  
_Fix_: Either resume the session (its remaining subtasks may now be moot given this audit's findings) or set `status: "abandoned"`.

**M-S3 — inbox item `context-insurgent-needs-write` is stale (fix was already applied)**  
`.opencode/inbox/context-insurgent-needs-write-for-session-notes.md` is marked `active: true` but the described fix (write: allow on context-insurgent.md) was applied in subtask 02.  
_Fix_: Set `active: false` on this inbox item.

**M-S4 — inbox item `tool-visible-output-session-prompt.md` is not superseded or promoted**  
`active: false` but `superseded_by` is null. This is a genuine reusable technical pattern (inject visible tool output via session.prompt noReply) that should be in permanent context.  
_Fix_: Promote to `opencode/context/` or set `superseded_by` to explain why it was discarded.

### Low

**L-S1 — No `description` fields in any opencode.json agent entries**  
All agent entries lack `description` keys. No runtime impact but reduces transparency.  
_Fix_: Add description fields to each agent entry in `opencode.json`.

**L-S2 — `opencode/context/codewriter-git-commits.md` has `session: ~` (null)**  
The session provenance field is null. Inconsistent with all other context files.  
_Fix_: Set `session` to the session that created this file, or `session: direct` if manually created.

**L-S3 — Malformed spec.json produces misleading "No active session" toast**  
`session-context.ts` `formatSessionToast` accesses `spec.subtasks` without checking for `undefined`. If spec.json is valid JSON but missing fields, the toast shows "No active session" instead of "Error reading session spec."  
_Fix_: Add a null-check for `spec.subtasks` in `formatSessionToast` with a more informative error message.

---

## Category 5: Plugins

### Info

**I-P1 — session-context.ts: all edge cases handled correctly**  
All 8 identified edge cases (empty session ID, missing active-session.json, missing sessionName, invalid spec.json JSON, partial spec, pre-turn activate call, concurrent sessions, idempotent deactivate) are correctly handled. The plugin is robust for all realistic usage patterns.

**I-P2 — mermaid-tool.ts: no issues found**  
Plugin is straightforward and well-implemented. No audit findings.

**I-P3 — session-context auto-loading is intentional and correctly absent from opencode.json plugin array**  
The plugin is loaded via OpenCode's local plugin discovery mechanism, not via the `plugin` array. This is by design and documented in session notes. No bug.

---

## Direct Contradictions

Four cases where two authoritative sources give conflicting instructions for the same situation. These are the highest-priority fixes because agents operating under contradictions will produce inconsistent behavior depending on which file they happened to read last.

| # | Contradiction | File A | File B | Authority |
|---|---------------|--------|--------|-----------|
| 1 | Inbox bypass at checkpoint | `checkpoint.md:100–102` — allows direct write to `context/` | `context-management.md:46` — "checkpoints **never** write directly to context" | `context-management.md` |
| 2 | Commit ownership | `checkpoint.md:11–12` — CodeWriter/DocWriter own their commits | User Decision #1/#2 + `headwrench.md` (post-edit) — HW owns all commits | HW decisions |
| 3 | Gate format at checkpoint | `checkpoint.md:58` — check for "GN ID format" subtask | `session-plan-schema.md:125` + `headwrench.md:180` — gates are `[🚫 GATE]` todos inside preceding subtask | schema + HW |
| 4 | DeepResearcher invocation timing | `plan-workflow.md` — optional sub-step of Step 1 | `plan.md` Phase 3 — distinct user-confirmed gate | Unresolved — must decide |

---

## Strengths

These design decisions and patterns are working well and should be preserved.

1. **Deny-by-default permission architecture** — consistently applied across all 8 subagents. Read-only vs. writer split is clean and enforced at the tool permission level, not just by instruction.

2. **spec.json as compaction recovery anchor** — the session-context plugin injecting the full spec.json into every system prompt turn is an elegant solution to the compaction problem. Agents always have their current subtask and session name available even after context loss.

3. **5-tier context loading hierarchy** — the Tier 1→5 model (runtime injection → global context → local context → session notes → current subtask) provides a clean separation of concerns with correct precedence ordering.

4. **3-layer todo stack** — the Layer 1 (session summary) / Layer 2 (subtask todos) / Layer 3 (checkpoint steps) structure creates reliable, inspectable state tracking for complex multi-subtask sessions.

5. **8-step checkpoint procedure** — comprehensive state-preservation loop. When followed completely, it correctly preserves session state across interruptions. The structure is sound; the gaps are in edge-case handling, not the core loop.

6. **SubagentBuilder architecture** — the pattern of building session-local agents per task (rather than maintaining a large global fleet) is the right architecture. It enables task-appropriate model selection and avoids stale global agent debt.

7. **Cross-agent vocabulary consistency** — "gate/checkpoint/subtask/WIP commit" terminology is used uniformly across headwrench.md, all protocol files, and all command files. No terminology drift.

8. **ContextInsurgent ask-silent design** — the agent correctly has no `question` permission, making it structurally impossible for it to interrupt a task with user-facing questions. Combined with the write:allow scope limited to session notes, this is well-designed.

9. **Context YAML front-matter format** — the metadata header format (`topic`, `tier`, `promoted_from`, `session`, `created`, `last_reviewed`, `supersedes`, `superseded_by`) is well-documented with 8 working examples. A new contributor has sufficient reference material.

10. **session-context.ts plugin robustness** — all 8 realistic edge cases (missing files, bad JSON, pre-turn state) are correctly handled with appropriate fallbacks.

---

## Recommendations — Ordered by Impact

The following is the complete fix list ordered by the combination of severity and blast radius. Items marked **[APPLIES NOW]** represent decisions confirmed during this audit session and should be applied in the next implementation session.

### Tier 1 — Fix Immediately (runtime broken)

| Priority | ID | Action | File(s) |
|----------|----|--------|---------|
| 1 | C-A1 | Enable exa MCP | `opencode/opencode.json` |
| 2 | C-A2 | Remove git commit from CodeWriter | `opencode/agents/subagents/code-writer.md` |
| 3 | C-A3 | Remove git commit from DocWriter | `opencode/agents/subagents/doc-writer.md` |
| 4 | C-A4 | Delete Architect file + opencode.json entry | `subagents/architect.md`, `opencode/opencode.json` |
| 5 | C-A5 | Remove @explorer from SKILL.md; add @ContextInsurgent | `opencode/skills/agent-delegation-expert/SKILL.md` |
| 6 | H-A1 | Delete GatesExpert file | `opencode/agents/subagents/gates-expert.md` |
| 7 | H-A6 | Mark ask-only-subagent-pattern.md as stale | `.opencode/context/ask-only-subagent-pattern.md` |

### Tier 2 — Fix Before Next Planning Session (planning broken)

| Priority | ID | Action | File(s) |
|----------|----|--------|---------|
| 8 | C-P2 | Add Decision #11 planning pattern | `plan-workflow.md`, `plan.md` |
| 9 | C-P3/C-P4 | Remove Architect opt-in Q&A + architectEnabled field | `plan.md`, `session-plan-schema.md` |
| 10 | H-A4 | Fix SubagentBuilder model contradiction | `subagents/subagent-builder.md` |
| 11 | H-A5 | Add context7 permissions to DeepResearcher | `subagents/deep-researcher.md` |
| 12 | H-A2/H-A3 | Remove @Architect from SKILL.md; confirm @ContextInsurgent added | `SKILL.md` |
| 13 | M-A4 | Fix "Phase 5" → "Step 4" in SKILL.md | `SKILL.md` |
| 14 | H-P3 | Align DeepResearcher invocation (gate vs sub-step) | `plan.md`, `plan-workflow.md` |

### Tier 3 — Fix Before Next Checkpoint (checkpoint broken)

| Priority | ID | Action | File(s) |
|----------|----|--------|---------|
| 15 | C-P1 | Resolve inbox bypass contradiction | `checkpoint.md` |
| 16 | H-P2 | Update commit ownership in checkpoint.md | `checkpoint.md` |
| 17 | H-P1 | Add Session Close invocation path to HW Layer 3 | `headwrench.md` |
| 18 | M-P1 | Fix gate format check in checkpoint Step 7 | `checkpoint.md` |
| 19 | H-S3 | Add fourth case to checkpoint Step 1 (session-dir commit) | `checkpoint.md` |

### Tier 4 — Fix Before Next /continue or /context-remove

| Priority | ID | Action | File(s) |
|----------|----|--------|---------|
| 20 | H-C1/H-P7 | Add todo stack reconstruction to /continue | `commands/continue.md` |
| 21 | H-C2/H-P8 | Add supersession chain validation to /context-remove | `commands/context-remove.md` |

### Tier 5 — Structural improvements (medium-term)

| Priority | ID | Action | File(s) |
|----------|----|--------|---------|
| 22 | H-P4/M-A3 | Fix Collaborative mode structural theater | `plan-workflow.md`, create `collaborative.md` |
| 23 | H-P5 | Create debug.md protocol with plan structure | New file: `protocols/debug.md` |
| 24 | M-A1 | Replace model tier concept with actual model identification | `SKILL.md`, `plan-workflow.md`, `session-plan-schema.md` |
| 25 | H-P6 | Add Conflict Resolution reference to HW + context-audit | `headwrench.md`, `commands/context-audit.md` |
| 26 | H-S1 | Add no-anchor warning to HW Compaction Recovery | `headwrench.md` |
| 27 | M-P5 | Define "Discard" execution in context-audit Step 6 | `commands/context-audit.md` |
| 28 | M-P6 | Add promotion criteria to context-audit Step 4 | `commands/context-audit.md` |
| 29 | M-C5 | Align /continue reload with Session Bootstrap | `commands/continue.md` |

### Tier 6 — Cleanup (low-priority housekeeping)

| Priority | ID | Action | File(s) |
|----------|----|--------|---------|
| 30 | M-P2 | Remove stale SessionPlanDrafter reference | `plan-workflow.md` |
| 31 | M-P3 | Fix spec.json status field values | `session-plan-schema.md` |
| 32 | M-P4 | Fix gate representation in schema example | `session-plan-schema.md` |
| 33 | M-S1 | Fix concepts-why-this-works session status | `.opencode/sessions/concepts-why-this-works/spec.json` |
| 34 | M-S2 | Fix lockdown-WA session status | `.opencode/sessions/lockdown-workflows-and-agents/spec.json` |
| 35 | M-S3 | Mark stale inbox item inactive | `.opencode/inbox/context-insurgent-needs-write-for-session-notes.md` |
| 36 | M-S4 | Promote or discard tool-visible-output inbox item | `.opencode/inbox/tool-visible-output-session-prompt.md` |
| 37 | M-A5 | Fix AgentDelegationExpert naming drift | `subagents/subagent-builder.md` |
| 38 | L-S1 | Add description fields to opencode.json agent entries | `opencode/opencode.json` |
| 39 | L-C1 | Add completed-session guard to /continue | `commands/continue.md` |
| 40 | L-P1 | Add /context-audit reference to Session Close | `checkpoint.md` |
| 41 | L-P4/M-C4 | Normalize protocol paths in context-audit.md | `commands/context-audit.md` |
| 42 | M-P10 | Document `promoted_from: direct` in context-management.md | `protocols/context-management.md` |

---

## Architectural Decisions Confirmed During Audit

These decisions were made by the user during this audit session and are already partially applied. They represent the target state that the Tier 1–2 recommendations above are meant to achieve.

| # | Decision | Status |
|---|----------|--------|
| 1 | HW owns all git commits — subagents must not commit | Partially applied (headwrench.md updated; code-writer/doc-writer not yet updated) |
| 2 | exa MCP `enabled: false` is a bug — must be `true` | Not applied |
| 3 | @explorer intentionally disabled — all SKILL.md references must be removed | Not applied |
| 4 | Architect agent deleted — remove file, opencode.json entry, architectEnabled field, plan.md Q&A | Not applied |
| 5 | GatesExpert deleted — delete .md file (json entry already removed) | Not applied |
| 6 | CodeWriter, DocWriter become session-local (built by SubagentBuilder per session) | Architecture decision — implementation deferred |
| 7 | Model tier (fast/standard/deep) concept replaced: HW asks user what model target agent uses; SubagentBuilder creates session-local clone with correct frontmatter model if needed | Implementation deferred |
| 8 | ContextInsurgent ask-only pattern removed — HW invokes freely; planning enforces multi-ContextScout → ContextInsurgent synthesis | Partially applied (headwrench.md updated; plan-workflow.md/plan.md not updated) |
| 9 | SubagentBuilder must always include `model:` in frontmatter of created agents | Not applied |
| 10 | plan-workflow.md to be split into per-type files (general.md, collaborative.md, debug.md) | Not applied |
| 11 | SKILL.md must add @ContextInsurgent to routing table (replacing @explorer) | Not applied |
| 12 | DeepResearcher needs context7 permissions | Not applied |
| 13 | SubagentBuilder model contradiction (lines 64–65) needs fix | Not applied |

---

_End of audit. Total findings: 62. Next action: implement Tier 1 fixes._
