# Planning Scaffolds

Complete set of five planning scaffolds implementing the planning session design specifications.

## Overview

Each planning scaffold is a DAG that guides a planning agent through understanding a task/bug/topic/research, making design decisions, and writing a project DAG.

| Mode | Purpose | Nodes | Shapes |
|------|---------|-------|--------|
| **plan-session** | Decompose work, route agents, select execution shape | 21 | 1A-1F |
| **plan-debug** | Understand bug, form hypothesis, select investigation structure | 20 | 2A-2D |
| **plan-collaborative** | Understand collaboration, define success, select dialogue shape | 20 | 3A-3D |
| **plan-deep-research** | Understand research question, identify angles/sources, select research shape | 22 | 4A-4D |
| **plan-deep-review** | Understand review target, establish criteria, select review structure | 17 | Linear |

## Structure

Each scaffold (`plan-{mode}/`) contains:

```
plan-{mode}/
  plan.json              # The planning DAG (100 nodes total across all modes)
  prompts/
    session-overview.md  # Introduction to the planning mode
    {node-name}.md       # One prompt per DAG node (101 total)
```

## DAG Design Constraints

All scaffolds follow these constraints:

1. **Loops ≥2 nodes** — No single-node loops; always at least 2 nodes minimum
2. **Loop branching** — Every loop has at least one branching node allowing exit
3. **Terminal paths** — All paths from entry reach a terminal node (no `next` field)
4. **Branching format** — Multiple `next` options use object format with `desc` and `choose_when`

Example branching:
```json
"evaluate-understanding": {
  "next": {
    "scout": {
      "desc": "Need more context",
      "choose_when": "Understanding insufficient"
    },
    "propose-shape": {
      "desc": "Ready to decide shape",
      "choose_when": "Enough context gathered"
    }
  }
}
```

## Info Phase (8 Nodes)

All scaffolds include an INFO phase teaching planning agents about DAG design:

1. **info-prime** — Introduction to learning
2. **info-loop-analysis** — Loop patterns and structure
3. **info-visit-counter** — `remaining_visits` counters
4. **info-gate-analysis** — Gate placement and branching
5. **info-shape-ref** — Reference to valid DAG shapes
6. **info-validity-checks** — DAG validation checklist
7. **info-flow-specific** — Mode-specific principles
8. **info-summarize-consumption** — Summary of planning decisions

## Planning Flow

Each scaffold follows:

```
Entry (session-overview)
  ↓
Discovery Loop (gather context, ask clarifying questions)
  ↓
Propose/Evaluate/Refine Loops (mode-specific decision-making)
  ↓
Info Phase (teach DAG design principles)
  ↓
Planning Gate (user approval)
  ↓
Finalize (write project DAG)
  ↓
Terminal (close_session)
```

## Modes

### plan-session (21 nodes)
**Task decomposition and execution planning**

- Gathers task goal, acceptance criteria, constraints
- Scouts codebase for relevant context
- Proposes and validates a generic DAG shape (1A-1F)
- Decomposes task into 3-9 subtasks
- Routes agents to subtasks
- Finalizes project DAG

Shapes: 1A (Linear), 1B (Linear with Loop), 1C (Decision Gate), 1D (Branching), 1E (Loop with User Gate), 1F (Complex)

### plan-debug (20 nodes)
**Bug investigation planning**

- Gathers bug description, reproduction steps, impact
- Scouts affected code
- Forms initial hypothesis
- Proposes and validates investigation shape (2A-2D)
- Outlines test/verification strategy
- Finalizes diagnosis DAG with loop structure

Shapes: 2A (Simple Loop), 2B (Loop with User Gate), 2C (Branching), 2D (Iterative Investigation)

### plan-collaborative (20 nodes)
**Design collaboration planning**

- Understands collaboration topic and framing
- Gathers relevant context
- Defines success criteria
- Proposes and validates dialogue shape (3A-3D)
- Identifies output artifact
- Finalizes collaboration DAG with user feedback loops

Shapes: 3A (Linear Exploration), 3B (Exploration with Gate), 3C (Multi-Path), 3D (Iterative Refinement)

