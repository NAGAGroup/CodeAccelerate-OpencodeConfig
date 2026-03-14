# Protocol Analysis — Subtask 03 Findings

_Date: 2026-03-13_
_Source: ContextInsurgent deep analysis — HW export_

---

## Files Examined

| File | Summary |
|------|---------|
| `opencode/protocols/checkpoint.md` | 8-step checkpoint procedure, build-test-debug loop, session close, inbox qualification guidance |
| `opencode/protocols/plan-workflow.md` | 8-step planning workflow, invariants, agent roles table, recovery scenarios |
| `opencode/protocols/session-plan-schema.md` | spec.json schema, index.md spec, subtask-NN spec, delegation sizing, context loading, session summary todo |
| `opencode/protocols/context-management.md` | 5-tier context hierarchy, inbox/archive definitions, metadata headers, staleness rules, /context-audit 7-step procedure |
| `opencode/commands/` — all 10 files | plan, continue, amend, context-add, context-audit, context-list, context-remove, activate-session, deactivate-session, session-status |
| `opencode/agents/headwrench.md` | Primary orchestrator: /plan summary, session bootstrap, compaction recovery, todo layers, delegation rules |
| Prior notes: 01-surface-sweep.md, 02-agent-analysis.md | Prior findings for context |

---

## Q1 — Checkpoint Completeness

**Verdict**: The 8-step procedure covers the core state-preservation loop well, but has five concrete gaps and two ambiguities creating unsafe edge cases.

---

### Findings

**[Critical] — Step 7 gate format is inconsistent with the rest of the system**
`checkpoint.md:58`: "if the next subtask has an ID format of `GN` or is prefixed with `[🚫 GATE]`"

The actual gate format per `session-plan-schema.md` (lines 125–127), `headwrench.md` (line 180), and `amend.md` (section 4) is: gates live **inside the preceding subtask's `## Todolist`** as `[🚫 GATE]` todo items — they are NOT standalone subtask rows with `GN` IDs. The checkpoint step describes checking a subtask ID format ("GN") that doesn't match how gates are actually represented at runtime (Layer 2 todos). This creates inconsistency in how a gate is detected at checkpoint time vs. how it's represented in the plan.

**[High] — Session Close section is not referenced anywhere in HW instructions**
`checkpoint.md:86–92`: "When all subtasks are finished: Final Commit (not WIP)..."

`headwrench.md` Layer 3 checkpoint todos (lines 87–94) list 8 fixed steps but none says "when this is the final subtask, use Session Close procedure instead of WIP commit." An agent following HW's Layer 3 steps would create a WIP commit at the end of the last subtask instead of a properly-named final commit. **The Session Close behavior is protocol-only — invisible to the operating agent.**

**[High] — Step 1 mixed-subtask blind spot (subagent commit + HW session file edits)**
`checkpoint.md:11–14` (3-way ownership rule): Rule handles (a) implementation subagents — verify commit; (b) read-only subtasks — skip; (c) HW-direct edits — commit. Missing case: a subagent committed code changes, but HW also modified session infrastructure files (notes/, spec.json, index.md) as part of the checkpoint steps 2–6. Step 1 says "verify + skip" for CodeWriter tasks — but session dir changes made during checkpoint happen AFTER the commit verification. No explicit step to commit these session-directory-only changes after the subagent's code commit.

**[High] — Step 6 contradicts context-management.md on direct-to-context writes**
`checkpoint.md:100–101`: "Obvious destination + clearly reusable → Write directly to context/ (these will have YAML headers with `promoted_from: direct`)."
`context-management.md:46`: "**Checkpoints always write to the inbox (staging), never directly to context.** Human review via `/context-audit` is what moves items into permanent context."

Direct contradiction between protocols. `context-management.md` must be the authority; checkpoint.md's "Inbox Qualification Guidance" section must be updated to align.

**[Medium] — "Significant findings" threshold is undefined (Step 5)**
`checkpoint.md:33`: "Identify any significant findings, decisions, or discoveries from this subtask."
No criteria define what qualifies as "significant." Compare to Step 6's detailed "Inbox Qualification Guidance" — Step 5 has no equivalent.

