# Write Prompts (Phase 3: Artifact Generation)

Your task is to **write all prompt files and finalize the project DAG**.

## What You Have

From previous phases:
- Approved DAG structure (plan.json)
- Task goal and acceptance criteria
- Decomposition: subtasks with boundaries and dependencies
- Agent routing: assignments and model tiers

## What You Write

You will create:
1. **plan.json** — The executable project DAG (finalized from design-plan phase)
2. **session-overview.md** — Context for the executing agent (task-specific, not generic)
3. **prompts/{subtask}.md** — One prompt per subtask
4. **prompts/finalize.md** — Prompt for the project DAG's finalize node

## Prompt Content Guidelines

### Session-Overview
Write for the **executing agent**:
- Task goal and acceptance criteria
- High-level DAG shape overview
- Key decision points (gates) and unknowns
- Subtasks at a glance
- Constraints and context
- Note: "This DAG may be restructured during execution as new information emerges. Gates and loops handle unknowns."

### Subtask Prompts
For each subtask node:
- Clear instruction on what to do
- What inputs are expected
- What outputs are expected
- How to advance to next node
- **For complex steps:** Mention that `sequential-thinking` tool is available for reasoning through trade-offs or multi-step decisions

### Finalize Prompt
Include:
- Validation of outputs from all subtasks
- Assembly of final deliverables
- Quality checks
- Instructions for task completion

## Output Structure

Write `.opencode/session-plans/{task-name}/`:
```
plan.json
session-overview.md
prompts/
  session-overview.md
  {subtask-1}.md
  {subtask-2}.md
  ...
  finalize.md
```

Call `next_step()` to advance to finalize validation.
