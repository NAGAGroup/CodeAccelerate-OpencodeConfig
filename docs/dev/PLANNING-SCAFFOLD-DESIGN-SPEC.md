# Planning Scaffold Design Specification

**Status:** LOCKED IN  
**Date:** 2026-03-21  
**Purpose:** Define the DAG structure of planning scaffolds. Each scaffold is itself a DAG that enables planning agents to generate valid project DAGs.

---

## Generic Planning Scaffold

**Purpose:** Enable planning agents to generate valid generic project DAGs (shapes 1A-1F).

**Planning Agent's Job:** Generate a valid generic project DAG that:
- Has a chosen shape (1A-1F from PROJECT-DAG-DESIGN-SPEC.md)
- Has scoped subtasks with agent routing
- Has gates/loops/branches where unknowns exist in the project's execution
- Has user validation of the overall approach

**Planning Agent Needs To:**
1. Understand the task (goal, acceptance criteria, constraints, context)
2. Understand the codebase (patterns, structure, relevant areas)
3. Decide: what shape should the project DAG be? (linear, with loops, with gates, branching, complex combinations?)
4. Decompose the task into scoped subtasks
5. Route agents to subtasks
6. Document the reasoning and decision points
7. Identify where the project DAG will need mechanisms (gates, loops, branches) to handle unknowns during execution

**Planning DAG Structure:**

```
entry (session-overview)
  ↓
[DISCOVERY LOOP: understand task and codebase]
  task-intake → scout → clarify → evaluate-understanding
  (loop back if not enough context, advance if sufficient)
  ↓
[SHAPE SELECTION: decide what project DAG shape]
  propose-shape → evaluate-shape
  (agent proposes shape based on understanding; evaluates if it fits)
  ↓
[DECOMPOSITION LOOP: break task into subtasks]
  propose-decomposition → evaluate-decomposition → refine-if-needed
  (loop back if decomposition unsatisfactory, advance if good)
  ↓
agent-routing (assign agents to subtasks)
  ↓
[INFO PHASE: teach planning agent about project DAG design]
  (8 nodes from shared infrastructure)
  ↓
planning-gate (user approval of approach)
  (user validates: decomposition, routing, shape, overall strategy)
  ↓
finalize (write project DAG)
  (instantiate chosen shape with subtasks, routing, gates/loops in project DAG)
```

**Key Nodes:**

### task-intake
**Purpose:** Gather initial task information  
**Agent does:** Confirm task goal, acceptance criteria, constraints, high-level context  
**Advance:** Call `next_step()` when basic task info is captured

### scout
**Purpose:** Explore codebase for relevant context  
**Agent does:** Survey relevant code areas, understand patterns, identify affected systems  
**Advance:** Call `next_step()` when codebase understanding sufficient

### clarify
**Purpose:** Ask one critical clarifying question  
**Agent does:** Identify and ask the single most important outstanding question about the task  
**Advance:** Call `next_step()` after question asked

### evaluate-understanding
**Purpose:** Decide if understanding is sufficient  
**Agent does:** Assess: do we have enough context to decompose? If yes, advance. If no, loop back to scout/clarify.  
**Advance:** 
- If sufficient context: call `next_step()` to advance to shape selection
- If more context needed: call `next_step({ next: "scout" })` to loop back

### propose-shape
**Purpose:** Propose which project DAG shape is appropriate  
**Agent does:** Based on task understanding, propose a shape (1A-1F) and explain why it fits.  
**Advance:** Call `next_step()` to evaluation

### evaluate-shape
**Purpose:** Validate the proposed shape  
**Agent does:** Does the proposed shape match the task? Will it handle the unknowns appropriately?  
**Advance:**
- If shape is good: call `next_step()` to advance to decomposition
- If shape needs reconsideration: call `next_step({ next: "propose-shape" })` to loop back

### propose-decomposition
**Purpose:** Break task into subtasks  
**Agent does:** Decompose task into 3-9 scoped subtasks. Explain boundaries and dependencies.  
**Advance:** Call `next_step()` to evaluation

