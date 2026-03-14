# Session & Plugin Infrastructure Analysis — Subtask 04 Findings

_Date: 2026-03-13_
_Source: ContextInsurgent deep analysis — sequential thinking pass_

---

## Files Examined

| File | Summary |
|------|---------|
| `opencode/plugins/session-context.ts` | Plugin implementing session-status toast, system prompt injection of spec.json, activate/deactivate tools |
| `opencode/plugins/mermaid-tool.ts` | Plugin providing render_mermaid tool (ascii/svg/markdown) |
| `opencode/opencode.json` | Runtime config: agents, model assignments, MCP config, compaction settings |
| `.opencode/sessions/lockdown-workflows-and-agents/spec.json` | Session spec — status: active, currentSubtask: 1, all subtasks 01–08 pending |
| `.opencode/sessions/lockdown-workflows-and-agents/index.md` | Full session plan with 4 gates, scope, invariants |
| `.opencode/sessions/lockdown-workflows-and-agents/notes/workflow-decisions.md` | 4 workflow design decisions (SessionPlanDrafter retirement, plan flow, ADE read-only, DeepResearcher web-only) |
| `.opencode/sessions/lockdown-workflows-and-agents/notes/agent-audit.md` | Per-file audit of 13 agent/command files; priority findings |
| `.opencode/sessions/lockdown-workflows-and-agents/notes/checkpoint-audit.md` | Checkpoint protocol gap analysis; 5 priority findings |
| `.opencode/sessions/lockdown-workflows-and-agents/notes/opencode-json-audit.md` | Per-agent opencode.json audit; model/permission discrepancies |
| `.opencode/sessions/concepts-why-this-works/spec.json` | Session spec — status: in_progress, currentSubtask: 0, both subtasks pending |
| `.opencode/sessions/concepts-why-this-works/index.md` | 2-subtask session to add CONCEPTS.md section — never started |
| `.opencode/sessions/concepts-why-this-works/notes/` | Empty directory — no notes written |
| `opencode/agents/headwrench.md` | Primary orchestrator — full current content |
| `opencode/agents/subagents/context-insurgent.md` | Deep exploration agent with write: allow scoped to session notes |
| `opencode/agents/subagents/deep-researcher.md` | Web-only research agent — no "read project files" instruction present |
| `opencode/agents/subagents/code-writer.md` | Implementation agent — still has git commit instruction (line 49) |
| `opencode/agents/subagents/doc-writer.md` | Doc agent — still has git commit instruction (line 44) |
| `opencode/agents/subagents/subagent-builder.md` | Agent generator — write: allow, model contradiction still present (lines 64–65) |
| `opencode/agents/subagents/architect.md` | Deep reasoning agent — still exists; user decision to delete not applied |
| `opencode/agents/subagents/gates-expert.md` | Gate analysis agent — file still exists; opencode.json entry removed |
| `opencode/skills/agent-delegation-expert/SKILL.md` | Delegation skill — still has @explorer, @Architect, and broken tier language |
| `opencode/context/` | Global context (Tier 2) — 5 files: agent-ignore-header, codewriter-git-commits, docwriter-format-autonomy, headwrench-conventions, primary-vs-subagent-permission-model |
| `.opencode/context/` | Local context (Tier 3) — 3 files: ask-only-subagent-pattern (STALE), only-codewriter-needed-permission-fix, opencode-global-config-is-symlink |
| `.opencode/inbox/` — all 15 files | See Q6 for per-item analysis |
| Prior notes 01–03 | Referenced by section; not repeated here |

---

## Q1 — Compaction Survival

### Data Flow

```
plugin.experimental.chat.system.transform fires on every turn
  → reads .opencode/session-ids/{sessionID}/active-session.json
  → if sessionName found: reads .opencode/sessions/{sessionName}/spec.json
  → injects full raw spec.json JSON into system prompt as:
      "## Active Session State\nOpenCode Session ID: {id}\nActive Plan: {name}\n\n```json\n{rawJSON}\n```"
```

