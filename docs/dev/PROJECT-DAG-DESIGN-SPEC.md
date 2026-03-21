# Project DAG Design Specification

**Status:** LOCKED IN  
**Date:** 2026-03-21  
**Purpose:** Define the execution shapes for all four planning modes, establishing how project DAGs handle unknowns through gates, loops, and branching.

---

## Core Philosophy

Planning sessions are **lightweight**. They don't try to predict the future or produce omniscient specifications. Instead, they:
1. Identify what's *known* (goal, context, constraints)
2. Identify *decision points* where user input will be needed
3. Identify *loops* where iteration is inevitable
4. Structure the DAG so the executing agent can reason and decide *in context*, not follow blind predictions

**User gates in project DAGs are not "approving a plan."** They're **approving decisions *during execution***. The executing agent encounters unknowns, proposes a direction, user validates it, and execution continues. This is fundamentally different from planning-time approval.

---

## 1. GENERIC PROJECT DAG

**Purpose:** Handle any task that needs decomposition and structured execution: features, refactors, migrations, investigations, etc.

**Why generic needs flexibility:** Not all work is linear. Some has inherent loops (build-test cycles), some has branching (multiple valid approaches), some has gates (decision points). Generic should handle all of these, and more sophisticated combinations.

### Valid Generic DAG Shapes

#### **Shape 1A: Simple Linear**
(Straightforward task, prerequisites clear, no unknowns)

```
session-overview → step-1 → step-2 → step-3 → finalize
```

Example: "Add a new field to the database schema, then update the API, then migrate data."

No loops, no gates. Each step follows clearly from the previous.

#### **Shape 1B: Linear with Loop**
(Implementation involves iteration)

```
session-overview → step-1 (design) → [loop: step-2 (implement) → step-3 (test) → step-4 (verify)] → step-5 (documentation) → finalize
```

Loop structure: `step-4 (verify)` has two exits:
- "passes" → advance to `step-5`
- "fails" → loop back to `step-2`

`remaining_visits` on the decision node (`step-4`) caps iterations

Example: "Design API, then implement-build-verify loop until passing, then document."

#### **Shape 1C: Linear with Decision Gate**
(Uncertainty about direction)

```
session-overview → step-1 → gate (user decision) → [path-yes: step-2a] [path-no: step-2b] → merge → step-3 → finalize
```

Gate: executing agent proposes a direction, user approves or redirects

Example: "After initial investigation, should we refactor this module or build a new one?" Gate lets user decide.

#### **Shape 1D: Branching**
(Multiple valid approaches; decision emerges during execution)

```
session-overview → step-1 → gate: which approach? → [path-A: step-2a → step-3a] [path-B: step-2b → step-3b] → merge → step-4 → finalize
```

Gate is not "planning decided"; it's "here are two valid paths, execute one."

Example: "Implement authentication. Should we use JWT or OAuth? (gate) Then implement the chosen approach."

Executing agent researches both, proposes one, user validates.

#### **Shape 1E: Loop with User Gate**
(Iterative work with user checkpoints)

```
session-overview → step-1 → [loop: step-2a (iterate) → step-2b (evaluate) → gate (user: continue loop?)] → step-3 → finalize
```

Gate inside the loop: "is this iteration satisfactory, or should we continue?"

Example: "Refactor a subsystem. (loop) Implement a refactoring → evaluate quality → user gate: good enough or refine more?"

#### **Shape 1F: Complex DAG**
(Sophisticated task with multiple decisions and loops)

```
session-overview → step-1 (setup) → gate (A or B?) → 
  [path-A: step-2a → [loop: step-3a → step-4a] → step-5a] 
  [path-B: step-2b → step-3b → gate (final choice?)] → 
merge → finalize
```

Multiple gates, nested loops, branching paths.

Execution is not "follow predetermined steps"; it's "navigate decisions and iterations."

### Key Principles

- Planning doesn't predict which path the executing agent takes or how many loop iterations occur.
- Planning *structures* the DAG so the agent can reason and the user can validate key decisions.
- Gates and loops are not failures of planning; they're **mechanisms for handling unknowns**.
- Executing agent's job: research options (at gates), implement (in steps), report results (in loops), ask for user input (at gates).

### Session-Overview (Dynamically Generated)