### evaluate-decomposition
**Purpose:** Validate the decomposition  
**Agent does:** Is the granularity right? Are subtasks truly scoped? Are dependencies clear?  
**Advance:**
- If decomposition is good: call `next_step()` to advance to agent-routing
- If decomposition needs refinement: call `next_step({ next: "refine-decomposition" })` to refine

### refine-decomposition
**Purpose:** Refine the decomposition based on evaluation  
**Agent does:** Adjust subtask boundaries, add/remove subtasks, clarify dependencies  
**Advance:** Call `next_step({ next: "evaluate-decomposition" })` to loop back to evaluation

### agent-routing
**Purpose:** Assign agents to subtasks  
**Agent does:** For each subtask, decide which agent (and model tier) should execute it.  
**Advance:** Call `next_step()` to info phase

### [INFO PHASE]
**Purpose:** Teach planning agent about project DAG design  
**8 nodes from shared infrastructure:**
- info-prime: "You now learn to design proper project DAGs"
- info-loop-analysis: Identify loop patterns in the project DAG
- info-visit-counter: Recommend remaining_visits for any loops in the project DAG
- info-gate-analysis: Recommend where gates should go in the project DAG
- info-shape-ref: Reference the valid generic shapes (1A-1F)
- info-validity-checks: DAG validity checklist
- info-flow-specific: Generic-specific reminders
- info-summarize-consumption: Explicit summary of planning decisions made

**Advance:** Each node calls `next_step()` to next info node; last advances to planning-gate

### planning-gate
**Purpose:** User validation of planning approach  
**Agent does:** Present full planning summary to user:
- Task understanding and context
- Proposed project DAG shape and why
- Decomposition (subtasks, boundaries, dependencies)
- Agent routing
- Where project DAG will have gates/loops/branches and why

**User decides:** 
- Approve: proceed to finalize
- Redirect: loop back to relevant node (understanding, shape, or decomposition)

**Advance:**
- If approved: call `next_step({ next: "finalize" })`
- If redirect to understanding: call `next_step({ next: "clarify" })`
- If redirect to shape: call `next_step({ next: "propose-shape" })`
- If redirect to decomposition: call `next_step({ next: "propose-decomposition" })`

### finalize
**Purpose:** Write the project DAG  
**Agent does:**
1. Instantiate the chosen project DAG shape with actual subtasks and routing
2. Generate session-overview.md for the project DAG (project-specific context)
3. Generate prompt file for each project DAG node
4. Generate the plan.json file with correct structure

**What finalize receives:**
- Task goal and constraints (from task-intake)
- Codebase context (from scout)
- Chosen project DAG shape (from propose-shape + approval)
- Decomposed subtasks with dependencies (from propose-decomposition + approval)
- Agent routing (from agent-routing)
- Loop/gate analysis from info phase (if project DAG shape requires them)
- User approval of all above (from planning-gate)

**What finalize writes:**
- `.opencode/session-plans/{session-name}/plan.json` — the project DAG with structure matching chosen shape
- `.opencode/session-plans/{session-name}/session-overview.md` — dynamically generated for executing agent
- `.opencode/session-plans/{session-name}/prompts/*.md` — one prompt per subtask
- `.opencode/session-plans/{session-name}/prompts/finalize.md` — finalize prompt for project DAG

**Advance:** Call `close_session()` (terminal node)

---

## Planning Scaffold Principles (Generic)

1. **Discovery loop** handles the unknown: "Do we understand the task well enough to decompose?"
2. **Shape selection** answers: "What project DAG structure fits this task?"
3. **Decomposition loop** handles the unknown: "Is this breakdown appropriate?"
4. **Info phase** teaches the planning agent how to design proper project DAGs with gates/loops/branches
5. **Planning gate** validates the entire approach before committing to the project DAG
6. **Finalize** instantiates the chosen shape with project-specific content

The planning scaffold embodies the same principles as project DAGs: **loops for iteration, gates for validation, mechanisms for handling unknowns.**

---

---

## Debug Planning Scaffold

**Purpose:** Enable planning agents to generate valid debug project DAGs (shapes 2A-2D).

