# Subtask 02 — Agent Analysis Findings

_Date: 2026-03-13_  
_Source: ContextInsurgent deep analysis + user architectural feedback_

---

## Q1 — Collaborative Mode Differentiation

**Verdict: MEDIUM — structural theater**

`plan-workflow.md` branches in Step 2 (Q&A) only: Collaborative mode adds 3 extra questions.

The "pause before each subtask" preference collected during Collaborative Q&A is **never enforced**:
- No field in `spec.json` to store this preference
- No protocol step acts on it
- No agent reads it during execution

The branching produces different conversation output but has **no structural effect** on plan drafting or execution. The plan produced by a Collaborative session is structurally identical to a Generic session.

---

## Q2 — ContextInsurgent Ask-Only Enforcement

**Verdict: MEDIUM — instruction-only (no technical enforcement)**

- Stated in `headwrench.md` (~line 121) and `context-insurgent.md` frontmatter description
- HW has `question: allow` but nothing technically forces it to invoke the tool before delegating
- ContextInsurgent itself has no `question` permission (correctly ask-silent), but its own system prompt has no warning equivalent to Architect's "you're only invoked when user approved" notice

**User decision (m0104 #11): Remove ask-only entirely.**

New workflow rule:
- HW can invoke ContextInsurgent freely — no user confirmation required
- HW should always use ContextScout first (can parallelize multiple ContextScouts)
- ContextInsurgent only when extra reasoning power is needed
- **Exception — planning workflow**: ContextInsurgent is ENFORCED in planning:
  1. HW globs/greps project for rough layout
  2. Delegates to multiple ContextScouts in parallel  
  3. Uses those findings to delegate to ContextInsurgent

---

## Q3 — Permission vs. Instruction Gaps

### HeadWrench
- Only `question: allow` explicitly stated in frontmatter
- All other capabilities (git, bash, write, edit) unlisted — primary agent mode likely has implicit broad permissions
- **Info**: Not a bug — primary agents have broader defaults per permission model documentation

### CodeWriter — CRITICAL
- Instructions tell it to `git commit` at end of task
- Bash permissions: `cat`, `ls`, `find`, `grep`, `rg` only — `git` is blocked
- **User decision (m0104 #1): CodeWriter should NOT commit — that is HW's job.** The git commit instruction is wrong. Remove it from code-writer.md.

### DocWriter — CRITICAL
- Same git commit instruction, same restricted bash block
- **User decision (m0104 #2): Same as CodeWriter — remove git commit instruction from doc-writer.md.**

### DeepResearcher — CRITICAL (multiple)
1. **exa MCP disabled in opencode.json** — no exa tools available at runtime
   - **User decision (m0104 #3): BUG — exa MCP should be enabled. Fix: set `"enabled": true` for exa in opencode.json.**
2. **Instructions reference Context7 but context7 tools not in permissions** — High severity
   - **User decision (m0104 #8): ADD context7 tool permissions to deep-researcher.md.**
3. **`websearch: allow` references possibly non-existent tool** — Medium severity; needs verification

### Architect — (DELETED)
- **User decision (m0104 #5, #6, #12): DELETE Architect entirely.**
- Rationale: Opus breaks sequential thinking tools; sonnet + sequential thinking + full HW context is more powerful
- Remove `architect.md`, remove from `opencode.json`

### SubagentBuilder — CRITICAL
- Line 64: "model tier should match recommendation"
- Line 65: "don't include model in frontmatter"
- These are **directly contradictory** — you can't match a model tier if you don't include model in frontmatter
- **User decision (m0104 #9): NEEDS FIX.** SubagentBuilder must be able to create agents with correct model. Resolution needed — see recommendations below.

### GatesExpert — (DELETED)
- **User decision (m0104 #14): DELETE GatesExpert.** Was supposed to be deleted previously. Gating instructions already exist in protocols that HW reads. Delete `gates-expert.md`, remove from `opencode.json`.

### ContextScout, ContextInsurgent — generally clean

---

## Q4 — Cross-Agent Terminology Consistency

**Verdict: MOSTLY SOLID — two gaps**

- **High**: SKILL.md routing table has `@explorer` but NOT `@ContextInsurgent` — exploration category has no valid delegation target after @explorer is removed
  - **User decision (m0104 #7): ADD @ContextInsurgent to SKILL.md routing table.**
- **Medium**: GatesExpert output format doesn't reference the `[🚫 GATE]` notation HW uses — moot since GatesExpert is deleted
- **Low**: `subagent-builder.md` uses "AgentDelegationExpert" (CamelCase) vs "agent-delegation-expert" (kebab-case) everywhere else — minor naming drift; user was unclear on significance (m0104 #17), marking Low

---

## Q5 — Dead References

| Severity | Reference | Location | Disposition |
|----------|-----------|----------|-------------|
| Critical | `@explorer` routing | SKILL.md routing table | **User (m0104 #4): Remove all @explorer references** |
| Critical | exa tools | deep-researcher.md permissions | **User (m0104 #3): Enable exa MCP in opencode.json** |
| High | Context7 instruction | deep-researcher.md | **User (m0104 #8): Add context7 permissions** |
| Medium | `websearch: allow` | deep-researcher.md | Needs verification — may be non-existent tool |
| Low | "SessionPlanDrafter" stale comment | plan-workflow.md | **User (m0104 #16): Remove stale reference** |
| Low | SKILL.md "Phase 5" | SKILL.md ~line 36 | **User (m0104 #15): Fix to "Step 4"** |

---

## Q6 — Architect Double-Gating

**Verdict: Moot — Architect is deleted (user decision m0104 #6)**

Historical record: Gate 1 was solid (Q&A opt-in → checkpoint step 7); Gate 2 had no `question tool` instruction in HW for Architect invocations.

---

## Q7 — Model Tier Concept

**Verdict: CRITICAL — misleading and broken**

- SKILL.md hardcodes "haiku/sonnet/opus" as tier names — these are provider-specific, no-op at runtime
- Decision table uses fast/standard/deep throughout
- `plan-workflow.md` uses "model tier" language
- `subagent-builder.md` lines 64–65: contradictory tier instruction
- No agent .md files contain provider strings ✅
- Real-world impact: CodeWriter uses GPT-5.3-codex, not "standard=sonnet" — tier system actively misleads planners

**User decision (m0104 Gate 1, #5, #9):**
Correct fix: HW asks user what model the target agent uses. If the existing global agent has insufficient model, delegate to SubagentBuilder to create a session-local clone with correct model in frontmatter at `.opencode/agents/`.

---

## Architectural Decisions — Summary

Confirmed user decisions from m0104:

| # | Decision | Action |
|---|----------|--------|
| 1 | CodeWriter should NOT git commit | Remove git commit instruction from code-writer.md |
| 2 | DocWriter should NOT git commit | Remove git commit instruction from doc-writer.md |
| 3 | exa MCP disabled is a BUG | Set `"enabled": true` for exa in opencode.json |
| 4 | @explorer intentionally disabled; all refs must go | Remove all @explorer references from SKILL.md and any other files |
| 5 | Keep only: ContextScout, ContextInsurgent, DeepResearcher, SubagentBuilder, HW | Delete CodeWriter, DocWriter, GatesExpert, Architect from global agents |
| 6 | Architect deleted | Delete architect.md, remove from opencode.json |
| 7 | SKILL.md routing missing @ContextInsurgent | Add @ContextInsurgent to routing table for deep exploration |
| 8 | DeepResearcher needs context7 permissions | Add context7 tool permissions to deep-researcher.md |
| 9 | SubagentBuilder model tier contradiction needs fix | Resolve contradiction — allow frontmatter model when explicitly specified |
| 10 | plan-workflow.md should only cover up to session-type Q | Split: plan.md covers branch selection only; per-type protocol files cover their own Q&A and process |
| 11 | Remove ask-only from ContextInsurgent; enforce planning workflow pattern | Update headwrench.md; ContextInsurgent free except planning = enforced multi-ContextScout-then-insurgent |
| 12 | (same as 6) | — |
| 13 | Full permission audit of remaining 5 agents | Subtask for AUDIT.md recommendations section |
| 14 | GatesExpert deleted | Delete gates-expert.md, remove from opencode.json |
| 15 | SKILL.md "Phase 5" → "Step 4" | Fix in SKILL.md |
| 16 | SessionPlanDrafter stale reference in plan-workflow.md | Remove stale comment |
| 17 | AgentDelegationExpert CamelCase naming drift | Low — mark for cleanup |

---

## What's Solid (preserve in AUDIT.md)

- Deny-by-default permission architecture consistently applied across all agents
- ContextInsurgent ask-silent correctly enforced via missing `question` permission
- Checkpoint 8-step structure comprehensive and well-referenced
- Cross-agent vocabulary (gate/checkpoint/subtask/WIP commit) consistent
- No hardcoded model strings in agent instruction text (only in skill/protocols — and those are the problem)
- SubagentBuilder's core purpose (create ephemeral session agents) is sound; just needs model handling fixed

---

## SubagentBuilder Contradiction — Resolution Recommendation

Current contradiction: "model tier should match recommendation" (line 64) + "don't include model in frontmatter" (line 65).

**Proposed resolution**: SubagentBuilder should:
1. Always include `model:` in frontmatter of agents it creates
2. Ask HW what model to use when creating the agent (or receive it as part of the task spec)
3. Remove the "don't include model in frontmatter" instruction — it was wrong
4. SKILL.md should remove tier language (haiku/sonnet/opus) and instead document which actual model IDs are available per provider
