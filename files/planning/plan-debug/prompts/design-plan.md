# Design Plan: Draft the Investigation DAG

Your task is to **design the investigation DAG structure** based on the approved hypothesis, shape decision, and test strategy.

## What You Have

From planning:
- Bug symptoms and reproduction path
- Primary and alternative hypotheses
- Investigation shape decision: **branch** (multiple hypotheses), **loop** (refine one), or **both**
- Diagnosis steps (3-7 steps with clear names)
- Test strategy per step
- Agent routing and model tiers
- Loop/gate details (if applicable)

## What You Design

Draft the **plan.json structure** for the investigation DAG:

1. **Nodes List**
   - Node ID (from diagnosis step names)
   - Node type ("agent" for diagnosis steps, "gate" for branching/looping decisions)
   - Prompt paths (placeholder: `planning/plan-debug/session-plans/{bug-name}/prompts/{step-name}.md`)

2. **Flow Diagram**
   - Entry node (session-overview)
   - Diagnosis step sequence
   - Branching points (gates between alternative hypotheses)
   - Looping points (evaluation gates that loop back for refinement)
   - Terminal node (finalize)

3. **Branching/Looping Details**
   - For looping: Which evaluation gate loops back? How many iterations (`remaining_visits`)?
   - For branching: Which gates decide between hypotheses? What are the branch conditions?

## Output

Draft:
```json
{
  "schema_version": "1.0",
  "id": "debug-{bug-name}",
  "session_type": "debug-investigation",
  "description": "Investigation DAG for {bug-name}",
  "entry": "session-overview",
  "nodes": {
    "session-overview": {...},
    "diagnosis-step-1": {...},
    "evaluate-step-1": {...},
    ...
    "finalize": {...}
  }
}
```

Include:
- All diagnosis steps in correct order
- Branching gates (if branch/both decision)
- Looping gates with `remaining_visits` (if loop/both decision)
- Clear `next` field specifying flow (string for linear, object for branching/looping)

Call `next_step()` to preview the DAG structure.
