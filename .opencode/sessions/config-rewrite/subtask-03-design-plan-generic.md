# Subtask 03 — Design: /plan-generic DAG JSON + Session JSON

## Delegation
**Agent:** HeadWrench direct (collaborative with user — no subagent)
**Model:** anthropic/claude-sonnet-4-6

---

## Objective
Design the /plan-generic planning DAG JSON and the resulting session JSON collaboratively with the user. /plan-generic is the standard feature/task build session type.

> This subtask is **collaborative**. Work through the design together. Do NOT pre-solve.

---

## Context
- DAG node schema locked in subtask 02 (see `notes/dag-node-schema.md`)
- /plan-generic = standard feature build: goal → scope → subtask decomposition → parallelization → approval

---

## Todolist

- [ ] [⏸ PAUSE] Design the /plan-generic planning DAG JSON together
  - What steps does a generic planning session walk through?
  - What does each node's prompt look like?
  - Where does the user get asked questions? (pause nodes)
  - What's the expected output at the end? (the session plan)
- [ ] [⏸ PAUSE] Design the resulting session JSON (the output of /plan-generic)
  - What does a completed generic session plan look like?
  - How does it map to the existing spec.json + subtask file convention?
  - Does plan.json replace or supplement spec.json?
- [ ] [⏸ PAUSE] User approves both JSONs
- [ ] Write approved designs to `notes/plan-generic-design.md`
- [ ] [🚫 GATE] User confirms /plan-generic design before moving to /plan-debug

---

## Scope
- Design the /plan-generic planning DAG (the JSON the slash command loads)
- Design the session artifact produced at end of planning (plan.json / spec.json)
- Out of scope: plugin implementation, other session types

## Constraints
- Must use the DAG node schema from subtask 02
- Session artifact must be machine-readable for plugin-driven execution
- Keep prompts concise — they run inside the agent context window

## Output
- `notes/plan-generic-design.md` — planning DAG JSON + session artifact schema, with examples

---

*Checkpoint: `wip: subtask 03 complete — plan-generic design`*
