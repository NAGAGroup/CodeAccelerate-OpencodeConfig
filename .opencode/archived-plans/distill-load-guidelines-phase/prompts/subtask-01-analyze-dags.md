<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01: Analyze Current DAG Structures

## Objective

Read all 5 planning DAG files to understand their current node sequences, loop patterns, and gate placements. This analysis will inform the design of the new informational phase architecture.

## Scope

**Read:**
- `files/planning/plan-generic/plan.json`
- `files/planning/plan-debug/plan.json`
- `files/planning/plan-collaborative/plan.json`
- `files/planning/plan-deep-research/plan.json`
- `files/planning/plan-deep-review/plan.json`

## Constraints

- Read only — do not modify any files
- Focus on: node IDs, node types, loop structures (where `next` points backward), gate nodes (type "gate"), and the position of `review-gate` or equivalent

## Delegation

**Agent:** @ContextScout (parallel × 5)
**Model:** haiku-like
**Prompt structure:**
- Scout 1: Read `files/planning/plan-generic/plan.json` — extract node IDs, types, loop edges, gate positions
- Scout 2: Read `files/planning/plan-debug/plan.json` — same
- Scout 3: Read `files/planning/plan-collaborative/plan.json` — same
- Scout 4: Read `files/planning/plan-deep-research/plan.json` — same
- Scout 5: Read `files/planning/plan-deep-review/plan.json` — same
- Each scout returns a structured summary: node list, loop nodes, gate nodes, current pre-gate sequence

## Advance

Call `next_step()` when all 5 scouts have returned their summaries.
