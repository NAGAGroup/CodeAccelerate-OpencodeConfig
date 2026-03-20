# Subtask 05 — Design: /plan-collaborative DAG JSON + Session JSON

## Delegation
**Agent:** HeadWrench direct (collaborative with user — no subagent)
**Model:** anthropic/claude-sonnet-4-6

---

## Objective
Design the /plan-collaborative planning DAG JSON and the resulting session JSON collaboratively with the user.

> **Definition:** /plan-collaborative is the **rough-idea-to-detailed-spec** session type. Use when the desired outcome is known but the path to get there can't be fully defined upfront. The agent and user co-develop the spec through structured exploration steps. This is NOT general collaboration — it is specifically for turning rough ideas into fully specced plans. If you already know what you want built, use /plan-generic instead.

> This subtask is **collaborative**. Work through the design together. Do NOT pre-solve.

---

## Context
- DAG node schema locked in subtask 02 (see `notes/dag-node-schema.md`)
- /plan-generic + /plan-debug designs finalized in subtasks 03–04
- /plan-collaborative is unique: the user drives the exploration; the agent facilitates; the session itself IS the spec development process

---

## Todolist

- [ ] [⏸ PAUSE] Design the /plan-collaborative planning DAG JSON together
  - How is this different from the other session types? (more user turns, less deterministic flow?)
  - What steps does a rough-idea-to-spec workflow need?
  - How does the DAG handle open-ended user exploration? (branching? dynamic nodes?)
  - What's the exit condition? (a finalized spec document? approval gate?)
- [ ] [⏸ PAUSE] Design the resulting session JSON (the output of /plan-collaborative)
  - What artifact does this session produce? (a spec doc? a plan.json? both?)
  - How does it differ from /plan-generic's output?
- [ ] [⏸ PAUSE] User approves both JSONs
- [ ] Write approved designs to `notes/plan-collaborative-design.md`
- [ ] [🚫 GATE] User confirms /plan-collaborative design before moving to implementation

---

## Scope
- Design the /plan-collaborative planning DAG (the JSON the slash command loads)
- Design the session artifact produced at end of the session
- Out of scope: plugin implementation, other session types

## Constraints
- Must use the DAG node schema from subtask 02
- Must prominently encode the "rough-idea-to-spec" definition — NOT general collaboration
- Must produce a concrete, machine-readable artifact at the end (not just a conversation)
- User-gated nodes must be explicit in the DAG

## Output
- `notes/plan-collaborative-design.md` — planning DAG JSON + session artifact schema, with examples

---

*Checkpoint: `wip: subtask 05 complete — plan-collaborative design`*
