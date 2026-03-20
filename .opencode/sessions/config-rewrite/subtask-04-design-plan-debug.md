# Subtask 04 — Design: /plan-debug DAG JSON + Session JSON

## Delegation
**Agent:** HeadWrench direct (collaborative with user — no subagent)
**Model:** anthropic/claude-sonnet-4-6

---

## Objective
Design the /plan-debug planning DAG JSON and the resulting session JSON collaboratively with the user. /plan-debug is the investigation/diagnosis session type.

> This subtask is **collaborative**. Work through the design together. Do NOT pre-solve.

---

## Context
- DAG node schema locked in subtask 02 (see `notes/dag-node-schema.md`)
- /plan-generic design finalized in subtask 03 (see `notes/plan-generic-design.md`)
- /plan-debug = investigation/diagnosis: hypothesis-driven, structured test-and-learn loop

---

## Todolist

- [ ] [⏸ PAUSE] Design the /plan-debug planning DAG JSON together
  - What makes a debug session different from a generic build session?
  - Hypothesis formation → evidence gathering → test → refine loop — how does this map to DAG nodes?
  - Where does the user provide the problem statement? What info is captured?
  - What are the exit conditions? (root cause identified? workaround found?)
- [ ] [⏸ PAUSE] Design the resulting session JSON (the output of /plan-debug)
  - How is the debug session artifact structured?
  - Does it differ from /plan-generic's session artifact, or share the same schema?
- [ ] [⏸ PAUSE] User approves both JSONs
- [ ] Write approved designs to `notes/plan-debug-design.md`
- [ ] [🚫 GATE] User confirms /plan-debug design before moving to /plan-collaborative

---

## Scope
- Design the /plan-debug planning DAG (the JSON the slash command loads)
- Design the session artifact produced at end of planning
- Out of scope: plugin implementation, other session types

## Constraints
- Must use the DAG node schema from subtask 02
- Debug session must be resumable (investigation state persisted across compaction)
- Hypothesis tracking must be explicit in the artifact

## Output
- `notes/plan-debug-design.md` — planning DAG JSON + session artifact schema, with examples

---

*Checkpoint: `wip: subtask 04 complete — plan-debug design`*
