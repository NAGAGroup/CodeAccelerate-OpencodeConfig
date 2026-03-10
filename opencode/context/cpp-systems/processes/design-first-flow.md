# Design-First Development Flow

## Overview

The design-first flow is used when starting a new feature, component, or significant refactor where upfront design reduces implementation risk. It is not enforced — treat this as a template and adapt to the specific situation.

## Entry Point

Triggered via `/cpp-design` command or when the orchestrator detects design intent in a request (e.g., "I want to build...", "how should I structure...", "design a...").

The orchestrator asks: **Which brainstorming mode?**

```
How would you like to approach this?

1. Conversation-first (D1): We discuss until direction is solid, then research + write plan
2. Brief-in, research-out (D2): Drop a rough brief, I fan out research immediately, then we iterate on the draft
3. Structured phases (D3): Step-by-step: problem framing → design space → decisions → plan doc

[1/2/3]
```

## D1: Conversation-First

**Pattern**: Freeform → lock-in → parallel research → plan doc

```
Phase 1: Freeform discussion
  - User explains goal, constraints, context
  - Orchestrator asks clarifying questions
  - No subagents yet

Phase 2: Direction lock-in
  - User signals "lock it in" / "looks good" / "let's go"
  - Orchestrator confirms understanding

Phase 3: Parallel delegation
  - cpp-researcher: pulls relevant specs, prior art, known footguns  - cpp-explorer (optional): scans codebase for related patterns
  - Both run in parallel

Phase 4: Synthesis + plan doc
  - Orchestrator synthesizes research results
  - cpp-coder writes plan doc to agreed location
  - User reviews and requests changes
```

**Best for**: Fuzzy problems, exploratory thinking, when you need to talk through the problem space.

## D2: Brief-In, Research-Out

**Pattern**: Brief → immediate fan-out → draft → iterate

```
Phase 1: Brief intake
  - User provides rough description (can be terse)
  - Orchestrator clarifies: target, constraints, existing code to build on

Phase 2: Immediate parallel fan-out
  - cpp-researcher: C++ standards, library APIs, known footguns
  - cpp-explorer: scans codebase for related patterns, naming, existing abstractions
  - Both start immediately

Phase 3: Draft plan
  - Orchestrator synthesizes into structured draft plan
  - Presents draft for user review

Phase 4: Iterate
  - User requests changes conversationally
  - Orchestrator updates draft
  - cpp-coder writes final plan doc when approved
```

**Best for**: Clear direction but need research grounding before committing to design decisions.

## D3: Structured Phases

**Pattern**: Sequential phases with optional subagent delegation at each gate

```
Phase 1: Problem Framing
  - Orchestrator: "What problem are we solving? What does success look like?"
  - Optional: cpp-researcher for prior art / existing solutions
  - Output: Problem statement (1-3 sentences)

Phase 2: Design Space Exploration
  - Orchestrator: "What are the main design options? What are the tradeoffs?"
  - Optional: cpp-explorer to check how existing codebase does similar things
  - Output: 2-4 options with tradeoffs

Phase 3: API / Architecture Decision
  - Orchestrator: "Which approach? What does the public interface look like?"
  - User and orchestrator converge on decision
  - Output: Chosen approach + rationale

Phase 4: Implementation Planning
  - Orchestrator maps chosen design to implementation tasks
  - cpp-coder writes plan doc

Optional: User can skip or combine phases.
```

**Best for**: High-stakes designs, team-facing APIs, or when you want a disciplined process.

## Plan Document Format

See `templates/plan-doc-template.md` for the full template. Brief summary:

```
# Plan: <Component Name>

## Design Spec
- Problem statement
- Constraints and non-goals
- Chosen approach with rationale
- Public API sketch

## Implementation Spec
- Data structures
- Key algorithms / patterns
- Error handling approach
- Testing strategy

## Implementation Plan
- [ ] Task 1 (file/component scope)
- [ ] Task 2
- ...
```

## Plan Doc Location

Ask user at start of flow:
- `/tmp/plan-<name>.md` — current session only
- `<repo>/docs/plans/plan-<name>.md` — persistent in repo
- `<repo>/PLAN.md` — single active plan at repo root

## Implementation Approach Selection

After plan is approved, ask:

```
How should we implement this?

1. TDD: write tests first, then implement until tests pass
2. Source-first: implement all at once, then write tests
3. Custom: describe your approach
```

See `processes/impl-approaches.md` for full details on each approach.