**[Medium] — Circuit breaker counting "consecutive" not defined (Step 8)**
`checkpoint.md:67`: "If the last N subtasks failed..."
"Consecutive" is implied but absent from the protocol. `headwrench.md:176` says "N consecutive failures" — but this wording lives only in headwrench.md, not in the protocol that defines the rule.

**[Low] — Session Close: no mention of running /context-audit afterwards**
`checkpoint.md:88–91` (Session Close): Prescribes final commit + index.md/spec.json updates + closing note. Missing: any mention that session archival requires a subsequent `/context-audit` run.

---

## Q2 — Session Schema vs. Reality

**Verdict**: Five meaningful inconsistencies with current architectural decisions; one schema gap on status values.

---

### Findings

**[Critical] — `architectEnabled` field in spec.json is a dead field**
`session-plan-schema.md:49`: `"architectEnabled": boolean`
`plan.md:50`: "Architect opt-in..."

Per Decision #6 (subtask 02): Architect agent is deleted. The field + Q&A question in plan.md must both be removed.

**[High] — Model tier language is baked into the required subtask file format**
`session-plan-schema.md:81–84`: `## Delegation — **Model tier:** [fast / standard / deep — with specific model identifier]`

Per Decision #9 and subtask 02 Q7: model tier concept is broken — tiers (fast/standard/deep) are no-ops at runtime. Both the subtask-NN template and the index.md table description need to replace tier language with actual model identifier requirements.

**[High] — plan.md adds Phase 3 (Research) that plan-workflow.md omits**
`plan.md:80–83` (Phase 3 — Research): Makes research a distinct user-confirmed gate.
`plan-workflow.md`: Treats DeepResearcher as optional sub-step of Step 1. These are materially different flows — plan.md and plan-workflow.md diverge structurally here.

**[Medium] — spec.json `status` field missing `pending` value**
`session-plan-schema.md:46`: `"status": "string" // in_progress | complete`
But context-loading rules in both context-management.md and session-plan-schema.md itself assume `pending` as a valid value. Also: `complete` vs. `completed` inconsistency within the same document.

**[Medium] — Gate representation is ambiguous between index.md and spec.json**
`session-plan-schema.md:28–29`: `🚫 GATE` shown as a valid status row in index.md.
`amend.md:58–60`: "Do NOT create synthetic standalone task rows for gates."
The schema's example table representation contradicts the gate format rule in amend.md.

**[Low] — plan.md Phase 7 commit step is absent from plan-workflow.md**
`plan.md:129`: Commit step for session files.
`plan-workflow.md:78–83` (Step 7 Finalization): No commit step mentioned.

**[Low] — plan.md Phase 8 calls `activate_session` tool; plan-workflow.md has no such step**
`plan.md:140`: Call `activate_session` tool.
`plan-workflow.md:85–88` (Step 8): No mention of this tool call.

---

## Q3 — Context Management Promotion Pipeline

**Verdict**: One critical contradiction between protocols, three underspecified edge cases, two "trap" patterns.

---

### Findings

**[Critical] — Direct contradiction on inbox bypass**
`context-management.md:46`: "Checkpoints always write to the inbox (staging), never directly to context."
`checkpoint.md:100–102`: "Obvious destination + clearly reusable → Write directly to context/."
See Q1 finding above for full detail. `context-management.md` is the authority.

**[High] — Discard action in /context-audit Step 6 is undefined**
`context-audit.md:37`: "Discard — mark superseded, no promotion"
`context-audit.md:58–63`: Step 6 execution lists inbox promotion, archival, retrofits — does NOT define what "Discard" does. Should it delete the inbox file? Set `active: false`? Set `superseded_by: discarded`? Agents executing a discard will have to guess.

**[High] — Promotion candidate criteria undefined (context-audit.md Step 4)**
Neither context-audit.md nor context-management.md defines what makes a note a promotion candidate or how HIGH/MEDIUM/LOW priority is determined. Agent is expected to use heuristic judgment for the most consequential context management decision.

