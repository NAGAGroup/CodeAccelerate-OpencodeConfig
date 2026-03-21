# Planning Session Design Specification

**Status:** LOCKED IN  
**Date:** 2026-03-21  
**Purpose:** Define what planning sessions accomplish: gathering context to select the right DAG shape, not solving the problem itself.

---

## Core Principle

**Planning sessions are lightweight by design.**

Planning agents spend effort on **DAG structure reasoning**, not **problem-solving reasoning**.

A planning session gathers enough context to answer: **"Which valid DAG shape from the project DAG spec is right for this specific task?"**

Not: "Solve the problem."  
Not: "Predict all unknowns."  
But: "Set up the right DAG structure so the executing agent can solve it with good mechanisms for handling unknowns."

---

## Generic Planning Session

**Outcome:** Select the right generic DAG shape (1A-1F from PROJECT-DAG-DESIGN-SPEC.md)

Planning gathers context to answer:
- Is this task straightforward? → **Shape 1A (Simple Linear)**
- Does implementation require iteration? → **Shape 1B (Linear with Loop)**
- Is there uncertainty about direction early? → **Shape 1C (Linear with Decision Gate)**
- Are there multiple valid approaches? → **Shape 1D (Branching)**
- Is there iterative refinement with user checkpoints? → **Shape 1E (Loop with User Gate)**
- Does this task need multiple mechanisms combined? → **Shape 1F (Complex DAG)**

Planning does NOT predict which path execution will take. It structures the DAG so the executing agent can reason and the user can validate key decisions.

---

## Debug Planning Session

**Outcome:** Select the right debug DAG shape (2A-2D from PROJECT-DAG-DESIGN-SPEC.md)

Planning gathers context to answer:
- Simple diagnosis loop? → **Shape 2A (Simple Diagnosis Loop)**
- Need user to validate hypothesis before testing? → **Shape 2B (Loop with User Gate)**
- Multiple possible root causes to branch? → **Shape 2C (Branching Diagnosis)**
- Multiple investigation phases needed? → **Shape 2D (Iterative Investigation)**

Planning does NOT predict the root cause. It sets up the investigation loop so the executing agent discovers it.

---

## Collaborative Planning Session

**Outcome:** Select the right collaborative DAG shape (3A-3D from PROJECT-DAG-DESIGN-SPEC.md)

Planning gathers context to answer:
- Linear exploration of known areas? → **Shape 3A (Simple Explore-Then-Synthesize)**
- Uncertainty about exploration scope? → **Shape 3B (Explore with Decision Gate)**
- Multiple design directions to evaluate? → **Shape 3C (Multi-Path Design Exploration)**
- Design that evolves through feedback? → **Shape 3D (Iterative Design Refinement)**

Planning does NOT decide the design. It structures exploration and decision loops so the executing agent discovers the design through reasoning.

---

## Deep-Research Planning Session

**Outcome:** Select the right deep-research DAG shape (4A-4D from PROJECT-DAG-DESIGN-SPEC.md)

Planning gathers context to answer:
- Linear research of known angles? → **Shape 4A (Simple Research Loop)**
- Uncertainty about direction mid-research? → **Shape 4B (Research with Decision Gates)**
- Multiple angles to explore in parallel? → **Shape 4C (Parallel Research Angles)**
- Research that deepens through feedback? → **Shape 4D (Iterative Research with Refinement)**

Planning does NOT predict which research angles will be important. It structures the loop so the executing agent discovers what matters through evidence.

---

## Planning Session Structure (All Modes)

Each planning session:
1. **Gathers context** — enough information to understand the task/bug/idea/research-question
2. **Identifies constraints** — what's fixed, what's flexible
3. **Identifies unknowns** — where will decisions/iteration/branching be needed?
4. **Selects a DAG shape** — which of the valid shapes fits?
5. **Gets user validation** — does the planning agent's proposed shape make sense?
6. **Finalize writes the project DAG** — instantiate the chosen shape with project-specific content

The planning scaffold is infrastructure for accomplishing these steps. The specific node structure may vary by mode, but the fundamental work is always: **understand what's known, identify where mechanisms (gates/loops/branches) are needed, select the right DAG shape, get user sign-off, write the DAG.**

---

## Planning ≠ Execution

**Planning agent's job:** "What DAG structure will help the executing agent handle unknowns well?"

**Executing agent's job:** "Given this DAG structure, how do I solve the problem?"

These are fundamentally different tasks. Planning is lightweight because it delegates the heavy reasoning to execution time, when more information is available and the agent can reason in context.
