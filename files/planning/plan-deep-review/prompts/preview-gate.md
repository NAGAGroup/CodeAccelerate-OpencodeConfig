# Preview Gate: Validate DAG Before Writing

Your task is to **show the planned DAG structure to the user and confirm it's sound before writing artifacts**.

## What to Show

Display the designed review DAG:

### ASCII Diagram (Simplified)
```
session-overview → assessment-step-1 → assessment-step-2 → ... → finalize
```

Or with branching (if applicable):
```
session-overview → assessment-step-1 → {gate: criteria met?} → path-A / path-B → finalize
```

### DAG Details
- **Node count:** Total number of steps
- **Shape:** Linear (1A), branching (1C-multi), looping (2-series), etc.
- **Assessment steps:** List of all review steps and their scope
- **Agent routing:** Which steps use @ContextScout vs. @ContextInsurgent
- **Branching points:** Any gates or conditional logic

### Key Questions for User
- Does this structure cover all quality dimensions?
- Are the assessment steps in the right order?
- Are agent routings appropriate (standard vs. elevated reasoning)?
- Anything missing or unnecessary?

## User Options

The user will choose:

1. **Approve DAG Structure** — Structure is solid; proceed to write prompts and finalize
2. **Adjust Assessment Steps** — Add, remove, or reorder steps; loop back to design-plan
3. **Refine Routing** — Change which steps use @ContextInsurgent vs. standard; loop back to design-plan

## Your Output

If **approved:** Call `next_step({ next: "write-prompts" })`

If **adjust steps:** Call `next_step({ next: "design-plan" })`

If **refine routing:** Call `next_step({ next: "design-plan" })`

## Validation Notes

Confirm:
- All assessment steps from planning are included
- No step is orphaned or unreachable
- Agent routing makes sense for each step's complexity
- Plan.json will be valid JSON (ready for write-prompts phase)
