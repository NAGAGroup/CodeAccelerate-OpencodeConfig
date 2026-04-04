# DAG Design Guide

## What you are designing

An execution DAG is a directed acyclic graph. Each node is a component type from the library. The executing agent works through the DAG to accomplish the user's goal.

You design the shape of the work, not the content. The executing agent decides what to do at each node.

## What the executing agent receives

The agent gets:
- The user's request and problem decomposition
- All planning notes from this session
- What is in scope and what is not
- The full DAG
- Your rationale for the DAG structure

The agent does NOT get task-specific instructions per node. Every node of the same type has the same prompt. The agent reads planning notes to determine what work is needed at each step.

## How to think about DAG design

Design with specific steps in mind. Know what you expect each node to accomplish. But that expectation is never written into the node — it lives only in the DAG's shape and your rationale.

The DAG is capacity, not prescription. You provide enough structure for the work to succeed. The executing agent may use nodes differently than you imagined, and that is fine.

## Component types

Load the catalogue via `get_planning_components_catalogue` for the full list. The major types:

- **project-search-and-analysis** — investigation. Agent chooses scout or insurgent at runtime.
- **work-item** — any project mutation. Agent chooses implementation or documentation subagent at runtime.
- **verify** — verification of any kind. Agent decides what verification means at that step.
- **run-project-commands** — shell operations.
- **commit** — git checkpoint.
- **research** — single focused web search.
- **deep-research** — broad domain exploration.
- **decision-gate** — agent assesses evidence and chooses a branch.
- **user-decision-gate** — user chooses a branch.
- **write-notes** — capture findings.
- **compress** — reduce context.
- **session-overview-refresher** — re-establish context after compression.
- **sequential-thinking** — pure reasoning step.
- **user-discussion** — collect user input mid-execution.
- **agentic-loop** — fully autonomous execution. User must have approved this.
- **plan-fail** / **plan-success** — terminal nodes.

## DAG design principles

**Err toward more nodes.** Extra capacity costs time but does not cause harm. Missing capacity causes failures that require replanning. When unsure whether a step is needed, include it.

**Investigation before implementation.** The agent needs to understand before it changes. Place `project-search-and-analysis` nodes before `work-item` nodes.

**Verification after implementation.** Every significant change should be followed by a `verify` node. Do not batch multiple changes before verifying.

**Commit at stable checkpoints.** After a verified change is a natural commit point.

**Compression at context boundaries.** After phases that produced substantial notes, compress before moving on. The pattern is: `write-notes` → `compress` → `session-overview-refresher`.

**Branching for genuine alternatives.** Use `decision-gate` when the agent might need different paths based on what it discovers. Each branch must have enough nodes to handle its scenario.

**plan-fail as the default terminal for unresolved paths.** If a branch represents failure, end it in `plan-fail`. Only use `agentic-loop` if the user explicitly approved fully autonomous work.

## Writing the rationale

The rationale document is as important as the DAG. For each significant structural decision, explain:
- Why this component type at this position
- What you expect the executor will use this node for
- Why nodes are ordered and connected the way they are
- What failure scenarios the structure handles
- What assumptions the structure makes

The executing agent reads the rationale to understand your intentions without being bound by them.

## Common patterns

**Simple linear task:**
```
search → work-item → verify → commit → plan-success
```

**Task with research dependency:**
```
search → research → work-item → verify → commit → plan-success
```

**Multi-step implementation:**
```
search → work-item → verify → work-item → verify → commit → plan-success
```

**Branching on verification outcome:**
```
search → work-item → verify → decision-gate
  ├─ (pass) → commit → plan-success
  └─ (fail) → work-item → verify → decision-gate
       ├─ (pass) → commit → plan-success
       └─ (fail) → plan-fail
```

**Complex task with compression:**
```
search → search → write-notes → compress → refresher →
work-item → verify → work-item → verify → commit →
write-notes → compress → refresher →
work-item → verify → commit → plan-success
```

## Examples

✓ Good: overcautious structure with clear rationale
"I included two work-item nodes because the research suggested two distinct areas need changes. If the agent can handle both in one step, it will complete the second node quickly."

✓ Good: verification after each implementation
"Each work-item is followed by a verify node. The changes could interact in unexpected ways. Verifying incrementally is safer than batching."

✓ Good: branching with fail path
"The decision-gate after verification routes to continued work or plan-fail. If verification reveals fundamental problems, failing early preserves the notes for a better second attempt."

✗ Bad: prescribing what each node should do
"Node 3 (work-item): modify the configuration file to add the new setting." — the agent decides what to implement, not the DAG.

✗ Bad: too few nodes
"search → work-item → plan-success" — no verification, no commit, no fallback.

✗ Bad: agentic-loop without user approval
Using agentic-loop as the default fallback instead of plan-fail.
