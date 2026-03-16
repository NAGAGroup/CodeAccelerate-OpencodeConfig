# Surface Sweep — Audit Findings

_Subtask 01 — ContextScout breadth-first pass, verified by HeadWrench direct checks_
_Date: 2026-03-13_

---

## Dimension 1: Feature-Set Comprehensibility

**Fresh-reader verdict**: Mostly self-describing. An informed reader can identify all agents, their roles, and invocation contexts from README + FEATURES + opencode.json. However, several inventory discrepancies undermine trust in the feature documentation.

### Findings

- **Critical — `@explorer` delegation path is broken**: `opencode/skills/agent-delegation-expert/SKILL.md` (lines 18, 36) lists `@explorer` as the agent for "pure codebase search/exploration." However, `opencode.json` explicitly disables the built-in `explore` agent (`"explore": {"disable": true}`). Any delegation to `@explorer` will fail silently or route incorrectly. The skill's routing table is partially stale.

- **High — `/inbox` command listed in FEATURES.md does not exist**: `FEATURES.md:58` lists `/inbox` as a command, but no `inbox.md` exists in `opencode/commands/`. The actual command for viewing session status is `session-status.md`. This is a phantom command in the documentation.

- **High — `/context-audit` command exists but is undocumented**: `opencode/commands/context-audit.md` exists (10 command files total) but is missing from `FEATURES.md` commands table entirely. A fresh reader would not know this command exists.

- **High — FEATURES.md Protocols count is wrong**: Component inventory says "3 protocols" but there are 4 files in `opencode/protocols/`: `checkpoint.md`, `plan-workflow.md`, `session-plan-schema.md`, and `context-management.md`. The protocols table only lists the first 3; `context-management.md` is completely absent from the table despite being a foundational protocol.

- **Medium — FEATURES.md Commands count is wrong**: Component inventory says "9 commands" (`FEATURES.md:24`). Actual count is 10 files. The discrepancy is explained by `/context-audit` being missing and `/inbox` being a phantom.

- **Info — `context-management.md` protocol is undocumented in FEATURES.md**: Because the table omits it, fresh readers cannot discover the context management protocol from FEATURES.md. It is only discoverable via direct inspection of the protocols directory.

---

## Dimension 2: Agent Permission vs. Instruction Alignment

**Overall**: High alignment. Deny-by-default pattern is consistently applied. Main concern is a possible glob pattern assumption.

### Findings

- **Medium — `deep-researcher.md` uses glob-style permission keys (`exa*`, `sequential*`)**: The permission block uses patterns like `exa_web_search_exa: allow` and other exa tools explicitly — need deeper inspection to verify if glob wildcards are actually used or if all tools are listed explicitly. ContextScout's report flagged this as uncertain. Flag for subtask 02.

- **Medium — Architect's `sequential-thinking*: deny` is not explained in system prompt**: The permission block denies sequential-thinking, but the agent's instructions make no mention of this constraint or rationale. A future maintainer could be confused about whether this is intentional. Flag for subtask 02.

- **Low — ContextScout read scope vs. protocol expectations**: `plan-workflow.md:16` says ContextScout reads `context-management.md` for Tiers 1–4 scope, but ContextScout's own system prompt doesn't explicitly enumerate this. The behavior is implicit. Flag for subtask 03.

- **Info — CodeWriter `task: deny`**: Prevents CodeWriter from delegating further. Aligns with intent (receives fully-specified tasks, does not re-delegate). ✅

- **Info — All read-only agents (ContextScout, ContextInsurgent, Architect, GatesExpert, DeepResearcher) have `edit: deny, write: deny`**: Consistent. ✅

- **Info — Implementation agents (CodeWriter, DocWriter) have `edit: allow, write: allow`**: Consistent. ✅

---

## Dimension 3: Protocol Cross-References

**Overall**: Protocol files themselves are internally consistent. Cross-references from agents/commands to protocols are accurate but some are implicit.

### Findings

- **High — `context-management.md` is not referenced in FEATURES.md**: See Dimension 1. A reader using FEATURES.md as the entry point cannot discover this protocol.

- **Medium — `plan-workflow.md` retired agent warning**: `plan-workflow.md:91` contains a note: "The 'SessionPlanDrafter' agent is retired and must not be used." This is a housekeeping comment, not a live reference — but it creates noise and signals a past confusion. No `SessionPlanDrafter` file exists anywhere. Low risk but consider removing.

- **Medium — ContextScout protocol reading is implicit**: `plan-workflow.md` says ContextScout reads context-management.md for tier scope, but ContextScout's system prompt doesn't confirm this. The protocol makes an assumption about the subagent's behavior that the subagent doesn't document. Flag for subtask 03.

- **Info — HeadWrench tilde paths**: `headwrench.md` references protocols as `~/.config/opencode/protocols/...` which resolves correctly because `~/.config/opencode/` is a symlink to `./opencode/`. ✅

