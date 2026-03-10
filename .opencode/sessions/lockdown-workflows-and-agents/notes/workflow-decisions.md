# Workflow Design Decisions — lockdown-workflows-and-agents

## Decision 1: SessionPlanDrafter Collapsed into HeadWrench
**Date:** 2026-03-09  
**Decision:** Eliminate `SessionPlanDrafter` as a separate delegate. HeadWrench writes session plans directly.  
**Rationale:** The plan format is a structured template, not deep creative reasoning. HW already holds full Q&A context. Delegation overhead + failure surface outweigh the theoretical separation-of-concerns benefit.  
**Impact:**
- `subagents/session-plan-drafter.md` — to be deleted or retired
- `opencode.json` — remove `subagents/session-plan-drafter` entry
- `opencode/agents/headwrench.md` — add plan-writing instructions + reference to plan format schema
- `opencode/commands/plan.md` — update to reflect HW writes the plan directly

---

## Decision 2: Correct /plan Workflow
**Date:** 2026-03-09  
**Agreed flow:**
1. HW dispatches ContextScout
2. HW runs Q&A with user
3. HW writes the plan draft itself (no drafter delegation)
4. HW delegates to AgentDelegationExpert to read plan and recommend delegation rules + suggest new local agents if needed
5. HW presents user with plan overview + delegation recs + any new agents needed
6. User approves → HW incorporates delegation rules into plan; if new agents needed, delegates to SubagentBuilder in parallel
7. HW gives final overview and waits for user to begin

---

## Decision 3: AgentDelegationExpert is Read-Only Recommender
**Date:** 2026-03-09  
**Decision:** AgentDelegationExpert only reads the plan and returns recommendations. It does NOT write or edit any files. HW incorporates the recommendations.  
**Impact:**
- `subagents/agent-delegation-expert.md` — remove any instruction to write/edit files
- `opencode.json` — `edit: deny` and `write: deny` are CORRECT for this agent; the audit finding was a false positive
- `agent-audit.md` / `opencode-json-audit.md` — mark AgentDelegationExpert edit lockout as intentional, not a bug

---

## Decision 4: DeepResearcher is Web-Only
**Date:** 2026-03-09  
**Decision:** DeepResearcher should ONLY search online. It should not read project files.  
**Impact:**
- `subagents/deep-researcher.md` — remove instruction to "read relevant project files"
- `opencode.json` — current `*: deny` + web-only tools is CORRECT; the audit finding was a false positive
- `agent-audit.md` / `opencode-json-audit.md` — mark DeepResearcher read lockout as intentional, not a bug
