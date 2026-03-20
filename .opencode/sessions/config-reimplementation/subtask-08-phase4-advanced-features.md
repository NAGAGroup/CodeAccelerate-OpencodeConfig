# Subtask 08 — phase4-advanced-features

## Delegation
**Agent:** @config-implementer  
**Reason:** Speculative implementation work — scope determined at gate approval time; sonnet-class handles the work.

---

## Objective

Implement Phase 4 advanced features — speculative, depends entirely on what the user approves at the Phase 4 gate. This subtask is intentionally loosely scoped until the gate passes.

Phase 4 candidates from the research roadmap:
1. **Earned autonomy** — Beta(α,β) distribution + Value of Information gating. HW accumulates a trust score based on subtask success/failure history. Higher trust → fewer confirmation gates. This requires: tracking success/failure counts in spec.json, a trust calculation, and adjusting PAUSE/GATE frequency based on trust level.
2. **Complexity classification routing** — automatic model tier selection (mechanical→haiku, standard→sonnet, complex→o1-mini) based on task signals (file count, dependency depth, ambiguity keywords). Would augment the static routing table in the delegation skill.
3. **Predictive skill loading** — detect skill triggers in the conversation and pre-load summary tiers proactively before HW asks for the full skill.
4. **Graph RAG** — structured knowledge graph over session notes for better context retrieval. Likely a plugin implementation.

At gate time, the user selects which features to implement. This subtask file should be updated via `/amend` if the gate selects specific features.

---

## Scope

### In Scope
- To be determined at gate approval — update this subtask via `/amend` before executing

### Out of Scope
- Anything not approved at the Phase 4 gate

---

## Patterns

- Earned autonomy: add `trustScore: { alpha: N, beta: N }` to spec.json; trust = alpha/(alpha+beta)
- Gate frequency: if trust > 0.8, reduce PAUSE frequency; if trust < 0.5, increase
- Complexity signals: count files in Scope, check for ambiguity words ("might", "depends", "unclear"), check subtask dependency depth
- Predictive skill loading: add trigger keywords to skill YAML frontmatter; HW scans for them

---

## Constraints

- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT implement anything that wasn't approved at the Phase 4 gate
- Earned autonomy must have a manual override (user can always disable it)
- Complexity routing should be additive — not replacing the existing static table
- This subtask is the FINAL subtask — use Session Close commit format: `feat: complete session — config-reimplementation`

---

## Context Files

- `.opencode/sessions/config-reimplementation/spec.json` — understand current spec structure before extending
- `opencode/skills/agent-delegation-expert/SKILL.md` — if implementing complexity routing

---

## Success Criteria

- Approved Phase 4 features are implemented
- Session notes document what was implemented and rationale
- spec.json extended correctly if earned autonomy is implemented

---

## Todolist

- [ ] Wait for Phase 4 gate approval (this subtask starts only after gate passes)
- [ ] Update this subtask file via /amend with specific scope from gate decision
- [ ] Implement approved Phase 4 features
- [ ] Write session notes for each implemented feature
- [ ] [⏸ PAUSE] — Summarize all changes made, final session review, wait for user sign-off before final commit
