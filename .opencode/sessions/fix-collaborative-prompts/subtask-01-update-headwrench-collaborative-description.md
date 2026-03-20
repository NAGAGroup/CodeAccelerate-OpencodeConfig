# Subtask 01: update-headwrench-collaborative-description

## Objective

Rewrite the "Collaborative" one-liner in the Plan Types section of `opencode/agents/headwrench.md` so it explicitly states the planning agent is designing a session artifact, not conducting the collaborative work.

## Scope

**File:** `opencode/agents/headwrench.md`

**Target section (lines 61–68):**
```
- **Collaborative** — exploratory or open-ended design. Planning DAG: idea-intake → clarify (loop) → seed-gate → finalize. Produces a seed plan that evolves freely during the session.
```

**Required change:** Expand this one-liner to make clear that:
1. The planning agent's job is to design the session structure (agenda, open questions, exploration areas) — not to explore the topic
2. The actual collaborative work happens in the session that follows, not during planning
3. The output is a session design artifact (plan.json, prompt stubs, spec.md stub) — not design proposals or answers

## Constraints

- Do not touch any other part of headwrench.md
- Keep consistent style with the Generic and Debug one-liners nearby
- The description can be 2–3 sentences if needed — clarity over brevity here

## Todolist

- [ ] Read `opencode/agents/headwrench.md` lines 61–68
- [ ] Rewrite the Collaborative description with explicit session-designer framing
- [ ] Verify surrounding Generic and Debug descriptions are untouched

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/agents/headwrench.md` (lines 55–75 for context)
- Goal: Rewrite the Collaborative one-liner so it unambiguously communicates that the planning agent designs a session artifact (not collaborative output). The agent's role is session designer, not session participant. The actual exploration happens in the session that follows.
- Constraints: Do not touch Generic or Debug descriptions. Match surrounding style. 2–3 sentences is fine if needed.
- Verify: The rewritten description could not be misread as "do the collaborative work now"