### What Gets Injected

The spec.json block contains:
- `name`, `goal`, `status`, `currentSubtask`, `subtaskCount`
- `architectEnabled`, `circuitBreakerThreshold`
- `scopeIn`, `scopeOut`, `invariants`, `gitWorkflow`
- `subtasks[]` — each with `id`, `name`, `description`, `status`

### What HW Needs to Recover vs. What's Available

| Recovery Need | Available in Injected Spec? | Source |
|--------------|----------------------------|--------|
| Session name (to find files) | ✅ Yes — `name` field | Injected directly |
| Current subtask number | ✅ Yes — `currentSubtask` | Injected directly |
| Session goal | ✅ Yes — `goal` field | Injected directly |
| Subtask descriptions | ✅ Yes — `subtasks[]` | Injected directly |
| Path to subtask file | ✅ Derivable — `subtask-{id}-{name}.md` | Derived from subtask array |
| Current subtask Todolist | ❌ Not injected | Must re-read `subtask-NN-{name}.md` |
| Tier 2–4 context (notes, global/local context) | ❌ Not injected | Must re-read per recovery protocol |
| 3-layer todo stack state | ❌ Not injected | Must reconstruct from spec + subtask file |

### Assessment

**[Medium] — Compaction recovery is adequate but requires active HW cooperation.**

The spec.json injection is the correct recovery anchor — it provides the minimum information needed to navigate to the right subtask file. The `headwrench.md` Compaction Recovery section (lines 64–72) explicitly accounts for the gaps by instructing HW to read the subtask file and reload Tier 2–4 context after seeing the injected spec.

**[High] — Critical gap: no active session = no anchor at all.**

If `active-session.json` does not exist for the current OpenCode session ID (session was never activated, or the session-ids entry was deleted), the system transform falls through to the bare fallback: `"OpenCode Session ID: {id}"`. HW has **no spec.json, no session name, no currentSubtask** in context. After compaction, recovery is impossible without the user manually providing the session name.

This is a silent gap — nothing in headwrench.md warns HW that "if you see only a bare session ID in context, you may have lost all session state and must ask the user what session is active."

**[Medium] — spec.json reflects last checkpoint state, not mid-subtask state.**

`currentSubtask` in spec.json is only updated at checkpoint (Layer 3 step 3). If compaction fires mid-subtask, `currentSubtask` may point to the correct subtask but HW has no record of how far into the subtask's Todolist execution had progressed. HW's recovery procedure (step 6: "Resume work at whatever step was in progress") cannot determine the progress point from spec.json alone. It will need to infer from git log or prior WIP commits.

**[Low] — Injected spec is read-only; tool state not preserved.**

The activate_session and deactivate_session tool results are not preserved across compaction. Post-compaction, the tools still work correctly because they read from disk (active-session.json), not from in-memory state. Not a real risk.

---

## Q2 — lockdown-WA Application Status

### Session State

`spec.json` shows: `status: "active"`, `currentSubtask: 1`, subtask 00 = completed, subtasks 01–08 = pending. The session was bootstrapped and planning artifacts (notes/) were created, but **all substantive work subtasks were never executed.** The session is effectively abandoned at bootstrap stage.

The decisions documented in the notes were applied (or not applied) through **subsequent sessions**, not through lockdown-WA's own execution pipeline.

### Decision Tracking

#### From workflow-decisions.md