**[Medium] — `[CONTEXT-REVIEW]` flag: behavior when `last_reviewed` is absent**
`context-management.md:92`: `last_reviewed` is not required.
If absent, the 90-day check cannot run. Neither protocol specifies whether a file with no `last_reviewed` should be flagged, or what baseline date to use.

**[Medium] — Trap: "Promoted-then-archive" creates unreviewed inbox obligation**
`context-audit.md:63` (Step 6): "Promoted-then-archive: Create an inbox item for selected session-note findings, then archive the source session note."
This creates NEW inbox items during the audit that will appear in the NEXT audit run. No warning to users.

**[Medium] — Trap: superseded inbox items accumulate indefinitely**
"Optional cleanup" for superseded inbox items is undefined — no execution path handles deletion or deactivation of permanently-superseded files.

---

## Q4 — Command/Protocol Alignment

**Verdict**: Six of ten commands have protocol alignment issues.

---

### Command Analysis

#### `/activate-session` — **Clean**

#### `/deactivate-session` — **Clean**

#### `/session-status` — **Clean (intentional)**

#### `/amend` — **Two gaps**
- **[Medium]** Missing commit step after amendment
- **[Low]** Section 3 prohibits all changes to completed subtask files — no retroactive-notes exception (contradicts session-plan-schema.md:260)

#### `/context-add` — **Functionally correct, implicit coupling**
- **[Medium]** No explicit protocol reference; `session: ~` convention for directly-written context undocumented

#### `/context-audit` — **Mostly aligned**
- **[Medium]** Relative path references (`opencode/protocols/context-management.md`) vs. `~/.config/opencode/protocols/` everywhere else
- **[Low]** Step 3 "single question tool call" batching not described in protocol

#### `/context-list` — **Functional but uncoupled**
- **[Medium]** `active: false` files appear in list with no visual indicator
- **[Low]** `superseded_by` shown as "⚠️ superseded" but no guidance for resolution

#### `/context-remove` — **Potentially dangerous**
- **[High]** Hard deletion without supersession chain validation — bypasses intended controlled-deletion via `/context-audit`
- **[High]** No check for `supersedes:` chain integrity — deleting a file with `supersedes: old-file.md` leaves old file with stale `superseded_by:` pointer, causing ContextScout to skip it forever (silent data loss)
- **[Medium]** No distinction between deleting active vs. already-superseded file

#### `/continue` — **High severity gaps**
- **[High]** No instruction to rebuild 3-layer todo stack — agent following only continue.md starts executing without Layer 2/Layer 3 todos
- **[Medium]** ContextScout used for reload but Session Bootstrap has HW doing direct reads — meaningful divergence in what "reload" means vs. what bootstrap requires
- **[Low]** No check whether session `status` is `completed` before resuming

#### `/plan` — **Multiple critical divergences**
- **[Critical]** Phase 2 "Architect opt-in" question references deleted Architect agent — must remove together with `architectEnabled` field
- **[High]** Phase 3 (Research) is distinct numbered phase in plan.md but absent from plan-workflow.md
- **[High]** Decision #11 (HW globs/greps → parallel ContextScouts → ContextInsurgent synthesis) not reflected in plan.md or plan-workflow.md
- **[Medium]** Phase/Step numbering inconsistency — plan.md uses "Phase" labels; plan-workflow.md uses "Step" labels; insertion of Phase 3 offsets all numbers after 2.5
- **[Medium]** plan.md Phase 7 commit step missing from plan-workflow.md Step 7
- **[Medium]** plan.md Phase 8 `activate_session` call missing from plan-workflow.md Step 8
- **[Low]** plan-workflow.md:91 stale "SessionPlanDrafter" comment in Invariants

---

## Q5 — Plan Workflow Completeness

**Verdict**: Three major completeness gaps.

---

### Findings

