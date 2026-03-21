<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask ST06: Rebuild Deep-Research Scaffold — Research-Focus Planning vs. Full Research Execution

## Objective

Rebuild the deep-research planning scaffold to produce a **research-focus plan** (research questions, sources, scope boundaries, discovery strategy) instead of a full research execution plan. This clarifies the deep-research flow's purpose: plan the research execution; then users run a separate research session to execute the actual web searches and synthesis.

## Scope

**Current deep-research flow:**
- Produces `plan.json` with full decomposition, subtasks, agent routing
- User executes directly with `/activate-plan`
- Problem: Deep-research mode is supposed to be planning-centric; instead it acts like generic execution

**New deep-research flow:**
- Produces `plan.json` (Project DAG) + **`research-plan.md`** (research discovery plan artifact)
- `research-plan.md` contains:
  - Research goal & user intent
  - Key research questions (5–7 specific questions to answer)
  - Recommended sources (libraries, docs, web resources)
  - Scope boundaries (what's in scope, what's out of scope)
  - Search strategy (how to approach the research: top-down library docs, then web search, then examples, etc.)
  - Success criteria (what answers would be complete?)
- `agent-routing` **STAYS** but routes @DeepResearcher agents (Exa-powered, often in parallel) — NOT general decomposition agents
- User reviews research plan + routing; if approved, can execute immediately with `/activate-plan` OR conduct research themselves
- Output is a **research plan + researcher assignments**

**Changes required:**

1. **Update `plan-deep-research/plan.json`:**
   - KEEP `agent-routing` node (deep-research planning DOES route @DeepResearcher agents)
   - Rename `research-gate` → `research-plan-gate` (gate on research plan + routing approval)
   - Update advance from `research-plan-gate` to `finalize` (agent-routing stays; info phase follows as usual)

2. **Create `plan-deep-research/prompts/finalize.md`:**
   - Write `research-plan.md` (research questions, sources, scope, strategy, criteria)
   - Also generate routing table from `agent-routing` node (which @DeepResearcher agents will execute the research)
   - Include routing in the research plan context so user sees who will run the research
   - Terminal node; call `close_session()`

3. **Update `plan-deep-research/prompts/research-plan-gate.md` (rename from research-gate):**
   - User is approving a **research plan + researcher assignments**, not just a plan
   - Branches: approve-plan → finalize; refine-plan → clarify
   - Update language: "Do the research questions capture what you want to know? Are the assigned researchers appropriate? Scope clear? Ready to execute?"

4. **Update `plan-deep-research/prompts/agent-routing.md`:**
   - Clarify that this node routes @DeepResearcher agents (not general decomposition agents)
   - Explain that routing happens BEFORE the research-plan-gate (user sees assignments at approval)
   - Keep routing logic for Exa-powered research agents

5. **Update all other deep-research prompts:**
   - Remove any mentions of "execution plan" or "general task assignment"
   - Reframe as "research planning and researcher assignment"
   - `research-intake.md`: capture the research goal, what the user wants to understand
   - `clarify.md`: ask research-clarifying questions (not execution questions)
   - `assess.md`: decide if research scope is clear, not if execution is ready
   - DO NOT DELETE `agent-routing.md` (deep-research planning DOES route research agents)

6. **Create new template files for deep-research output:**
   - `research-plan-template.md` (reference file) showing what `research-plan.md` should contain

## Constraints

- You MUST NOT change the core research-planning reasoning flow (clarify/assess loop remains)
- You MUST KEEP `agent-routing` node (deep-research DOES route @DeepResearcher agents)
- You MUST NOT create general decomposition subtasks; focus on research questions and researcher assignments
- Deep-research outputs must be **research plans + researcher routing**, not general execution plans
- All language must reflect "research planning and researcher assignment" not "task decomposition"
- Research plan should focus on **what to research**, not **how to execute the research** (that's the agents' job)

## Delegation

**Agent:** @JuniorDev (parallel × 5)

**Task 1:** Update `plan-deep-research/plan.json` — KEEP agent-routing node, rename research-gate to research-plan-gate, update next pointers. Verify agent-routing is present and correctly positioned before the gate.

**Task 2:** Create `plan-deep-research/prompts/finalize.md` — writes `research-plan.md` (research questions, sources, scope, strategy, criteria) + routing table from agent-routing. Terminal node; calls `close_session()`.

**Task 3:** Update `plan-deep-research/prompts/research-plan-gate.md` (rename from research-gate) — approval gate for research plan + researcher assignments. Update language to ask about research clarity, scope, AND researcher assignments. Branches: approve-plan → finalize; refine → clarify.

**Task 4:** Update remaining deep-research prompts — remove execution language, reframe as research planning + researcher assignment:
   - `research-intake.md`: capture research goal, what user wants to understand
   - `clarify.md`: ask research-clarifying questions
   - `assess.md`: decide if research scope is sufficient
   - `agent-routing.md`: UPDATE (not delete) to clarify this routes @DeepResearcher agents

**Task 5:** Create `plan-deep-research/prompts/research-plan-template.md` — reference file showing structure of `research-plan.md` output (goal, questions, sources, scope, strategy, criteria, next steps) PLUS routing table section showing assigned @DeepResearcher agents.

**Goal:** Transform deep-research scaffold to produce research plans instead of execution plans.

**Verify:** `plan.json` has agent-routing node intact; finalize writes research-plan.md + routing table; all language reflects research planning + researcher assignment not task decomposition.

## Advance

Call `next_step()` when this subtask is complete. Gate 3: Before you advance, surface a summary of the deep-research scaffold changes and show a sample research-plan.md structure.