- **Info — checkpoint.md is correctly the authoritative source for checkpoint behavior**: Referenced consistently in HeadWrench and session-plan-schema. ✅

- **Info — spec.json correctly identified as recovery anchor**: checkpoint.md, session-plan-schema.md, and headwrench.md all consistently point to spec.json. ✅

---

## Dimension 4: Component Naming Consistency

**Overall**: High consistency for agents and protocols. One naming drift in skill references.

### Findings

- **Medium — Skill naming inconsistency (`agent-delegation-expert` vs `AgentDelegationExpert`)**: The skill directory and SKILL.md frontmatter use kebab-case `agent-delegation-expert`, but at least one subagent file references it as `AgentDelegationExpert` (CamelCase). Need deeper review in subtask 02 to confirm scope of this inconsistency. Convention should be uniform.

- **Info — Agent filename convention**: Kebab-case filenames (`context-scout.md`) referenced as `@CamelCase` in prose (`@ContextScout`). This is a consistent, documented convention. ✅

- **Info — Protocol and command filenames**: All kebab-case, consistently. ✅

- **Info — No `SessionPlanDrafter` files exist**: The retired agent cleanup appears complete. No stale files found. ✅

---

## Dimension 5: opencode.json Alignment

**Overall**: Agent model assignments are correct. Two notable discrepancies with documentation.

### Findings

- **High — Architect model identifier differs between opencode.json and FEATURES.md**:
  - `opencode.json:47`: `"github-copilot/claude-opus-4.6"` (provider: `github-copilot`, version: `4.6` with period)
  - `FEATURES.md:43`: `opencode/claude-opus-4-6` (provider: `opencode`, version: `4-6` with hyphen)
  - This is a real discrepancy. Which is authoritative? `opencode.json` governs actual model loading; FEATURES.md is documentation. The documentation may be wrong, or may be using the model's canonical name. Flag for subtask 04.

- **Medium — DCP plugin version mismatch**:
  - `opencode.json:5`: `"@tarquinen/opencode-dcp@3.0.0"`
  - `FEATURES.md:27,89`: `@tarquinen/opencode-dcp@beta`
  - One references a pinned version, the other a floating tag. If they point to the same release, this is just stale documentation. If not, there's a version drift risk.

- **Medium — `session-context` plugin not in `opencode.json` (by design)**: FEATURES.md documents it as a plugin, but it's absent from the `plugin` array in opencode.json. This is intentional — archive notes from `session-context-plugin` session (subtask-01) explicitly state: _"Do NOT add session-context to opencode/opencode.json plugin array — auto-loaded as a local file."_ The auto-loading mechanism is the OpenCode runtime's local plugin discovery. **Not a bug — but FEATURES.md should clarify this.**

- **Info — `explore` agent explicitly disabled**: `opencode.json` disables the built-in `explore` (and `plan`, `general`) agents. This creates the `@explorer` routing gap noted in Dimension 1. ✅ Config matches intent (disable built-ins), but skill wasn't updated.

- **Info — All 8 subagent model assignments in opencode.json match FEATURES.md Agents table** (except Architect — see above). ✅

- **Info — `small_model` and `compaction` model defined but not documented in FEATURES.md agent table**: Documented only in the "Special Models" note (`FEATURES.md:46-47`). Acceptable. ✅

---

## Dimension 6: Documentation Accuracy

**Overall**: README is accurate at high level. FEATURES.md has multiple inventory errors that make it untrustworthy as the "authoritative feature inventory" it claims to be.

### Findings

- **High — FEATURES.md is the stated SSOT but has multiple errors**: The document's own header says "authoritative feature inventory" and "single source of truth." Given the errors found (wrong protocol count, missing `context-management.md`, wrong command count, phantom `/inbox`, missing `/context-audit`), it cannot serve this function without correction.

- **High — `context-management.md` protocol entirely absent from FEATURES.md**: No mention in the protocols table. This is one of the 4 core protocols that governs context loading tiers, inbox promotion, archival, and staleness. A fresh reader using FEATURES.md as the entry point has no visibility into this protocol.

- **Medium — CHANGELOG.md says "Nine slash commands" (line 16)**: Should say 10. Count frozen at v0.1.0 may simply predate the addition of `/context-audit`, but no subsequent changelog entry exists to cover it.

- **Low — README says "3 MCPs"**: Accurate per `opencode.json`. ✅