- Task goal and acceptance criteria
- High-level shape overview (e.g., "design → [implement-test loop] → documentation")
- Key decision points (gates) and what's unknown about them
- Subtasks/steps (what will be done)
- Constraints and context
- *Note: "This DAG may be restructured during execution as new information emerges. Gates and loops handle unknowns."*

### Finalize Prompt

- Verify all steps completed
- Run integration tests
- Summarize what was built/changed
- Note: if DAG was restructured during execution, document what changed and why

### User Interactivity

- **Planning-time (planning scaffold):** Review-gate approves the overall approach and DAG shape
- **Execution-time (project DAG):** Gates inside the DAG pause execution so user can validate decisions in context
- **Loop exhaustion:** If `remaining_visits` is exceeded, surface to user and ask whether to continue

### Project-Agnostic vs. Project-Specific

- *Agnostic:* DAG structure (gates, loops, branching mechanisms)
- *Specific:* Steps themselves, decision points, constraints, context

---

## 2. DEBUG PROJECT DAG

**Purpose:** Investigate a bug/incident through iterative diagnosis and hypothesis-driven testing.

**Core insight:** Debugging is inherently **non-linear and loop-driven**. Planning can't predict the root cause. The DAG structures the investigation *loop* so the executing agent and user can converge on a solution.

### Valid Debug DAG Shapes

#### **Shape 2A: Simple Diagnosis Loop**
(Straightforward bug, hypothesis clear)

```
session-overview → diagnose → test → verify → (success → finalize) (failure → diagnose)
```

Loop: `verify` gate decides: "is the bug fixed?" 
- Yes → finalize
- No → loop back to diagnose

`remaining_visits` caps iteration count

#### **Shape 2B: Loop with User Gate**
(User validates hypothesis before testing)

```
session-overview → diagnose → hypothesis-gate (user: approve this direction?) → test → verify → (success → finalize) (failure → diagnose)
```

`hypothesis-gate`: executing agent proposes root cause, user validates ("does this look right?") before test

If user rejects, could loop back to diagnose or advance to new-direction

More user control over investigation direction

#### **Shape 2C: Branching Diagnosis**
(Multiple possible root causes)

```
session-overview → initial-investigation → gate: which root cause? → 
  [path-1: test-1 → verify-1] 
  [path-2: test-2 → verify-2] → 
(success → finalize) (failure → diagnose-deeper)
```

Gate: executing agent identifies multiple plausible root causes, user picks one to test first

If test fails, loop back to test other causes or diagnose deeper

#### **Shape 2D: Iterative Investigation with Decision Gates**
(Complex bug, multiple investigation phases)

```
session-overview → quick-check → gate (obvious cause?) → 
  [yes: fix-obvious → verify → finalize] 
  [no: deep-diagnose → [loop: analyze → test-hypothesis] → fix → verify → finalize]
```

Fast path for obvious bugs (gate decides)

Slow path with loop for complex bugs

### Key Principles

- The diagnosis loop is **not a failure of planning**; it's a **mechanism for handling unknowns**.
- Planning doesn't try to predict the root cause. It sets up the loop and gates for discovering it.
- `remaining_visits` prevents infinite loops, but doesn't prevent real investigation.
- Gates let user guide investigation without blocking execution.

### Session-Overview (Dynamically Generated)

- Bug description and reproduction steps
- Impact assessment (severity, affected systems)
- Initial hypothesis (if known, or "unknown—will diagnose")
- Investigation strategy (how to diagnose)
- Loop cap and escalation plan
- Note: "Root cause may not be what we initially suspected. The diagnosis loop will help us discover it."

### Loop Nodes

- *Diagnose:* Investigate, propose root cause and next test
- *Hypothesis-gate (optional):* User validates: "should we test this?"
- *Test:* Attempt fix or run diagnostic test
- *Verify:* Check if bug is gone. Decide: loop or finalize

### Finalize Prompt

- Explain root cause (how it was discovered)
- Document the fix
- Call `close_session()`

### User Interactivity

- **Planning-time:** Hypothesis-gate in planning scaffold (user approves general investigation direction)
- **Execution-time:** Optional hypothesis-gate in project DAG (user validates specific hypotheses), loop exhaustion gate
- **Restructuring:** If investigation reveals the bug is more complex than anticipated, DAG can be expanded with deeper diagnosis nodes

