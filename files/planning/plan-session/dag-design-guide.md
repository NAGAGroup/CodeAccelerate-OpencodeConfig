# DAG Design Guide

This guide is the shared reference for two agents: @dag-designer (who builds DAGs) and @dag-reviewer (who evaluates them). Both read this guide before starting work. The guide teaches design principles that are also review criteria.

## What execution DAGs are

An execution DAG is a directed acyclic graph where each node is a component type from the library. You design the **shape of the work, not the content**. The executing agent navigates the DAG to accomplish the user's goal.

Think of the DAG as **capacity, not prescription**. You provide enough structure for the work to succeed — the number of nodes, their types, their order, and how they connect. The executing agent decides what to actually do at each node. The agent may use nodes differently than you imagined, and that is fine.

## What you control and what you don't

**You control:**
- Which component types appear in the DAG
- How many nodes of each type
- How nodes connect (precedence and branching)
- Which branches exist and their conditions
- The rationale you store to Qdrant explaining structural decisions

**You do not control:**
- What the agent actually does at each node
- Component prompts are static templates, identical for all nodes of the same type
- You cannot customize prompts per node — the agent reads planning notes from Qdrant to determine what work is needed at each step

This is the most common design mistake. Designers try to "embed" task specifics into the node structure by writing prescriptive rationale. That does not work. The agent chooses what to implement; the DAG provides capacity and ordering.

## Design principles

These principles are both design guidance and review criteria. Each principle explains why it matters.

**Investigation before implementation.** The agent needs to understand the current state before it changes anything. Place project-search-and-analysis nodes before work-item nodes. Investigation nodes establish what exists, what is broken, and what constraints apply.

**Verify after every significant change.** Every work-item node should be followed by a verify node. Verification batching (multiple work-items before any verify) makes failures hard to isolate. Incremental verification pinpoints which change broke what.

**Commit at stable checkpoints.** After a verified change is a natural commit point. Commits create savepoints the team can return to. Use commit nodes at stable save points, usually after verification succeeds.

**Compression at context boundaries.** After phases that produced substantial notes, place a compress → kickoff-refresher pair. The pattern is: write-notes → compress → kickoff-refresher. kickoff-refresher must immediately follow compress — it reloads skills and retrieves Qdrant context so the agent re-establishes working understanding. Compression without kickoff-refresher leaves the agent disoriented.

**Branching for genuine alternatives.** Use decision-gate when the right path depends on what the agent discovers. Use user-decision-gate when the user must choose. Each branch must have enough nodes to handle its scenario. Do not create branches that share nodes — each branch should be a complete path.

**plan-fail as the default terminal for unresolved paths.** If a branch represents failure, end it in plan-fail. Never end a failure branch in plan-success. plan-success signals successful completion; plan-fail signals work remains or the approach failed.

**Err toward more nodes.** Extra capacity costs time but does not cause harm. Missing capacity causes failures that require replanning. When unsure whether a step is needed, include it.

## Component selection guidance

Use CATALOGUE.md for the full component list. This section addresses non-obvious decisions:

**project-search-and-analysis vs. sequential-thinking:** Use project-search-and-analysis when the agent needs to understand the current state of the codebase (existing code, structure, tests, configuration). Use sequential-thinking for a pure reasoning step that requires no external input (analyzing notes, planning an approach, reasoning through options).

**write-notes vs. decision-gate for capturing an outcome:** write-notes stores findings to Qdrant so later nodes can retrieve them. decision-gate chooses a branch based on what was discovered. Use write-notes to persist findings; use decision-gate when a branch choice depends on what was learned.

**user-discussion vs. user-decision-gate:** user-decision-gate is for binary or multi-choice branching decisions where the user selects a path. user-discussion is for open-ended conversation that does not drive a branch — the agent continues to the next node afterward.

**autonomous-work:** Only include if the user explicitly approved autonomous work during planning. autonomous-work dispatches an agent with no tool restrictions or step limits. It bypasses all safety constraints the framework provides. Use it only with explicit user consent.

## Node IDs and naming

Good node IDs are descriptive of purpose: work-fix-auth-validation, verify-auth-tokens, investigate-logging-system. Bad IDs are generic: node-1, step-3, work-item-2.

Node IDs appear in decision-gate and user-decision-gate nodes where the agent routes to the next step. Meaningful IDs tell the executor what it is routing to. Descriptive IDs also make DAG diagrams readable and help the reviewer understand intent.

## Structural patterns

These are common, correct shapes for different scenarios.

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
search → search → write-notes → compress → kickoff-refresher → 
work-item → verify → work-item → verify → commit → 
write-notes → compress → kickoff-refresher → 
work-item → verify → commit → plan-success
```

## Writing the rationale — stored to Qdrant

The rationale IS the Qdrant notes. It is not a separate document. The designer stores notes about structural decisions to the same Qdrant collection used throughout the planning session. The executing agent retrieves these notes at the execution-kickoff node.

For each significant structural decision, store a note explaining:
- Why this component type at this position
- What the executor is expected to use this node for
- What failure scenarios the structure handles
- What assumptions the structure makes

The executing agent reads the rationale to understand the designer's intentions without being bound by them. The rationale enables the executing agent to make informed decisions when the unexpected happens.

**Special handling for branching nodes:** decision-gate and user-decision-gate nodes require explicit rationale notes. Store a note for each conditional node by its exact node ID, explaining what each branch means and when it should be taken. The executing agent retrieves these notes at decision points to make informed branching choices.

## Anti-patterns

Each anti-pattern is named, shown, and explained. They fail in specific ways.

**Investigation-free work**

What it looks like: work-item as the first or second node, with no project-search-and-analysis preceding it.

Why it fails: The agent arrives at the work node without understanding the current state of the codebase, existing structure, or constraints. It will either make unfounded assumptions or spend the work node doing what the investigation node should have done, leading to ineffective or broken changes.

**Verification batching**

What it looks like: work-item → work-item → work-item → verify

Why it fails: When verification finds a problem, it is unclear which work-item caused it. Was it the first change, the second, or an interaction between them? Incremental verification — one work-item followed by one verify — isolates failures to specific changes and makes debugging and rollback possible.

**Compress without kickoff-refresher**

What it looks like: compress → work-item (or any node that is not kickoff-refresher)

Why it fails: After compression the agent has lost its methodology skills and working context. The compress node reduces token usage, but it strips the agent's established context. kickoff-refresher restores both the methodology and the Qdrant context. Skipping kickoff-refresher produces disoriented execution — the agent must re-establish understanding instead of proceeding with work.

**Per-node prescription in rationale**

What it looks like: Rationale note says "At the work-item node, modify the config file to add setting X"

Why it fails: The agent decides what to implement, not the DAG. Prescriptive rationale notes create expectations that conflict with the agent's judgment when conditions are different from what the designer assumed. If the config file is missing, locked, or requires a different change, the prescriptive note creates confusion. Write rationale that explains intent and context, not implementation steps.

**Ending failure branches in plan-success**

What it looks like: decision-gate → (fail path) → plan-success

Why it fails: plan-success signals successful completion to the user. A failure path that terminates in plan-success gives false confirmation — the user believes the goal was met when it was not. Use plan-fail for failure terminals so the user and the reviewing agent know the approach did not succeed.

**autonomous-work without user approval**

What it looks like: autonomous-work included as a default fallback or convenience escape hatch when the design is unsure

Why it fails: autonomous-work dispatches an agent with no tool restrictions or step limits. It bypasses every safety constraint the framework provides — no step validation, no context limits, no review. Include autonomous-work only when the user explicitly requested and approved autonomous execution during planning. Treat it as an exception, never as a default.