- **Low — README says "7 specialized subagents"**: Accurate if HeadWrench is excluded from the subagent count (it's the primary agent). The phrasing is slightly ambiguous but defensible. ✅

- **Low — README says "2 plugins"**: Accurate (DCP + session-context). ✅

- **Info — FEATURES.md Maintenance Guidelines (`FEATURES.md:104-116`)**: Lists `docs/CONCEPTS.md` and `docs/USAGE.md` as cross-reference targets. Need to verify these files exist. Not in the scope of this subtask.

---

## Summary

### What's Solid
1. **Permission discipline**: Deny-by-default consistently applied across all 8 subagents. Read-only vs. writer split is clean.
2. **Protocol internal consistency**: The 4 protocols are well-structured, cross-reference each other correctly, and define clear responsibilities.
3. **opencode.json model assignments**: 7 of 8 subagent model assignments are accurate (Architect is the exception).
4. **Agent system design**: HeadWrench orchestrator + specialized subagents pattern is coherent and consistently described.
5. **Session infrastructure**: spec.json as recovery anchor, 5-tier context loading, 3-layer todo stack — all well-defined.

### Critical Issues Flagged for Deep Dives
1. **`@explorer` routing is broken** — skill recommends routing to a disabled agent. Needs immediate fix.
2. **FEATURES.md has multiple inventory errors** — cannot serve its stated purpose as SSOT without correction.
3. **`/inbox` phantom + `/context-audit` missing** — documentation describes a command that doesn't exist and omits one that does.
4. **`context-management.md` absent from FEATURES.md** — one of the 4 core protocols is invisible from the primary documentation entry point.

### Medium Issues Needing Deeper Investigation
- Skill naming inconsistency (`agent-delegation-expert` vs `AgentDelegationExpert`)
- Architect model identifier discrepancy between `opencode.json` and `FEATURES.md`
- DCP plugin version mismatch (`@3.0.0` vs `@beta`)
- `session-context` plugin auto-loading mechanism not documented in FEATURES.md
- Retired `SessionPlanDrafter` note still in `plan-workflow.md`
- ContextScout's protocol-reading scope is implicit (not documented in its own system prompt)
- Architect `sequential-thinking` denial unexplained

### What Needs Deep Dives (Subtasks 02–04)
- Subtask 02 (agent analysis): DeepResearcher permission glob syntax, Architect sequential-thinking rationale, collaborative mode differentiation in agent instructions, `@explorer` routing in skill vs. headwrench
- Subtask 03 (protocol analysis): Context-management.md utilization, ContextScout implicit scope, retired agent note cleanup
- Subtask 04 (session analysis): session-context auto-loading mechanism, lockdown-WA application status, Architect model identifier resolution

---

## Gate 1 — User Architectural Feedback (2026-03-13)

Major architectural observations provided during Gate 1 review. These expand several findings and add new critical items.

### A: Model references in agent .md files

Agent `.md` files (system prompts) should not hardcode specific providers or model names. User docs should be provider-agnostic — it's the user's choice to configure their own providers/models. This applies equally to any agent system prompt that mentions a specific model string.

**Impact on audit scope**: Add a dimension to subtask 02 — scan all agent `.md` files for hardcoded provider/model strings. Any such reference is a finding.

### B: User documentation staleness

User-facing docs (README, FEATURES, CHANGELOG) are broadly stale. **Deferred to a separate task** — not in scope for this audit's AUDIT.md deliverable.

### C: Model tier concept is critically broken (new Critical finding)

The `fast/standard/deep` tier language in the delegation skill and HW instructions does not actually do anything at runtime. OpenCode always uses whatever model is configured for the agent in `opencode.json` or the agent's frontmatter. The tier recommendation is a **no-op** — it creates false confidence that planning is making quality-appropriate model selections when it isn't.

**Severity: Critical** (user-confirmed)

**The correct fix**: During planning, HW should ask the user what model the target agent (e.g., CodeWriter) is currently running. If the model lacks sufficient capability for the task, HW should delegate to SubagentBuilder to create a session-local clone of that agent with the correct model specified in the frontmatter in `.opencode/agents/`. This actually works because frontmatter model assignments override opencode.json defaults.

**Impact on audit scope**: Flag in subtask 02 (delegation skill and HW instructions) and subtask 03 (plan-workflow protocol references to model tiers).

### D: Global subagent architecture — architectural decision made

**Decision (user-confirmed)**: Eliminate all global subagents except **ContextScout, ContextInsurgent, Architect, and SubagentBuilder**. All other agents (CodeWriter, DocWriter, GatesExpert, etc.) become session-built — SubagentBuilder creates them per session in `.opencode/agents/`. HW can reuse project-local agents across sessions but has no global utility agents to fall back on.

**Rationale**: The four retained agents are model-agnostic (read-only analysis) or expensive/rare enough that the user explicitly controls their model. Session-built agents guarantee the right model is configured for the task. The cost is that every planning session now requires a SubagentBuilder step for non-retained agents.

**Impact on audit scope**: This is an architectural recommendation for AUDIT.md. Adds a Critical-level finding: the current global agent inventory (CodeWriter, DocWriter, GatesExpert) should not exist as permanent global fixtures. The delegation skill's routing table and SubagentBuilder's guidance need to reflect the session-local-agent pattern.