### Project-Agnostic vs. Project-Specific

- *Agnostic:* Loop structure (diagnose → test → verify), gate placement, remaining_visits mechanics
- *Specific:* Bug description, reproduction steps, initial hypothesis, investigation strategy

---

## 3. COLLABORATIVE PROJECT DAG

**Purpose:** Explore a design space, analyze trade-offs, produce a design spec/proposal. Not about executing tasks; about **discovering the design through exploration and decision-making**.

**Core insight:** Design is iterative and emergent. Planning can't predict what the design will be. The DAG structures **exploration and decision loops** so the executing agent and user can converge on a good design.

### Valid Collaborative DAG Shapes

#### **Shape 3A: Simple Explore-Then-Synthesize**
(Clear exploration areas, straightforward synthesis)

```
session-overview → explore-area-1 → explore-area-2 → synthesize → write-spec → finalize
```

Linear exploration of predetermined areas

Once all areas explored, synthesize and document

#### **Shape 3B: Explore with Decision Gate**
(Uncertainty about exploration scope)

```
session-overview → explore-area-1 → gate: sufficient coverage or explore more? → 
  [more: explore-area-2] 
  [sufficient: synthesize] → write-spec → finalize
```

Gate: executing agent proposes "I've explored enough," user validates

Prevents over-exploration and under-exploration

#### **Shape 3C: Multi-Path Design Exploration**
(Multiple design directions to evaluate)

```
session-overview → initial-analysis → gate: which design direction? → 
  [option-A: explore-A → refine-A] 
  [option-B: explore-B → refine-B] → 
compare → gate: choose one? → write-spec → finalize
```

Gate: multiple design directions; execution explores both, then decides

Compare node: side-by-side evaluation of trade-offs

Second gate: user confirms chosen direction before finalizing

#### **Shape 3D: Iterative Design Refinement**
(Design that evolves through feedback)

```
session-overview → explore → synthesize → draft-spec → gate: approve design? → 
  [yes: finalize] 
  [no: refine-based-on-feedback] → draft-spec → gate (again) → finalize
```

Gate after drafting: user reviews design and decides: ship or refine

If refine, loop back to exploration/synthesis with feedback

`remaining_visits` caps refinement cycles

### Key Principles

- Planning doesn't decide the design. It structures exploration and decision loops.
- Gates are decision points: "is this design direction good?" "sufficient exploration?" "ready to finalize?"
- The design *emerges* during execution, not during planning.
- Loops allow for feedback and refinement without restarting from scratch.

### Session-Overview (Dynamically Generated)

- Design question/challenge (what are we designing?)
- Exploration areas (what aspects matter)
- Constraints (budget, timeline, tech stack, org priorities)
- Success criteria (what makes a good design)
- Design methodology (how will we approach the design)
- Output artifact (spec.md, proposal.md, etc.)
- Note: "The design will emerge through exploration and decision-making. Gates let us validate direction as we go."

### Exploration Nodes

- *Explore-area-X:* Research this aspect of the design space; gather examples, trade-offs, evidence
- *Analyze/compare (if multiple paths):* Side-by-side evaluation of options
- *Synthesize:* Connect findings into coherent design narrative
- *Draft-spec:* Document the design formally

### Decision Gates

- After exploration: "sufficient coverage or explore more?"
- Before synthesis: "ready to synthesize or explore more?"
- After draft: "approve this design or refine?"

### Finalize Prompt

- Polish the spec (formatting, clarity, completeness)
- Call `close_session()`

### User Interactivity

- **Planning-time:** Seed-gate in planning scaffold (user approves exploration plan)
- **Execution-time:** Gates inside DAG (user validates exploration scope, design direction, final design)
- **Refinement loops:** If user rejects design, loop back to refinement

### Project-Agnostic vs. Project-Specific

- *Agnostic:* Exploration → decision → synthesis → spec pattern, gate placement, loop structure
- *Specific:* Design question, exploration areas, constraints, success criteria

---

## 4. DEEP-RESEARCH PROJECT DAG

**Purpose:** Research a topic through iterative exploration, gather findings, synthesize into a research brief. Similar to Collaborative in that it's **emergent and discovery-driven**, not task-execution.

