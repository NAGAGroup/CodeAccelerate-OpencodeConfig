<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04-07 Batch: Update plan-debug, plan-collaborative, plan-deep-research, plan-deep-review

## Objective

Apply the informational phase architecture to all 4 remaining planning DAGs in parallel.

## Scope

**Parallel work — dispatch all 4 agents simultaneously in one response, wait for all to return, then call `next_step()` once.**

### Agent 1 — plan-debug
**Read:** `files/planning/plan-debug/plan.json`, `files/planning/plan-debug/prompts/`
**Edit:** Insert informational nodes per Subtask 02 design — after agent-routing, before review-gate
**Write:** New prompt files under `files/planning/plan-debug/prompts/`
**Constraints:** plan-debug flow is bug-intake → scout → hypothesis-form → confirm-mode → agent-routing → review-gate → finalize. Maintain invariants.

### Agent 2 — plan-collaborative
**Read:** `files/planning/plan-collaborative/plan.json`, `files/planning/plan-collaborative/prompts/`
**Edit:** Insert informational nodes — collaborative flow is lighter; skip auto-gate options
**Write:** New prompt files under `files/planning/plan-collaborative/prompts/`
**Constraints:** No automatic gate options (collaborative is inherently exploratory)

### Agent 3 — plan-deep-research
**Read:** `files/planning/plan-deep-research/plan.json`, `files/planning/plan-deep-research/prompts/`
**Edit:** Insert informational nodes — support research loop (research-execute → accumulate → assess)
**Write:** New prompt files under `files/planning/plan-deep-research/prompts/`
**Constraints:** Include research-gate decisions; maintain invariants

### Agent 4 — plan-deep-review
**Read:** `files/planning/plan-deep-review/plan.json`, `files/planning/plan-deep-review/prompts/`
**Edit:** Insert informational nodes — review-centric flow
**Write:** New prompt files under `files/planning/plan-deep-review/prompts/`
**Constraints:** Include review-specific informational content; maintain invariants

## Delegation

**Agent:** @JuniorDev (parallel × 4)
**Model:** haiku-like

## Advance

Dispatch all 4 agents simultaneously. Wait for all to return. Then call `next_step()` exactly once.