**Planning Agent's Job:** Generate a valid debug project DAG that:
- Has a chosen shape (2A-2D from PROJECT-DAG-DESIGN-SPEC.md)
- Has a diagnosis loop (diagnose → test → verify structure)
- Has gates/branches where unknowns exist in the investigation
- Has user validation of the investigation strategy

**Planning Agent Needs To:**
1. Understand the bug (what's broken, reproduction steps, impact, affected code)
2. Understand the codebase (relevant code areas, potential root causes)
3. Form an initial hypothesis about root cause (or acknowledge high uncertainty)
4. Decide: what investigation shape? (simple loop, user gate validation, branching causes, iterative phases?)
5. Decide: what's the test/verification strategy?
6. Document the reasoning

**Key Difference from Generic:** Debug project DAGs are *always* loop-driven (diagnosis loop is inherent). Planning decides which *type* of loop structure fits the bug's complexity and hypothesis confidence.

**Planning DAG Structure:**

```
entry (session-overview)
  ↓
[BUG UNDERSTANDING LOOP: understand bug and affected code]
  bug-intake → scout → clarify → evaluate-understanding
  (loop back if not enough context, advance if sufficient)
  ↓
propose-hypothesis (form initial hypothesis about root cause)
  ↓
evaluate-hypothesis (assess confidence in hypothesis)
  ↓
[SHAPE SELECTION: decide investigation structure]
  propose-investigation-shape → evaluate-investigation-shape
  (shapes 2A-2D: simple loop, with gate, branching, iterative phases)
  ↓
propose-test-strategy (outline how to test/verify the hypothesis)
  ↓
[INFO PHASE: teach planning agent about debug DAG design]
  (8 nodes from shared infrastructure, debug-specific)
  ↓
planning-gate (user approval of hypothesis and investigation strategy)
  ↓
finalize (write project DAG with diagnosis loop)
```

**Key Nodes:**

### bug-intake
**Purpose:** Gather initial bug information  
**Agent does:** Confirm bug description, reproduction steps, impact, affected systems  
**Advance:** Call `next_step()` when bug info captured

### scout
**Purpose:** Explore affected code  
**Agent does:** Examine relevant code areas, understand structure, identify potential root causes  
**Advance:** Call `next_step()` when code understanding sufficient

### clarify
**Purpose:** Ask one critical clarifying question  
**Agent does:** Identify and ask the single most important outstanding question about the bug  
**Advance:** Call `next_step()` after question asked

### evaluate-understanding
**Purpose:** Decide if bug understanding is sufficient  
**Agent does:** Do we have enough context to form a hypothesis? If yes, advance. If no, loop back to scout/clarify.  
**Advance:**
- If sufficient context: call `next_step()` to hypothesis formation
- If more context needed: call `next_step({ next: "scout" })` to loop back

### propose-hypothesis
**Purpose:** Form initial hypothesis about root cause  
**Agent does:** Based on bug understanding and code exploration, propose what the root cause likely is.  
**Advance:** Call `next_step()` to evaluation

### evaluate-hypothesis
**Purpose:** Assess hypothesis confidence and complexity  
**Agent does:** How confident are we in this hypothesis? Is the bug likely simple or complex? This determines the investigation shape.  
**Advance:** Call `next_step()` to shape selection

### propose-investigation-shape
**Purpose:** Propose which debug DAG shape is appropriate  
**Agent does:** Based on hypothesis confidence and bug complexity, propose a shape (2A-2D):
- 2A (Simple Diagnosis Loop): high confidence, simple bug
- 2B (Loop with User Gate): need user validation before testing
- 2C (Branching Diagnosis): multiple possible causes
- 2D (Iterative Investigation): complex bug, may need multiple investigation phases  
**Advance:** Call `next_step()` to evaluation

### evaluate-investigation-shape
**Purpose:** Validate the proposed investigation shape  
**Agent does:** Will this investigation structure help discover/verify the root cause?  
**Advance:**
- If shape is good: call `next_step()` to test strategy
- If shape needs reconsideration: call `next_step({ next: "propose-investigation-shape" })` to loop back

### propose-test-strategy
**Purpose:** Outline how to test/verify the hypothesis  
**Agent does:** What specific tests will help confirm or refute the hypothesis? What's the verification plan?  
**Advance:** Call `next_step()` to info phase

### [INFO PHASE]
**Purpose:** Teach planning agent about debug DAG design  
**8 nodes from shared infrastructure, debug-specific:**
- info-prime: "You now learn to design proper debug DAGs"
- info-loop-analysis: Identify loop patterns in the diagnosis loop
- info-visit-counter: Recommend remaining_visits for the diagnosis loop
- info-gate-analysis: Recommend where hypothesis-gates should go
- info-shape-ref: Reference the valid debug shapes (2A-2D)
- info-validity-checks: DAG validity checklist for debug DAGs
- info-flow-specific: Debug-specific reminders
- info-summarize-consumption: Explicit summary of planning decisions made

**Advance:** Each node calls `next_step()` to next; last advances to planning-gate

### planning-gate
**Purpose:** User validation of investigation strategy  
**Agent does:** Present full planning summary to user:
- Bug understanding and context
- Initial hypothesis and confidence level
- Proposed investigation shape and why
- Test/verification strategy
- Where diagnosis loop will have gates/branches and why

**User decides:**
- Approve: proceed to finalize
- Redirect: loop back to hypothesis or investigation shape

**Advance:**
- If approved: call `next_step({ next: "finalize" })`
- If redirect to hypothesis: call `next_step({ next: "propose-hypothesis" })`
- If redirect to shape: call `next_step({ next: "propose-investigation-shape" })`

### finalize
**Purpose:** Write the project DAG  
**Agent does:**
1. Instantiate the chosen debug project DAG shape with diagnosis loop
2. Generate session-overview.md for the project DAG (bug-specific context)
3. Generate prompt files for diagnose, test, verify nodes
4. Generate the plan.json file with loop structure and remaining_visits

**What finalize receives:**
- Bug description, reproduction steps, impact (from bug-intake)
- Code context (from scout)
- Initial hypothesis (from propose-hypothesis + approval)
- Chosen investigation shape (from propose-investigation-shape + approval)
- Test strategy (from propose-test-strategy)
- User approval of all above (from planning-gate)

**What finalize writes:**
- `.opencode/session-plans/{session-name}/plan.json` — the project DAG with diagnosis loop
- `.opencode/session-plans/{session-name}/session-overview.md` — bug-specific context for executing agent
- `.opencode/session-plans/{session-name}/prompts/diagnose.md` — investigate node prompt
- `.opencode/session-plans/{session-name}/prompts/test.md` — test node prompt
- `.opencode/session-plans/{session-name}/prompts/verify.md` — verify node prompt
- (additional prompts for gates/branches if shape requires them)

**Advance:** Call `close_session()` (terminal node)

---

## Planning Scaffold Principles (Debug)

1. **Bug understanding loop** handles the unknown: "Do we understand the bug well enough to form a hypothesis?"
2. **Hypothesis formation** proposes: "What's the suspected root cause?"
3. **Investigation shape selection** decides: "What diagnosis structure fits this bug's complexity?"
4. **Test strategy** outlines: "How will we verify the hypothesis?"
5. **Info phase** teaches the planning agent how to design proper debug DAGs with diagnosis loops and gates
6. **Planning gate** validates the investigation approach before committing to the project DAG
7. **Finalize** instantiates the chosen shape with bug-specific content and diagnosis loop structure

---

---

## Collaborative Planning Scaffold

**Purpose:** Enable planning agents to generate valid collaborative project DAGs (shapes 3A-3D).

**Planning Agent's Job:** Generate a valid collaborative project DAG that:
- Enables turn-based dialogue between user and agent
- Has a chosen shape (3A-3D from PROJECT-DAG-DESIGN-SPEC.md)
- Has gates/loops where user feedback drives refinement
- Produces some artifact (variable based on collaboration topic)

**Planning Agent Needs To:**
1. Understand what we're collaborating on (topic, goal, framing)
2. Understand context/constraints that matter
3. Identify success criteria (what does a good outcome look like?)
4. Decide: which dialogue/iteration shape? (linear, with gates, multi-path, iterative refinement?)
5. Identify output artifact (what will the collaboration produce?)

**Key Difference from Generic and Debug:**
- Generic focuses on decomposing *work* into subtasks and routing
- Debug focuses on *investigating* a bug with a diagnosis loop
- Collaborative focuses on *turn-based dialogue* where user and agent collaborate, refine together, and produce an artifact

**Planning DAG Structure:**

```
entry (session-overview)
  ↓
[UNDERSTANDING LOOP: understand what we're collaborating on]
  intake → context-gather → clarify → evaluate-understanding
  (loop back if not enough context, advance if sufficient)
  ↓
[IDENTIFY SUCCESS CRITERIA: what makes this collaboration successful?]
  propose-success-criteria → evaluate-success-criteria
  ↓
[SHAPE SELECTION: decide dialogue/iteration structure]
  propose-collaboration-shape → evaluate-collaboration-shape
  (shapes 3A-3D: linear, with gates, multi-path, iterative refinement)
  ↓
identify-output-artifact (what will the collaboration produce?)
  ↓
[INFO PHASE: teach planning agent about collaborative DAG design]
  (8 nodes from shared infrastructure, collaborative-specific)
  ↓
planning-gate (user approval of collaboration plan)
  ↓
finalize (write project DAG with dialogue loop)
```

**Key Nodes:**

### intake
**Purpose:** Gather initial collaboration topic  
**Agent does:** Confirm what we're collaborating on (could be anything: design, analysis, proposal, synthesis, brainstorming, etc.), framing, initial goals  
**Advance:** Call `next_step()`

### context-gather
**Purpose:** Gather relevant context  
**Agent does:** Research, explore, or gather context relevant to the collaboration topic  
**Advance:** Call `next_step()`

### clarify
**Purpose:** Ask one critical clarifying question  
**Agent does:** Identify and ask the single most important outstanding question about the collaboration  
**Advance:** Call `next_step()`

### evaluate-understanding
**Purpose:** Decide if understanding is sufficient  
**Agent does:** Do we understand what we're collaborating on? Do we know the context? If yes, advance. If no, loop back.  
**Advance:**
- If sufficient: call `next_step()`
- If more context needed: call `next_step({ next: "context-gather" })`

### propose-success-criteria
**Purpose:** Define what makes the collaboration successful  
**Agent does:** What would a successful outcome look like? What should be true at the end?  
**Advance:** Call `next_step()`

### evaluate-success-criteria
**Purpose:** Validate the success criteria  
**Agent does:** Are these the right success criteria? Do they capture what matters?  
**Advance:**
- If good: call `next_step()`
- If need adjustment: call `next_step({ next: "propose-success-criteria" })`

### propose-collaboration-shape
**Purpose:** Propose which collaborative DAG shape is appropriate  
**Agent does:** Based on collaboration topic and success criteria, propose a shape (3A-3D):
- 3A (Linear Exploration): straightforward collaboration, clear direction
- 3B (Exploration with Decision Gate): uncertainty about scope or direction
- 3C (Multi-Path Exploration): multiple valid approaches to explore together
- 3D (Iterative Refinement): collaborative iteration with user feedback loops  
**Advance:** Call `next_step()`

### evaluate-collaboration-shape
**Purpose:** Validate the proposed collaboration shape  
**Agent does:** Will this iteration structure support good user-agent collaboration?  
**Advance:**
- If good: call `next_step()`
- If needs adjustment: call `next_step({ next: "propose-collaboration-shape" })`

### identify-output-artifact
**Purpose:** Identify what the collaboration will produce  
**Agent does:** What artifact will be created? (spec, proposal, analysis, synthesis, requirements, brainstorm doc, etc.)  
**Advance:** Call `next_step()`

### [INFO PHASE]
**Purpose:** Teach planning agent about collaborative DAG design  
**8 nodes from shared infrastructure, collaborative-specific:**
- info-prime: "You now learn to design proper collaborative DAGs"
- info-loop-analysis: Identify dialogue/iteration loop patterns
- info-visit-counter: Recommend remaining_visits for refinement loops
- info-gate-analysis: Recommend where decision gates should go in the dialogue
- info-shape-ref: Reference the valid collaborative shapes (3A-3D)
- info-validity-checks: DAG validity checklist for collaborative DAGs
- info-flow-specific: Collaborative-specific reminders (turn-based dialogue, user feedback)
- info-summarize-consumption: Explicit summary of planning decisions made

**Advance:** Each node calls `next_step()` to next; last advances to planning-gate

### planning-gate
**Purpose:** User validation of collaboration plan  
**Agent does:** Present full planning summary to user:
- Collaboration topic and framing
- Context and constraints
- Success criteria and what success looks like
- Proposed dialogue/iteration shape and why
- Output artifact that will be produced
- Where collaboration loop will have gates/feedback cycles and why

**User decides:**
- Approve: proceed to finalize
- Redirect: loop back to understanding, criteria, or shape

**Advance:**
- If approved: call `next_step({ next: "finalize" })`
- If redirect to understanding: call `next_step({ next: "clarify" })`
- If redirect to criteria: call `next_step({ next: "propose-success-criteria" })`
- If redirect to shape: call `next_step({ next: "propose-collaboration-shape" })`

### finalize
**Purpose:** Write the project DAG  
**Agent does:**
1. Instantiate the chosen collaborative project DAG shape with dialogue loop
2. Generate session-overview.md for the project DAG (collaboration-specific context)
3. Generate prompt files for propose, evaluate, synthesize, artifact-writing nodes
4. Generate the plan.json file with dialogue loop structure and gates

**What finalize receives:**
- Collaboration topic and framing (from intake)
- Context (from context-gather)
- Success criteria (from propose-success-criteria + approval)
- Chosen collaboration shape (from propose-collaboration-shape + approval)
- Output artifact definition (from identify-output-artifact)
- User approval of all above (from planning-gate)

**What finalize writes:**
- `.opencode/session-plans/{session-name}/plan.json` — the project DAG with dialogue loop
- `.opencode/session-plans/{session-name}/session-overview.md` — collaboration-specific context for user and agent
- `.opencode/session-plans/{session-name}/prompts/propose.md` — agent proposes node prompt
- `.opencode/session-plans/{session-name}/prompts/refine.md` — agent refines based on feedback node prompt
- `.opencode/session-plans/{session-name}/prompts/synthesize.md` — synthesize findings node prompt
- `.opencode/session-plans/{session-name}/prompts/document-artifact.md` — produce final artifact node prompt
- (additional prompts for gates/branches if shape requires them)

**Advance:** Call `close_session()` (terminal node)

---

## Planning Scaffold Principles (Collaborative)

1. **Understanding loop** handles the unknown: "Do we understand what we're collaborating on?"
2. **Success criteria identification** defines: "What makes this collaboration successful?"
3. **Collaboration shape selection** decides: "What iteration structure fits?"
4. **Output artifact identification** specifies: "What are we producing?"
5. **Info phase** teaches the planning agent how to design proper collaborative DAGs with dialogue loops and user feedback
6. **Planning gate** validates the collaboration plan before committing to the project DAG
7. **Finalize** instantiates the chosen shape with collaboration-specific content and dialogue loop structure

---

---

## Deep-Research Planning Scaffold

**Purpose:** Enable planning agents to generate valid deep-research project DAGs (shapes 4A-4D).

**Planning Agent's Job:** Generate a valid deep-research project DAG that:
- Enables iterative research where the agent discovers importance through evidence
- Has a chosen shape (4A-4D from PROJECT-DAG-DESIGN-SPEC.md)
- Has gates/loops where research direction can pivot or deepen
- Produces a research brief/findings report

**Planning Agent Needs To:**
1. Understand what we're researching (research question, scope)
2. Understand context/constraints that matter
3. Identify research angles/areas (what aspects need investigation?)
4. Identify source priorities (where to look: academic, blogs, code, interviews, docs, web, etc.?)
5. Identify success criteria (what makes a good research brief?)
6. Decide: which research shape? (linear angles, with gates, parallel, iterative refinement?)

**Key Insight:**
- Deep-research is like Collaborative in that it's about *discovering what matters* through iteration
- Instead of turn-based dialogue, it's iterative research where the agent discovers importance through evidence
- The output is a research brief, not predetermined

**Planning DAG Structure:**

```
entry (session-overview)
  ↓
[RESEARCH QUESTION UNDERSTANDING: understand what we're researching]
  research-intake → scout → clarify → evaluate-understanding
  (loop back if question not clear, advance if sufficient)
  ↓
[IDENTIFY RESEARCH ANGLES: what aspects need investigation?]
  propose-research-angles → evaluate-research-angles
  (agent identifies key research areas/angles)
  ↓
[IDENTIFY SOURCE PRIORITIES: where should we look?]
  propose-sources → evaluate-sources
  (academic papers? blogs? code? interviews? documentation? web?)
  ↓
[SHAPE SELECTION: decide research structure]
  propose-research-shape → evaluate-research-shape
  (shapes 4A-4D: linear angles, with gates, parallel, iterative)
  ↓
identify-success-criteria (what makes a good research brief?)
  ↓
[INFO PHASE: teach planning agent about research DAG design]
  (8 nodes from shared infrastructure, research-specific)
  ↓
planning-gate (user approval of research plan)
  ↓
finalize (write project DAG with research loop)
```

**Key Nodes:**

### research-intake
**Purpose:** Gather initial research question  
**Agent does:** Confirm research question, scope, what we're trying to understand  
**Advance:** Call `next_step()`

### scout
**Purpose:** Search for existing research and gaps  
**Agent does:** Find existing research, papers, documentation, prior work related to the question. Identify gaps.  
**Advance:** Call `next_step()`

### clarify
**Purpose:** Ask one critical clarifying question  
**Agent does:** Identify and ask the single most important outstanding question about what we're researching  
**Advance:** Call `next_step()`

### evaluate-understanding
**Purpose:** Decide if research question is clear enough  
**Agent does:** Is the research question well-defined? Do we understand scope? If yes, advance. If no, loop back.  
**Advance:**
- If clear: call `next_step()`
- If more clarity needed: call `next_step({ next: "scout" })`

### propose-research-angles
**Purpose:** Identify what angles/aspects need research  
**Agent does:** What key aspects of the question need investigation? What angles matter?  
**Advance:** Call `next_step()`

### evaluate-research-angles
**Purpose:** Validate the research angles  
**Agent does:** Are these the right angles? Do they cover the research space sufficiently?  
**Advance:**
- If good: call `next_step()`
- If need adjustment: call `next_step({ next: "propose-research-angles" })`

### propose-sources
**Purpose:** Identify where to research  
**Agent does:** What sources should we prioritize? (academic papers, blog posts, code examples, interviews, documentation, web search, etc.)  
**Advance:** Call `next_step()`

### evaluate-sources
**Purpose:** Validate source priorities  
**Agent does:** Are these the right sources to prioritize? Will they yield good evidence?  
**Advance:**
- If good: call `next_step()`
- If need adjustment: call `next_step({ next: "propose-sources" })`

### propose-research-shape
**Purpose:** Propose which research DAG shape is appropriate  
**Agent does:** Based on research question and angles, propose a shape (4A-4D):
- 4A (Simple Research Loop): clear angles, straightforward research
- 4B (Research with Decision Gates): uncertainty about direction mid-research
- 4C (Parallel Research Angles): multiple angles to explore simultaneously
- 4D (Iterative Research with Refinement): research that deepens through feedback/coverage evaluation  
**Advance:** Call `next_step()`

### evaluate-research-shape
**Purpose:** Validate the proposed research shape  
**Agent does:** Will this research structure help discover what matters?  
**Advance:**
- If good: call `next_step()`
- If needs adjustment: call `next_step({ next: "propose-research-shape" })`

### identify-success-criteria
**Purpose:** Define what a good research brief includes  
**Agent does:** What should the final research brief contain? What makes it complete? (Methodology, findings, sources, caveats, implications, etc.)  
**Advance:** Call `next_step()`

### [INFO PHASE]
**Purpose:** Teach planning agent about research DAG design  
**8 nodes from shared infrastructure, research-specific:**
- info-prime: "You now learn to design proper research DAGs"
- info-loop-analysis: Identify research loop patterns
- info-visit-counter: Recommend remaining_visits for research iteration loops
- info-gate-analysis: Recommend where decision gates should go in the research loop
- info-shape-ref: Reference the valid research shapes (4A-4D)
- info-validity-checks: DAG validity checklist for research DAGs
- info-flow-specific: Research-specific reminders (discovery vs. predetermined angles)
- info-summarize-consumption: Explicit summary of planning decisions made

**Advance:** Each node calls `next_step()` to next; last advances to planning-gate

### planning-gate
**Purpose:** User validation of research plan  
**Agent does:** Present full planning summary to user:
- Research question and scope
- Research angles identified and why
- Source priorities and why
- Proposed research shape and why
- Success criteria for the research brief
- Where research loop will have gates/pivots and why

**User decides:**
- Approve: proceed to finalize
- Redirect: loop back to angles, sources, or shape

**Advance:**
- If approved: call `next_step({ next: "finalize" })`
- If redirect to angles: call `next_step({ next: "propose-research-angles" })`
- If redirect to sources: call `next_step({ next: "propose-sources" })`
- If redirect to shape: call `next_step({ next: "propose-research-shape" })`

### finalize
**Purpose:** Write the project DAG  
**Agent does:**
1. Instantiate the chosen research project DAG shape with research loop
2. Generate session-overview.md for the project DAG (research-specific context)
3. Generate prompt files for research-execute, research-evaluate, synthesize, write-brief nodes
4. Generate the plan.json file with research loop structure and gates

**What finalize receives:**
- Research question and scope (from research-intake)
- Existing research context (from scout)
- Research angles (from propose-research-angles + approval)
- Source priorities (from propose-sources + approval)
- Chosen research shape (from propose-research-shape + approval)
- Success criteria (from identify-success-criteria)
- User approval of all above (from planning-gate)

**What finalize writes:**
- `.opencode/session-plans/{session-name}/plan.json` — the project DAG with research loop
- `.opencode/session-plans/{session-name}/session-overview.md` — research-specific context for executing agent
- `.opencode/session-plans/{session-name}/prompts/research-execute-angle-*.md` — one prompt per research angle
- `.opencode/session-plans/{session-name}/prompts/research-evaluate.md` — evaluation node prompt
- `.opencode/session-plans/{session-name}/prompts/synthesize.md` — synthesis node prompt
- `.opencode/session-plans/{session-name}/prompts/write-brief.md` — brief-writing node prompt
- (additional prompts for gates/branches if shape requires them)

**Advance:** Call `close_session()` (terminal node)

---

## Planning Scaffold Principles (Deep-Research)

1. **Research question understanding loop** handles the unknown: "Is the research question clear enough to research?"
2. **Research angles identification** decides: "What aspects of the question need investigation?"
3. **Source priorities identification** specifies: "Where should we look for evidence?"
4. **Research shape selection** chooses: "How should we structure the research iteration?"
5. **Success criteria identification** defines: "What makes a good research brief?"
6. **Info phase** teaches the planning agent how to design proper research DAGs with research loops and synthesis
7. **Planning gate** validates the research plan before committing to the project DAG
8. **Finalize** instantiates the chosen shape with research-specific content and research loop structure

---

## Summary: All Four Planning Scaffolds

All four planning scaffolds follow the same meta-principle: **Enable planning agents to generate valid project DAGs by helping them understand what's needed and selecting the right DAG shape.**

- **Generic:** Decompose work → understand subtasks → route agents → select project DAG shape (1A-1F)
- **Debug:** Understand bug → form hypothesis → identify investigation strategy → select project DAG shape (2A-2D)
- **Collaborative:** Understand collaboration topic → identify success → select dialogue shape (3A-3D)
- **Deep-Research:** Understand research question → identify angles and sources → select research shape (4A-4D)

Each planning scaffold is itself a DAG that demonstrates the principles it teaches: loops for iteration, gates for validation, mechanisms for handling unknowns.