| Decision | Description | Status | Evidence |
|----------|-------------|--------|---------|
| D1 | Delete SessionPlanDrafter (file + json entry + HW ref + plan.md) | **APPLIED** | No `session-plan-drafter.md` found; no entry in opencode.json; headwrench.md has no SPD reference |
| D2 | Correct /plan workflow (HW writes plan, ADE recommends, SB for new agents) | **PARTIALLY APPLIED** | headwrench.md lines 20–28 match the basic flow; but multi-ContextScout → ContextInsurgent enforcement (Decision #11 per 02-agent-analysis.md) absent from both headwrench.md and plan-workflow.md |
| D3 | AgentDelegationExpert is read-only recommender (skill only, no file) | **APPLIED** | ADE exists only as `opencode/skills/agent-delegation-expert/SKILL.md`; no subagents/agent-delegation-expert.md exists |
| D4 | DeepResearcher is web-only; remove "read project files" instruction | **APPLIED** | deep-researcher.md line 22: "You research and report. You never modify files." No "read project files" instruction present |

#### From agent-audit.md Priority Findings

| Finding | Description | Status | Evidence |
|---------|-------------|--------|---------|
| A1 | DeepResearcher permission gap (grant read/glob) | **N/A** | Superseded by D4 — intentionally web-only; permission grant was wrong fix |
| A2 | SubagentBuilder needs write permission | **APPLIED** | `subagent-builder.md` frontmatter line 7: `write: allow` |
| A3 | SessionPlanDrafter needs write permission | **N/A** | SPD retired (D1) |

#### From opencode-json-audit.md Priority Findings

| Finding | Description | Status | Evidence |
|---------|-------------|--------|---------|
| J1 | Missing `description` fields for all agents | **NOT APPLIED** | opencode.json has no `description` key in any agent entry |
| J2 | exa MCP `enabled: false` is a bug | **NOT APPLIED** | `opencode.json:71`: `"enabled": false` — unchanged |
| J3 | SessionPlanDrafter entry must be removed | **APPLIED** | No `subagents/session-plan-drafter` entry in opencode.json |
| J4 | DeepResearcher "read project files" instruction | **APPLIED** | Instruction removed (see D4) |
| J5 | SubagentBuilder model upgrade (gemini-flash → sonnet) | **APPLIED** | `opencode.json:38`: `"github-copilot/claude-sonnet-4.6"` |
| J6 | SubagentBuilder needs write permission | **APPLIED** | Frontmatter write: allow |
| J7 | AgentDelegationExpert edit lockout is intentional | **APPLIED** | ADE has no .md file; skill-only architecture enforces this |
| J8 | Architect model `opencode/claude-opus-4-6` documentation mismatch | **PARTIALLY APPLIED** | opencode.json uses `github-copilot/claude-opus-4.6`; agent slated for deletion but not yet deleted |
| J9 | `compaction` agent missing .md file | **NOT APPLICABLE** | System config, not a delegate — no .md expected |

#### From checkpoint-audit.md Priority Findings

| Finding | Description | Status | Evidence |
|---------|-------------|--------|---------|
| C1 | No global protocol file (checkpoint.md) | **APPLIED** (different session) | `opencode/protocols/checkpoint.md` exists and is referenced by headwrench.md |
| C2 | Circuit breaker absent from protocol | **PARTIALLY APPLIED** | headwrench.md line 175 documents circuit breaker; protocol gap confirmed in 03-protocol-analysis.md Q1 |
| C3 | Failure/empty-result handling not defined | **NOT APPLIED** | Confirmed gap per 03-protocol-analysis.md Q1 |
| C4 | Session close procedure undefined | **PARTIALLY APPLIED** | Session Close section exists in checkpoint.md but is unreachable — dead section per 03-protocol-analysis.md Q7 |
| C5 | headwrench.md references non-existent protocol path | **APPLIED** | headwrench.md uses `~/.config/opencode/protocols/checkpoint.md` which resolves correctly via symlink |
| C6 | headwrench.md stale SessionPlanDrafter reference | **APPLIED** | No SPD mention in headwrench.md |

#### From 02-agent-analysis.md m0104 Decisions (NOT lockdown-WA, but relevant comparison)

These are decisions made within the **opencode-config-audit** session and have NOT been applied to production files yet. They are the deliverable of this audit, not prior work. See 02-agent-analysis.md for full list.

Key unapplied decisions from this audit:
- **[Critical]** CodeWriter git commit instruction not removed (`code-writer.md` line 49)
- **[Critical]** DocWriter git commit instruction not removed (`doc-writer.md` line 44)
- **[Critical]** Architect not deleted (`architect.md` + opencode.json entry both remain)
- **[Critical]** GatesExpert file not deleted (`gates-expert.md` remains; json entry was removed)
- **[Critical]** exa MCP still disabled (`opencode.json:71`)
- **[High]** SKILL.md still has `@explorer` routing (line 18), `@Architect` (line 19), and broken tier language (lines 25–27)
- **[High]** SubagentBuilder contradiction at lines 64–65 (tier recommendation + "don't include model") not resolved

### Summary

The lockdown-WA session produced planning notes and decisions that were PARTIALLY applied through subsequent sessions. The session itself was abandoned after bootstrap. 12 of its documented decisions are Applied or N/A. 3 remain Not Applied (description fields, exa MCP enabled, failure handling). The more significant unapplied changes come from the subsequent `opencode-config-audit` audit itself.

---

## Q3 — Stale Session Health: concepts-why-this-works

**Spec.json state:**
- `status: "in_progress"`
- `currentSubtask: 0` (pre-task-01 — never started)
- subtask 01 (write-section): pending
- subtask 02 (final-commit): pending
- `notes/` directory: empty

**[Medium] — Status field is technically incorrect.**

`status: "in_progress"` implies the session has begun execution. `currentSubtask: 0` and both subtasks at `pending` indicate it was never started — the session was planned and bootstrapped but not executed. The status should be `pending` (not yet started) rather than `in_progress`.

**[Low] — Tier 4 context loading impact is zero.**

headwrench.md Session Bootstrap line 53 loads notes from sessions with `status: in_progress`. This session matches that filter — but its notes directory is empty, so nothing harmful is loaded. The impact on future sessions is negligible.

**[Low] — Not safe to resume without checking CONCEPTS.md first.**

The session goal is to add a "Why This Works" section to `docs/CONCEPTS.md`. Before resuming, verify that section doesn't already exist (it may have been added manually or by another session). The subtask files exist and are complete — resuming is low-risk if the section is confirmed missing.

**Verdict**: Safe to leave as-is in the short term. Zero notes pollution. The misleading `in_progress` status is minor — affects Tier 4 context loading rule lookup but not actual content. Recommend: either execute the session (it's a simple 2-subtask doc task) or close it as abandoned with `status: "abandoned"` if the content is no longer needed.

---

## Q4 — opencode.json Completeness

### Agent File ↔ opencode.json Registration Matrix

| Agent File | In opencode.json? | Decision Status |
|-----------|-------------------|-----------------|
| `headwrench.md` | ✅ Yes | — |
| `subagents/context-scout.md` | ✅ Yes — `github-copilot/claude-haiku-4.5` | — |
| `subagents/context-insurgent.md` | ✅ Yes — `github-copilot/claude-sonnet-4.6` | — |
| `subagents/deep-researcher.md` | ✅ Yes — `github-copilot/claude-haiku-4.5` | — |
| `subagents/subagent-builder.md` | ✅ Yes — `github-copilot/claude-sonnet-4.6` | — |
| `subagents/code-writer.md` | ✅ Yes — `opencode/gpt-5.3-codex` | — |
| `subagents/doc-writer.md` | ✅ Yes — `github-copilot/claude-haiku-4.5` | — |
| `subagents/architect.md` | ✅ Yes — `github-copilot/claude-opus-4.6` | **[Critical]** User Decision #6: DELETE both file and json entry — NOT APPLIED |
| `subagents/gates-expert.md` | ❌ Not in opencode.json | **[High]** User Decision #14: DELETE file AND remove json entry — json removed but file remains |
| (no file) `compaction` | ✅ Yes — `github-copilot/claude-haiku-4.5` | System config — expected to have no .md file |

### Model Assignment Consistency

All model assignments are consistent with current provider naming (`github-copilot/...` format):
- Haiku-tier agents: context-scout, deep-researcher, doc-writer, compaction ✅
- Sonnet-tier agents: headwrench, context-insurgent, subagent-builder, gates-expert (removed) ✅
- Codex agent: code-writer (`opencode/gpt-5.3-codex`) ✅
- Opus agent: architect (`github-copilot/claude-opus-4.6`) — slated for deletion

**[High] — `architect.md` file and opencode.json entry both exist but user decided to delete both.**
Per Decision #6 (02-agent-analysis.md): Architect agent is deleted. Neither the file nor the opencode.json entry has been removed. Any delegation to @Architect will still route correctly — which means this is a live agent that should not exist. Risk: HW or SKILL.md might route to it incorrectly in future sessions.

**[Medium] — `gates-expert.md` file exists without opencode.json entry.**
Per Decision #14 (02-agent-analysis.md): GatesExpert should be deleted. The json entry was removed but the `.md` file remains. If HW tries to delegate to it (which won't happen if headwrench.md doesn't reference it — confirmed, no GatesExpert in HW), there's no registered model. The dangling file is low risk but creates confusion.

**[Low] — No `description` fields in any opencode.json agent entries.**
Per opencode-json-audit.md J1: all agent entries lack description fields. This reduces system transparency but has no runtime impact.

**[Info] — `session-context` plugin is auto-loaded and correctly absent from the plugin array.**
Confirmed per 01-surface-sweep.md Dimension 5: intentional by design. ✅

**[Info] — `exa` MCP is disabled but DeepResearcher uses it.**
Per opencode-json-audit.md J2 and inbox/exa-mcp-must-be-enabled.md: `"enabled": false` at line 71 breaks DeepResearcher. Confirmed unfixed.

---

## Q5 — Plugin Edge Cases

Analysis of `opencode/plugins/session-context.ts` (205 lines):

### Edge Case 1: Empty or undefined sessionID

**Lines 96–99**: `if (!currentSessionID)` — falsy check covers both `undefined` and empty string `""`. Pushes bare session ID line and returns. ✅ **Handled.**

### Edge Case 2: active-session.json does not exist (ENOENT)

**Lines 101–137**: `readFile(activeSessionPath)` throws ENOENT → caught by outer catch at line 135. Falls through to bare session ID push. ✅ **Handled.** (Same path as "no session activated.")

### Edge Case 3: sessionName missing from active-session.json

**Line 113**: `if (!sessionName)` — explicit check, pushes bare session ID. ✅ **Handled.**

### Edge Case 4: spec.json does not exist or is invalid JSON

**Lines 118–134**: Inner try-catch. Both `readFile` ENOENT and `JSON.parse` SyntaxError are caught. Fallback: bare session ID push. ✅ **Handled.**

### Edge Case 5: spec.json has valid JSON but missing fields (partial malformation)

**In `system.transform`**: The raw spec content is injected as a string — no field access occurs. Even a `{}` spec would inject cleanly. ✅ **System transform is safe.**

**In `formatSessionToast` (lines 8–25)**: The function accesses `spec.subtasks` directly (line 14 `for...of`). If `spec.subtasks` is `undefined`, a TypeError throws. This propagates to the `command.execute.before` handler's try-catch (line 80), which shows "No active session" toast. **Handled by outer catch, but silently — the failure is indistinguishable from "no session" rather than "malformed spec."**

**[Low] — Malformed spec.json produces misleading toast message.**
"No active session" is shown when the spec exists but is malformed. A more informative message (e.g., "Error reading session spec") would aid debugging.

### Edge Case 6: activate_session tool called before any system.transform turn

**Line 148**: `if (!currentSessionID) return "Error: session ID not available (has a turn occurred yet?)"`. ✅ **Handled with explicit error message.** The module-level `currentSessionID` starts as `undefined` and is only set on `system.transform`. This is by design and well-communicated.

### Edge Case 7: Multiple concurrent sessions (same plugin instance)

`currentSessionID` is a module-level variable (line 6). Each `system.transform` call overwrites it. In a concurrent multi-session scenario, the last call to `system.transform` determines what `activate_session` and `deactivate_session` operate on.

**[Low] — Module-level state is a theoretical race condition.** In practice, single-user sequential usage means this cannot occur. Not a real risk in the current deployment context.

### Edge Case 8: deactivate_session when no active-session.json exists

**Lines 189–195**: ENOENT is explicitly checked (`error.code === "ENOENT"`) and treated as success — correct behavior (deactivating something already deactivated is idempotent). ✅ **Handled.**

### Summary

The plugin is robust for all realistic usage patterns. Two minor issues: misleading toast on malformed spec (Low), and module-level state theoretically unsafe under concurrency (Low). No Critical or High issues in the plugin code itself.

---

## Q6 — Inbox Health

### Active Items (require action)

| File | Active | Session | Still Relevant? | Classified Correctly? | Promotion Candidate? |
|------|--------|---------|----------------|----------------------|---------------------|
| `context-insurgent-needs-write-for-session-notes.md` | `true` | opencode-config-audit | ⚠️ — says "was applied" to context-insurgent.md, confirmed applied (write: allow at line 8) — should be resolved/closed | ❌ Should be marked active: false | No — operational fix note, not a pattern |
| `exa-mcp-must-be-enabled.md` | `true` | opencode-config-audit | ✅ Yes — fix not yet applied | ✅ Correct — actionable fix item | No — specific bug fix, not a reusable pattern |
| `global-agents-should-be-minimal.md` | `true` | opencode-config-audit | ✅ Yes — architect/gates-expert files still exist | ✅ Correct — architectural recommendation | Consider — architectural decision could become context |
| `hw-owns-all-commits.md` | `true` | opencode-config-audit | ✅ Yes — code-writer.md line 49 and doc-writer.md line 44 still have git commit instructions | ✅ Correct — actionable fix | ✅ Strong candidate — reusable rule for all projects |
| `model-tier-concept-is-broken.md` | `true` | opencode-config-audit | ✅ Yes — SKILL.md lines 25–27 still use tier language | ✅ Correct — architectural finding | ✅ Strong candidate — architectural constraint on session planning |
| `planning-uses-multi-scout-then-insurgent.md` | `true` | opencode-config-audit | ✅ Yes — not applied to headwrench.md or plan-workflow.md | ✅ Correct — workflow rule | ✅ Strong candidate — permanent workflow rule |

### Inactive Items (superseded or resolved)

| File | Superseded By | Assessment |
|------|--------------|------------|
| `agent-ignore-header-pattern.md` | `agent-ignore-header-pattern.md` (self-ref) | Promoted to `opencode/context/` as same name. `active: false` + self-referential superseded_by is the current promotion signal pattern — not broken, just odd. |
| `archive-path-convention.md` | `opencode/protocols/context-management.md` | ✅ Properly superseded by the protocol that documents the convention. |
| `ask-only-subagent-pattern.md` | `ask-only-subagent-pattern.md` (self-ref) | Promoted to `.opencode/context/` — BUT the context/ file is now STALE (see critical finding below). |
| `docwriter-format-autonomy.md` | `docwriter-format-autonomy.md` (self-ref) | Promoted to `opencode/context/docwriter-format-autonomy.md`. ✅ |
| `only-codewriter-needed-permission-fix.md` | itself | Promoted to `.opencode/context/`. ✅ Still valid. |
| `opencode-global-config-is-symlink.md` | itself | Promoted to `.opencode/context/`. ✅ Still valid. |
| `primary-vs-subagent-permission-model.md` | itself | Promoted to `opencode/context/`. ✅ Still valid with open question noted. |
| `stale-project-local-context.md` | `opencode/protocols/context-management.md` | ✅ Properly superseded. |
| `tool-visible-output-session-prompt.md` | `~` (null) | **[Medium]** Active: false but superseded_by is null — not promoted to any context file. This is a genuine reusable technical pattern (inject visible tool output via session.prompt noReply). Should be promoted to global context or the null superseded_by should be explained. |

### Critical Stale Context File

**[High] — `.opencode/context/ask-only-subagent-pattern.md` is stale and actively misleading.**

The file (promoted from inbox, last_reviewed: 2026-03-13) describes ContextInsurgent as "ask-only" — HeadWrench must confirm with user before invoking. However, Decision #11 from 02-agent-analysis.md explicitly **removed the ask-only designation**: "HW can invoke ContextInsurgent freely — no user confirmation required."

This Tier 3 context file will be loaded into every future session bootstrap. It directly contradicts the current headwrench.md behavior and the inbox item `planning-uses-multi-scout-then-insurgent.md` (which reflects the new rule). Any future HW running with this context will incorrectly believe it must ask before delegating to ContextInsurgent.

**Fix required**: Set `superseded_by: planning-uses-multi-scout-then-insurgent.md` (or delete) in `.opencode/context/ask-only-subagent-pattern.md` and mark `active: false`.

Also mark the inbox source `ask-only-subagent-pattern.md` accordingly.

---

## Q7 — Context Tier Health

### Actual Directory State

The subtask spec assumed `.opencode/context/` is empty — **this assumption is incorrect.** Both context tiers are populated:

**`opencode/context/` (Tier 2 — global permanent context):**
| File | Tier | Last Reviewed | Status |
|------|------|--------------|--------|
| `agent-ignore-header-pattern.md` | global | 2026-03-13 | ✅ Active, valid |
| `codewriter-git-commits.md` | global | 2026-03-13 | ✅ Active, valid — aligns with hw-owns-all-commits finding |
| `docwriter-format-autonomy.md` | global | 2026-03-13 | ✅ Active, valid |
| `headwrench-conventions.md` | global | 2026-03-13 | ✅ Active, valid (gates embedded in subtask todolists) |
| `primary-vs-subagent-permission-model.md` | global | 2026-03-13 | ✅ Active, valid (open question unresolved but noted) |

**`.opencode/context/` (Tier 3 — local permanent context):**
| File | Tier | Last Reviewed | Status |
|------|------|--------------|--------|
| `ask-only-subagent-pattern.md` | local | 2026-03-13 | ❌ **STALE** — describes removed behavior |
| `only-codewriter-needed-permission-fix.md` | local | 2026-03-13 | ✅ Active, valid |
| `opencode-global-config-is-symlink.md` | local | 2026-03-13 | ✅ Active, valid |

### 5-Tier Functional Assessment

| Tier | Description | Functional? | Notes |
|------|-------------|-------------|-------|
| Tier 1 | OpenCode runtime (plugin injection) | ✅ Yes | session-context.ts operational |
| Tier 2 | Global permanent context (`opencode/context/`) | ✅ Yes | 5 valid files |
| Tier 3 | Local permanent context (`.opencode/context/`) | ⚠️ Partial | 3 files: 1 stale (ask-only), 2 valid |
| Tier 4 | In-progress/pending session notes | ✅ Yes | Loads from sessions with correct status filter |
| Tier 5 | Current subtask file | ✅ Yes | Loaded at bootstrap and subtask transition |

### YAML Front-Matter Format

The format is well-documented in two places:
1. `opencode/protocols/context-management.md` — defines all required and optional fields
2. Existing context files — all use consistent YAML front-matter with `topic`, `tier`, `promoted_from`, `session`, `created`, `last_reviewed`, `supersedes`, `superseded_by`

**[Info] — A new user has sufficient reference material.** Both the protocol definition and 8 working examples (5 global + 3 local) provide enough to write a correct context file. The format is unambiguous.

**[Medium] — `promoted_from: direct` pattern is underspecified.**

`opencode/context/headwrench-conventions.md` uses `promoted_from: direct`. This value is not documented in context-management.md (which only defines `inbox` as a promotion source, and `direct` is implied but unnamed). A writer following only the protocol would be unsure whether `direct` is a valid value.

**[Low] — `opencode/context/codewriter-git-commits.md` has `session: ~` (null).**

This is an oddity — the file was apparently created without a session reference. Not harmful but inconsistent with all other context files that have a session value. Could confuse ContextScout when reporting the provenance of context items.

---

## Summary of Critical Issues

| # | Issue | Severity | File(s) | Subtask 04 Finding? |
|---|-------|----------|---------|---------------------|
| 1 | No active session → no compaction anchor in system prompt | [High] | `session-context.ts` line 96–99 | New |
| 2 | exa MCP still disabled; DeepResearcher non-functional | [Critical] | `opencode.json:71` | Confirmed from 02 |
| 3 | CodeWriter git commit instruction still present | [Critical] | `code-writer.md:49` | Confirmed from 02 |
| 4 | DocWriter git commit instruction still present | [Critical] | `doc-writer.md:44` | Confirmed from 02 |
| 5 | Architect agent not deleted (file + json entry both remain) | [Critical] | `subagents/architect.md`, `opencode.json:47` | Confirmed from 02 |
| 6 | GatesExpert file not deleted (json entry removed, file remains) | [High] | `subagents/gates-expert.md` | Confirmed from 02 |
| 7 | SKILL.md: @explorer, @Architect, broken tier language | [High] | `opencode/skills/agent-delegation-expert/SKILL.md:18,19,25–27` | Confirmed from 02 |
| 8 | `.opencode/context/ask-only-subagent-pattern.md` is stale | [High] | `.opencode/context/ask-only-subagent-pattern.md` | **New — not in prior notes** |
| 9 | SubagentBuilder lines 64–65 contradiction unresolved | [High] | `subagents/subagent-builder.md:64–65` | Confirmed from 02 |
| 10 | lockdown-WA session `status: active` but effectively abandoned | [Medium] | `.opencode/sessions/lockdown-workflows-and-agents/spec.json` | New |
| 11 | concepts-why-this-works `status: in_progress` but never started | [Medium] | `.opencode/sessions/concepts-why-this-works/spec.json` | New |
| 12 | `tool-visible-output-session-prompt.md` inbox: not superseded, not promoted | [Medium] | `.opencode/inbox/tool-visible-output-session-prompt.md` | New |
| 13 | `context-insurgent-needs-write` inbox item marked active but fix was applied | [Low] | `.opencode/inbox/context-insurgent-needs-write-for-session-notes.md` | New |
| 14 | No description fields in any opencode.json agent entries | [Low] | `opencode/opencode.json` | Confirmed from lockdown-WA J1 |

---

## Cross-Reference to Prior Notes

- Q1 (compaction) expands on 01-surface-sweep.md Dimension 5 (session-context auto-loading) — adds edge case analysis not previously addressed
- Q2 (lockdown-WA status) is new analysis; references 02-agent-analysis.md decisions list as the benchmark
- Q4 (opencode.json) cross-references 01-surface-sweep.md Dimension 5 and 02-agent-analysis.md decisions
- Q5 (plugin edge cases) is entirely new; no prior notes covered plugin internals
- Q6 (inbox health) introduces critical stale context finding not captured anywhere in prior notes
- Q7 (context tier) corrects the subtask spec assumption — `.opencode/context/` is NOT empty; provides inventory
