---
name: dag-building-patterns
description: Procedural patterns for building phase DAGs — sequential, branching, convergence, and stopping points.
---
These patterns show the exact tool call sequences for common plan topologies. Phase IDs, types, and options are abstract placeholders.

```
// from is ALWAYS a JSON array string, even for a single parent.
// Single parent: from='["phase-id"]'   Convergence: from='["phase-a", "phase-b"]'

// Sequential: A → B → C
add_first_phase(plan_name=[plan], phase_id=[1-phase-a], phase_type=[type], phase_options=[{...}])
add_phase(plan_name=[plan], phase_id=[2-phase-b], phase_type=[type], phase_options=[{...}], from='["1-phase-a"]')
add_phase(plan_name=[plan], phase_id=[3-phase-c], phase_type=[type], phase_options=[{...}], from='["2-phase-b"]')


// Branching: decision → two branches
add_first_phase(plan_name=[plan], phase_id=[1-phase-a], phase_type=[type], phase_options=[{...}])
add_phase(plan_name=[plan], phase_id=[2-decision], phase_type=agentic-decision-gate, phase_options=[{"question": "...", "branches": ["option-x", "option-y"]}], from='["1-phase-a"]')
add_phase(plan_name=[plan], phase_id=[3a-branch-x], phase_type=[type], phase_options=[{...}], from='["2-decision"]')
add_phase(plan_name=[plan], phase_id=[3b-branch-y], phase_type=[type], phase_options=[{...}], from='["2-decision"]')


// Convergence: two branches → shared next phase
add_phase(plan_name=[plan], phase_id=[4-shared], phase_type=[type], phase_options=[{...}], from='["3a-branch-x", "3b-branch-y"]')


// Stopping point within a branch (leaf)
add_phase(plan_name=[plan], phase_id=[3c-stop], phase_type=write-notes, phase_options=[{...}], from='["2-decision"]')
// 3c has no further add_phase calls — it is a leaf


// Three-way branch with one stopping early
add_phase(plan_name=[plan], phase_id=[2-decision], phase_type=agentic-decision-gate, phase_options=[{"question": "...", "branches": ["x", "y", "z"]}], from='["1-phase-a"]')
add_phase(plan_name=[plan], phase_id=[3a-branch-x], phase_type=[type], phase_options=[{...}], from='["2-decision"]')
add_phase(plan_name=[plan], phase_id=[3b-branch-y], phase_type=[type], phase_options=[{...}], from='["2-decision"]')
add_phase(plan_name=[plan], phase_id=[3c-stop], phase_type=write-notes, phase_options=[{...}], from='["2-decision"]')
add_phase(plan_name=[plan], phase_id=[4-shared], phase_type=[type], phase_options=[{...}], from='["3a-branch-x", "3b-branch-y"]')
// 3c-stop is a leaf — not referenced in any from
```