### Valid Deep-Research DAG Shapes

#### **Shape 4A: Simple Research Loop**
(Clear research angles, straightforward synthesis)

```
session-overview → [loop: research-angle-1 → research-angle-2 → research-evaluate] → synthesize → write-brief → finalize
```

Linear loop through research angles

`research-evaluate`: after each angle, assess: more research needed or synthesize?

#### **Shape 4B: Research with Decision Gates**
(Uncertainty about direction mid-research)

```
session-overview → research-angle-1 → gate: promising or pivot? → 
  [promising: deep-dive-1 → more-research] 
  [pivot: research-angle-2] → synthesize → write-brief → finalize
```

Gate after each research angle: "does this angle seem important? Spend more time or pivot?"

Allows dynamic redirection of research effort

#### **Shape 4C: Parallel Research Angles**
(Multiple research directions explored simultaneously, then synthesized)

```
session-overview → [parallel: research-angle-1, research-angle-2, research-angle-3] → synthesize → write-brief → finalize
```

Multiple execution threads (if allowed by agent capability)

Each angle researched independently, then findings connected

#### **Shape 4D: Iterative Research with Refinement**
(Research that deepens through feedback)

```
session-overview → [loop: research-angle-X → research-evaluate] → draft-brief → gate: sufficient coverage? → 
  [yes: finalize] 
  [no: research-gaps] → draft-brief → gate (again) → finalize
```

Gate after draft: user reviews coverage and decides: sufficient or research more

If research more, loop back to investigate gaps

`remaining_visits` caps research iterations

### Key Principles

- Planning doesn't predict which research angles will be important.
- Gates and loops let research direction **emerge** as evidence is gathered.
- The brief *synthesizes findings*, not predicts them.
- Refinement loops allow for feedback-driven research deepening.

### Session-Overview (Dynamically Generated)

- Research question (what are we researching?)
- Research angles/scope (what aspects matter)
- Source priorities (where to look: academic, blogs, code, interviews, etc.)
- Research methodology (how will we conduct research)
- Success criteria (what makes a good research brief)
- Loop cap and refinement strategy
- Output artifact (research-brief.md, findings-report.md, etc.)
- Note: "Research will evolve as we gather findings. Gates let us adjust direction and validate coverage."

### Research Nodes

- *Research-execute-angle-X:* Investigate one research angle; gather sources, read, synthesize findings
- *Research-evaluate:* Assess coverage: more research needed or move to synthesis?
- *Synthesize:* Connect findings into coherent narrative
- *Draft-brief:* Document findings formally

### Decision Gates

- During research loop: "does this angle matter? Spend more time or pivot?"
- After draft: "sufficient coverage or research more?"

### Finalize Prompt

- Polish the brief
- Call `close_session()`

### User Interactivity

- **Planning-time:** Research-gate in planning scaffold (user approves research plan)
- **Execution-time:** Gates inside DAG (user guides research direction, validates coverage)
- **Refinement loops:** User feedback drives deeper research if needed

### Project-Agnostic vs. Project-Specific

- *Agnostic:* Research → evaluate → synthesize → brief pattern, gate placement, loop structure
- *Specific:* Research question, research angles, source priorities, success criteria

---

## Summary: Project DAG Principles

1. **All DAG types support loops, gates, and branching** — not just specialized ones.
2. **Gates and loops are not plan failures; they're mechanisms for handling unknowns.**
3. **Planning doesn't try to predict everything** — it structures the DAG so the executing agent can discover and decide in context.
4. **User gates in project DAGs serve execution, not just plan approval** — they validate decisions *during* execution.
5. **Planning is lightweight; execution is sophisticated** — the real reasoning happens when the agent encounters unknowns, proposes a direction, and user validates it.

---

## Next Steps

This specification defines the *execution shapes* that planning scaffolds must be able to produce. The next phase is designing the planning scaffolds themselves to guarantee they can generate valid DAGs for each mode.

**Planning Scaffold Design** will address:
- How planning sessions gather information to support DAG design decisions
- What gates and decisions happen during planning (vs. execution)
- How planning agents learn to structure proper DAGs
- What information planning finalize nodes need to write valid project DAGs
