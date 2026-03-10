---
name: cpp-design-workflow
description: Structured design session for C++ systems — D1/D2/D3 modes
---

# C++ Design Workflow

## Purpose

Orchestrate a complete design session from problem statement to plan document.
Coordinates `cpp-researcher` and `cpp-explorer` in parallel during research phases.

## Trigger

Invoked by CppDev when the user runs `/cpp-design` or when a task requires non-trivial architecture decisions.

## Phase Map

```
Entry
  └─ Choose mode: D1 / D2 / D3
       ├─ D1: Conversation-first
       │    └─ Open dialogue → constraint lock-in → parallel research → plan doc
       ├─ D2: Brief-and-fan-out
       │    └─ 1-paragraph brief → parallel fan-out → draft → iterate
       └─ D3: Structured phases
            └─ Problem framing → design space → decision → plan doc
```

## D1 — Conversation-First

**Entry condition**: Problem space is unclear, constraints are unknown, or multiple valid architectural directions exist.

**Steps**:
1. CppDev asks open-ended questions to map the problem space
2. Constraints are identified and locked in (immovable vs. flexible)
3. CppDev launches `CppResearcher` + `CppExplorer` in parallel (via `task` tool):
   - `CppResearcher`: prior art, spec constraints, known footguns for this problem class
   - `CppExplorer`: existing codebase patterns, dependencies, integration points
4. Research results synthesized into a design draft
5. Draft reviewed with user
6. Plan doc produced from the plan doc template in `cpp-systems/templates/`

**Suitable for**: New subsystems, novel algorithmic problems, unclear performance requirements

## D2 — Brief-and-Fan-Out

**Entry condition**: Problem class is understood, user has a rough idea of direction, needs to move fast.

**Steps**:
1. User provides a 1-paragraph brief
2. CppDev immediately launches parallel research (via `task` tool):
   - `CppResearcher`: relevant standards/specs, API patterns
   - `CppExplorer`: current codebase state, affected components
3. CppDev drafts design (while research runs, primes on known patterns)
4. Research results integrated into draft
5. User iterates on draft (1-2 rounds)
6. Plan doc produced

**Suitable for**: Adding a new component, integrating a known library, extending existing architecture

## D3 — Structured Phases

**Entry condition**: High-stakes decision, needs documented rationale (team review, audit, or personal reference).

**Steps**:

### Phase 1: Problem Framing
- Problem statement (1 paragraph, precise)
- Success criteria (measurable)
- Non-goals (explicit)
- Constraints (hardware, ABI, performance, schedule)

### Phase 2: Design Space
- At least 2 alternatives explored
- For each: trade-offs, risks, implementation cost
- `CppResearcher` validates technical claims (via `task` tool, in parallel with `CppExplorer`)
- `CppExplorer` validates integration assumptions (via `task` tool, in parallel with `CppResearcher`)

### Phase 3: Decision
- Chosen approach with rationale
- Risks acknowledged and mitigated
- ADR (Architecture Decision Record) section

### Phase 4: Plan Document
- Implementation plan from `plan-doc-template.md`
- Milestones and verification criteria
- Open questions with owners

**Suitable for**: Major refactors, performance architecture changes, team-reviewable decisions

## Context Files

Context is loaded by CppDev via ContextScout. If `.opencode/context/cpp-systems/` exists, only local context is used. If it doesn't exist, global `~/.config/opencode/context/cpp-systems/` is the fallback. Key files: design-first flow process, plan doc template, domain files on-demand.

## Agent Coordination

```
CppDev (orchestrator)
  ├─ CppResearcher  [parallel, via task tool, read-only]
  ├─ CppExplorer    [parallel, via task tool, read-only, 1 goal per instance]
  └─ produces → plan doc (written by CppDev)
```

`CppCoder` and `CppBuildEngineer` are NOT invoked during design — they are implementation agents.
