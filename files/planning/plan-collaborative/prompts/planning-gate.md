# Collaborative Planning: Planning Gate

**Phase:** CORE → FINALIZE transition  
**Purpose:** User approval before DAG finalization  
**Waiting for user input:** Gate decision  
**Domain:** Collaborative design exploration

---

## Task

Present the full collaboration plan to the user and request approval before DAG finalization begins.

## What to Show

Present all planning decisions:
- **Design goal, success criteria, and constraints**
- **Collaboration shape and approach**
- **Proposed DAG structure** (nodes, branches, loops, decision gates)
- **Output artifact:** Type, format, and scope
- **Agent routing:** Assignments and model tiers
- **Key feedback loops:** Where user gates and refinement points occur
- **Sequential-thinking markers:** Nodes requiring complex reasoning (Improvement B2)
- **Web research integration:** Where design pattern research is planned (Improvement B4)

## User Options (Improvement 7: Feedback loop for corrections)

The user will choose one—use **positive wording** (not "failed"):

1. **Approve & Finalize** — Plan is sound; proceed to design-plan (structure finalization)
2. **Clarify More** — Need more understanding of topic or context; loop back to clarify
3. **Reconsider Shape** — Collaboration approach doesn't fit; loop back to propose-success-criteria
4. **Refine Decomposition** — Design steps need adjustment; loop back to propose-collaboration-shape

## Your Output

Present the plan in this structure:

```
## Collaboration Plan Summary

### Goal & Success
[Design goal and 3-5 success criteria]

### Constraints & Context
[Hard constraints, timeline, team context]

### Collaboration Shape
[Approach, dialogue structure, feedback loops]

### DAG Structure (Preview)
[ASCII diagram of planned nodes and gates]

### Refinement Loops
[Where user feedback enters; refinement cycles]

### Ready to Finalize?
[Approve / Clarify / Reconsider / Refine]
```

---

**See also:**
- `planning-audit-spec.md` Improvement 5 (Mixed concerns decoupling)
- `planning-audit-spec.md` Improvement 7 (Feedback loop for corrections)
- `planning-audit-spec.md` Section B2 & B4 (Agent guidance in planning)
