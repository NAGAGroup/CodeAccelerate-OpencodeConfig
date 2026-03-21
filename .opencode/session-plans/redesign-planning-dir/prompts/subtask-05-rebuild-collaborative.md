<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask ST05: Rebuild Collaborative Scaffold — Session Design Spec vs. Execution Plan

## Objective

Rebuild the collaborative planning scaffold to produce a **session design spec** (architectural blueprint, open questions, exploration areas) instead of a full execution plan. This clarifies the collaborative flow's purpose: designers generate specs; specs are then fed into another planning DAG to generate executable Project DAGs.

## Scope

**Current collaborative flow:**
- Produces `plan.json` with full subtasks, agent routing, execution readiness
- User executes directly with `/activate-plan`
- Problem: Collaborative mode is supposed to be exploratory design; instead it pre-executes the plan

**New collaborative flow:**
- Produces `plan.json` (Project DAG skeleton) + **`spec.md`** (design artifact)
- `spec.md` contains:
  - Session goal & user intent
  - Rough exploration areas (not refined subtasks)
  - Key design decisions (branching points, alternative approaches)
  - Open questions the team should explore
  - Constraints and non-goals
- User reviews spec; if approved, uses a **different planning DAG** to flesh out execution subtasks
- No `/activate-plan` for collaborative output; instead, user decides next step (refine spec, feed to decompose DAG, etc.)

**Changes required:**

1. **Update `plan-collaborative/plan.json`:**
   - Remove `agent-routing` node (collaborative doesn't assign agents)
   - Rename `seed-gate` → `design-gate` (gate on design spec approval, not execution readiness)
   - Update advance from `design-gate` to `finalize` (no agent-routing → no decomposition)

2. **Create `plan-collaborative/prompts/finalize.md`:**
   - Instead of writing a full execution plan, write `spec.md`
   - Include the spec structure (goal, areas, decisions, questions, constraints)
   - Do NOT generate subtask list; do NOT assign agents
   - Terminal node; call `close_session()`

3. **Update `plan-collaborative/prompts/design-gate.md` (renamed from seed-gate):**
   - User is approving a **design spec**, not an execution plan
   - Branches: approve-spec → finalize; refine-design → clarify
   - Update language: "Is this design direction clear? Any open questions? Should we explore further?"

4. **Update all other collaborative prompts:**
   - Remove any mentions of "execution plan" or "subtask assignment"
   - Reframe as "design exploration" not "decomposition"
   - `clarify.md`: ask design-clarifying questions, not execution questions
   - `assess.md`: decide if design is clear enough, not if scope is ready to decompose
   - `idea-intake.md`: focus on capturing the design intent, constraints, and exploration areas
   - `agent-routing.md`: DELETE THIS NODE (collaborative doesn't route agents)

5. **Create new template files for collaborative output:**
   - `spec-template.md` (reference file, not a node) showing what `spec.md` should contain

## Constraints

- You MUST NOT change the core collaborative reasoning flow (clarify/assess loop remains)
- You MUST NOT create execution subtasks in the collaborative finalize; spec-only
- You MUST remove `agent-routing` from collaborative DAG entirely
- Collaborative outputs must be **specs**, not executable plans
- All language must reflect "design exploration" not "task decomposition"

## Delegation

**Agent:** @JuniorDev (parallel × 5)

**Task 1:** Update `plan-collaborative/plan.json` — remove agent-routing node, rename seed-gate to design-gate, update next pointers. Remove agent-routing from the DAG structure.

**Task 2:** Create `plan-collaborative/prompts/finalize.md` — writes `spec.md` (design spec, no subtasks or routing). Terminal node; calls `close_session()`.

**Task 3:** Update `plan-collaborative/prompts/design-gate.md` (rename from seed-gate) — approval gate for design spec. Update language to ask about design clarity, not execution readiness. Branches: approve-spec → finalize; refine → clarify.

**Task 4:** Update remaining collaborative prompts — remove execution language, reframe as design exploration:
   - `idea-intake.md`: capture design intent, constraints, exploration areas
   - `clarify.md`: ask design-clarifying questions
   - `assess.md`: decide if design clarity is sufficient
   - DELETE: `agent-routing.md` (no longer needed)

**Task 5:** Create `plan-collaborative/prompts/spec-template.md` — reference file showing structure of `spec.md` output (goal, areas, decisions, questions, constraints, next steps).

**Goal:** Transform collaborative scaffold to produce design specs instead of execution plans.

**Verify:** `plan.json` has no agent-routing node; finalize writes spec.md; all language reflects design exploration not task decomposition.

## Advance

Call `next_step()` when this subtask is complete. Gate 2: Before you advance, surface a summary of the collaborative scaffold changes and show a sample spec.md structure.