**[Critical] — Decision #11 ContextInsurgent enforcement pattern is entirely absent**
Confirmed user decision from subtask 02 Q2, Decision #11:
> New workflow rule for planning: HW globs/greps project for rough layout → dispatches multiple ContextScouts in parallel → uses findings to delegate to ContextInsurgent for synthesis.

Neither `plan-workflow.md` nor `plan.md` mentions:
- HW performing preliminary globs/greps before dispatching ContextScout
- Multiple parallel ContextScout dispatches
- ContextInsurgent synthesis as an intermediate step before Q&A

This is the most significant gap in plan-workflow.md.

**[High] — Collaborative preferences are collected but structurally inert**
`plan-workflow.md` and `plan.md` collect for Collaborative sessions:
- Involvement level (approve every subtask / review changes / mostly hands-off)
- User-owned decisions
- Pause cadence

None of these flow anywhere:
- `spec.json` has no field for any collaborative preference
- No subtask annotation scheme for "user-owned decisions"
- No protocol step checks "pause before this subtask?" during execution
- No gate insertion rule ties pause cadence preference to gate placement

The branching produces a richer Q&A but produces an **identical plan artifact**. This is confirmed by user feedback (subtask 01 Gate 1).

**What would make collaborative branching meaningful:**
A `collaborative.md` per-type file must define:
1. A new `spec.json` field: `"collaborativeMode": { "phasePauseEnabled": boolean, "involvementLevel": "approve-each|review-changes|hands-off" }`
2. Mechanism to annotate subtasks as "user-decision required" (e.g., `## User Decision` section)
3. Plan-drafting rule that gates are inserted before each subtask when `phasePauseEnabled: true`

**[High] — Debug session has no structural plan-drafting guidance**
The debug Q&A collects: symptom, last known good, prior attempts, suspected components, reproduction test, regression test. But there is no guidance on how these shape the plan structure. A good debug plan needs: (1) Reproduce → (2) Diagnose → (GN) Gate: hypothesis approved → (3) Fix → (4) Regression test. None of this structure is prescribed. `debug.md` must provide it.

**[Medium] — DeepResearcher invocation timing is unresolved between protocol and command**
plan-workflow.md (Step 1): DeepResearcher is optional, invoked if "situational report indicates missing technical knowledge."
plan.md (Phase 3): DeepResearcher invoked by asking user explicitly before plan drafting. Different triggers, different positions in flow.

**[Medium] — Sequential Thinking use in planning not mentioned in plan-workflow.md**
`plan.md:67` and `plan.md:87` explicitly require Sequential Thinking for Q&A synthesis and subtask breakdown. `plan-workflow.md`: No mention anywhere. The requirement lives only in the command.

### Per-Type Split Boundaries (informational)

**What stays in `plan-workflow.md`:**
- Steps 1, 1.5, 2.5 (checkpoint approval), 3–8, invariants, recovery
- Explicit pointer: "After type detection, read `~/.config/opencode/protocols/{type}.md` for type-specific Q&A"

**What moves to `general.md`:** Full base Q&A question list

**What moves to `debug.md`:** Base Q&A + 6 debug questions + hypothesis-driven subtask structure guidance + gate-after-diagnosis rule

**What moves to `collaborative.md`:** Base Q&A + 3 collaborative questions + the structural fixes listed above

**Base Q&A duplication strategy:** Each per-type file should be self-contained (full Q&A base + type-specific additions) for safety when agents read individual files in isolation.

---

## Q6 — Protocol Cross-Consistency

**Verdict**: One critical direct contradiction, two stale references, one structural naming inconsistency, several missing cross-references.

---

### Contradictions

**[Critical] — checkpoint.md vs. context-management.md on direct-to-context writes**
See Q1 and Q3 above. `context-management.md` is the authority.

**[High] — Commit ownership: checkpoint.md + headwrench.md vs. decided direction**
`checkpoint.md:11–12` + `headwrench.md:160–161`: CodeWriter/DocWriter own their commits.
Decision #1/#2 (subtask 02): HW owns ALL commits — subagents must not commit.
Both checkpoint.md and headwrench.md need coordinated updates.