### plan-deep-research (22 nodes)
**Research planning**

- Understands research question and scope
- Scouts existing research
- Identifies research angles (key aspects to investigate)
- Proposes source priorities (where to look)
- Proposes and validates research shape (4A-4D)
- Defines success criteria for research brief
- Finalizes research DAG with evidence-gathering loops

Shapes: 4A (Simple Loop), 4B (Decision Gates), 4C (Parallel Angles), 4D (Iterative Refinement)

### plan-deep-review (17 nodes)
**Review planning**

- Understands review target and scope
- Scouts what will be reviewed
- Proposes and validates review criteria
- Identifies review scope and coverage areas
- Finalizes review DAG
- Typically linear; can support iteration loops if needed

## Plugin Integration

The planning-enforcement plugin expects these DAGs at:

```
{install-root}/planning/
  plan-session/plan.json
  plan-debug/plan.json
  plan-collaborative/plan.json
  plan-deep-research/plan.json
  plan-deep-review/plan.json
```

Tools provided by the plugin:

- `plan_session()` — Activate session planning
- `plan_debug()` — Activate debug planning
- `plan_collaborative()` — Activate collaborative planning
- `plan_deep_research()` — Activate deep-research planning
- `plan_deep_review()` — Activate deep-review planning
- `next_step({ next?: string })` — Advance DAG
- `close_session()` — Finalize and clean up
- `reset_counters(visits?: number)` — Reset exhausted visit counters

## Principles

### Design Philosophy

- **Planning is lightweight** — Focus on DAG structure reasoning, not problem-solving
- **Gates and loops handle unknowns** — Don't try to predict everything; structure the DAG to handle discovery
- **Execution is sophisticated** — The real reasoning happens when the agent encounters unknowns and proposes a direction
- **User gates are runtime decisions** — Not "approving a plan" but validating decisions *during* execution

### Loop Design

Loops in project DAGs serve specific purposes:

- **Build-test cycles** (generic, shape 1B) — Iteration until quality criteria met
- **Diagnosis loops** (debug, shape 2A/2B) — Hypothesis testing until root cause found
- **Refinement loops** (collaborative, shape 3D) — User feedback drives deeper work
- **Research loops** (deep-research, shape 4A/4D) — Evidence gathering and angle exploration

All loops must:
- Have ≥2 nodes (never single-node loops)
- Have a branching exit node (so `remaining_visits` can be enforced)
- Set `remaining_visits` on the branching node (typical: 3-5 for most scenarios)

### Gate Design

Gates are execution-time decision points:

- **Agent researches/proposes** — Gathers options and recommends
- **User validates/chooses** — Reviews proposal and decides direction
- Not "approving a plan"; validating decisions *in context* when agent has more information

Gate node structure:

```json
"auth-decision": {
  "type": "gate",
  "prompt": "plan-generic/prompts/auth-decision.md",
  "next": {
    "jwt-path": {
      "desc": "Use JWT for stateless auth",
      "choose_when": "Stateless preference or horizontal scaling"
    },
    "oauth-path": {
      "desc": "Use OAuth for federated identity",
      "choose_when": "Third-party integration or SSO"
    }
  }
}
```

## Validation

All scaffolds pass:

- ✓ Schema validation (required fields present and correct types)
- ✓ Reference validation (all `next` node IDs exist)
- ✓ Loop structure (≥2 nodes, branching exit)
- ✓ Terminal paths (all paths reach a node with no `next`)
- ✓ Prompt resolution (all nodes have corresponding prompt files)

## Status

**COMPLETE AND LOCKED**

All five planning scaffolds are production-ready and aligned with:

- `docs/dev/PROJECT-DAG-DESIGN-SPEC.md` — Valid execution DAG shapes
- `docs/dev/PLANNING-SESSION-DESIGN-SPEC.md` — What planning accomplishes
- `docs/dev/PLANNING-SCAFFOLD-DESIGN-SPEC.md` — Meta-DAG structure

Ready for plugin loading and planning session activation.
