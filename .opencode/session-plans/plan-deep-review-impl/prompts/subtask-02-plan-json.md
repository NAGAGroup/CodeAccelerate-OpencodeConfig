<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02: Write Planning DAG — plan-deep-review/plan.json

## Objective

Write the `plan.json` for the `/plan-deep-review` planning workflow. This is a 9-node planning DAG that, when activated, guides an agent through scoping a code review and producing a fix session plan. The session_type must be `"plan-deep-review"` (a new value not yet in the codebase).

## Scope

**Write:**
- `opencode/planning/plan-deep-review/plan.json`

**Reference (read only, do not edit):**
- `opencode/planning/plan-deep-research/plan.json` — format reference for a similar planning DAG
- `opencode/planning/plan-generic/plan.json` — format reference with gate and loop nodes

## Constraints

- `schema_version` must be `"1.0"`
- `session_type` must be `"plan-deep-review"` (new value — do not reuse existing values)
- `status` must be `"ready"`
- `entry` must be `"session-overview"`
- `created` must be `"2026-03-20"`
- All prompt paths must use the home-relative convention: `~/.config/opencode/planning/plan-deep-review/prompts/{node}.md`
- The `load-guidelines` node prompt must point to `~/.config/opencode/planning/plan-design-guidelines.md`
- Do NOT include runtime fields (`progress`, per-node `status`, `completed_at`) — those are written by the plugin

## Todolist

- [x] Read `opencode/planning/plan-deep-research/plan.json` for structure reference
- [x] Create directory `opencode/planning/plan-deep-review/` if it does not exist
- [x] Write `opencode/planning/plan-deep-review/plan.json` with exactly this 9-node DAG structure:

**Node flow:**
```
session-overview → load-guidelines → review-intake → clarify (loop, remaining_visits:3) → scout → synthesize → agent-routing → review-gate (gate) → finalize
```

**Node specifications:**
- `session-overview`: type `"agent"`, prompt `~/.config/opencode/planning/plan-deep-review/prompts/session-overview.md`, next: `"load-guidelines"`
- `load-guidelines`: type `"agent"`, prompt `~/.config/opencode/planning/plan-design-guidelines.md`, next: `"review-intake"`
- `review-intake`: type `"agent"`, prompt `~/.config/opencode/planning/plan-deep-review/prompts/review-intake.md`, next: `"clarify"`
- `clarify`: type `"agent"`, prompt `~/.config/opencode/planning/plan-deep-review/prompts/clarify.md`, next: `["clarify", "scout"]`, `remaining_visits: 3`
- `scout`: type `"agent"`, prompt `~/.config/opencode/planning/plan-deep-review/prompts/scout.md`, next: `"synthesize"`
- `synthesize`: type `"agent"`, prompt `~/.config/opencode/planning/plan-deep-review/prompts/synthesize.md`, next: `"agent-routing"`
- `agent-routing`: type `"agent"`, prompt `~/.config/opencode/planning/plan-deep-review/prompts/agent-routing.md`, next: `"review-gate"`
- `review-gate`: type `"gate"`, prompt `~/.config/opencode/planning/plan-deep-review/prompts/review-gate.md`, next: `["finalize", "clarify"]`
- `finalize`: type `"agent"`, prompt `~/.config/opencode/planning/plan-deep-review/prompts/finalize.md` (no `next` — terminal node)

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-deep-research/plan.json` for format reference
- Goal: Write `opencode/planning/plan-deep-review/plan.json` with the exact 9-node DAG specified above
- Constraints: session_type must be `"plan-deep-review"`, all paths home-relative, no runtime fields
- Verify: JSON is valid, all 9 nodes present, clarify has `remaining_visits: 3`, review-gate has `type: "gate"`, finalize has no `next`

## Advance

Call `next_step()` when this subtask is complete.