### Stale Cross-References

**[High] — `architectEnabled` in session-plan-schema.md references deleted Architect**
`session-plan-schema.md:49,65`: Field + description referencing @Architect.
`plan-workflow.md` (Step 2) + `plan.md` (Phase 2): "Architect opt-in" Q&A.
All three sources need synchronized removal.

**[Low] — `plan-workflow.md:91` "SessionPlanDrafter" stale reference**
Per Decision #16: remove this comment.

### Structural Naming Inconsistency

**[Medium] — "Phase" (plan.md) vs. "Step" (plan-workflow.md) numbering**
plan.md uses "Phase 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8"
plan-workflow.md uses "Step 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8"

They nominally parallel but diverge because plan.md inserts "Phase 3 — Research" that plan-workflow.md doesn't have, offsetting all subsequent numbers by one. This caused SKILL.md "Phase 5" vs. "Step 4" confusion (flagged in subtask 01/02).

### Missing Cross-References

**[Medium] — checkpoint.md does not reference context-management.md**
checkpoint.md's Inbox Qualification Guidance section should defer to context-management.md as the authority.

**[Medium] — checkpoint.md Session Close should reference /context-audit**
Session Close section missing: "After session close, run `/context-audit`."

---

## Q7 — Utilization Gaps (Dead Protocol Sections)

**Verdict**: Five protocol sections entirely unreachable from headwrench.md or any command file.

---

**[High] — checkpoint.md "Session Close" section**
Layer 3 checkpoint todos have no conditional branching to Session Close. Agents will use WIP commit on the final subtask instead of a properly-named final commit.

**[High] — context-management.md "Conflict Resolution" section**
`context-management.md:132–139`: No command, HW instruction, or other protocol references it. Agents encountering a contradiction have no instruction to consult this section.

**[Medium] — plan-workflow.md "Recovery" section**
`plan-workflow.md:110–114`: Four recovery scenarios (Empty Context, User Rejection, ADE Conflict, Agent Build Failure). No command or HW instruction points here.

**[Medium] — context-management.md "Example Workflows" section**
`context-management.md:306–329`: Three worked examples. No command or HW instruction references them.

**[Low] — checkpoint.md "Inbox Qualification Guidance" — not explicitly invoked in HW**
HW Layer 3 todo #6 says "write inbox" but doesn't instruct HW to consult the qualification section.

---

## Summary Table

| Severity | Count | Primary Sources |
|----------|-------|----------------|
| Critical | 4 | Q1-inbox-contradiction, Q2-architectEnabled, Q4-plan.md-architect-question, Q5-decision11-absent |
| High | 14 | Q1-session-close-dead, Q1-mixed-subtask-commit, Q2-model-tier-in-schema, Q2-phase3-divergence, Q4-context-remove-chain, Q4-continue-todos, Q4-plan-phase3, Q5-collaborative-inert, Q5-debug-no-structure, Q7-session-close-dead, Q7-conflict-resolution-dead, Q6-commit-ownership |
| Medium | 18 | Spread across all Q sections |
| Low | 12 | Spread across all Q sections |

---

## Top 10 Priority Fixes

1. **Resolve inbox bypass contradiction** (`checkpoint.md` vs. `context-management.md`) — affects every checkpoint run
2. **Remove `architectEnabled` from spec.json schema and plan.md Q&A** — affects every new session plan
3. **Add Decision #11 pattern to plan-workflow.md** (HW globs/greps → parallel ContextScouts → ContextInsurgent synthesis)
4. **Fix Session Close dead-section** — add invocation path from HW Layer 3 checkpoint todos
5. **Replace model tier language in schema** with actual model identifier requirements
6. **Fix gate format inconsistency** in checkpoint.md step 7 (GN ID check vs. embedded [🚫 GATE] todos)
7. **Add supersession chain validation to /context-remove**
8. **Add todo stack reconstruction to /continue**
9. **Remove stale "SessionPlanDrafter" note** from plan-workflow.md invariants
10. **Define "discard" execution in context-audit.md Step 6**
