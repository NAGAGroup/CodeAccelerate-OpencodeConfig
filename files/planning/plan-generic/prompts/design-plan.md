# Design Plan: Draft the Project DAG

Your task is to **design the project DAG structure** based on the approved shape, decomposition, and agent routing.

## What You Have

From planning:
- Task goal and acceptance criteria
- Chosen DAG shape (1A-1F) with design decisions
- Decomposition: subtasks with boundaries and dependencies
- Agent routing: assignments and model tiers
- Loop/gate details (if shape includes them)
- User approval

## What You Design

Draft the **plan.json structure** for the project DAG:

1. **Nodes List**
   - Node ID (from subtask names)
   - Node type ("agent" for execution nodes, "gate" for decision points)
   - Prompt paths (placeholder: `planning/session-plans/{task-name}/prompts/{subtask-name}.md`)
   - `remaining_visits` count for looping nodes

2. **Flow Diagram**
   - Entry node (session-overview)
   - Subtask sequence per chosen shape (1A-1F)
   - Decision gates (user decisions during execution)
   - Looping points (with visit counters)
   - Terminal node (finalize)

3. **Dependencies & Branching**
   - Document subtask dependencies (which must complete before others)
   - For shapes with branching (1C, 1D, 1E, 1F): specify branch criteria
   - For shapes with loops (1B, 1E, 1F): specify loop condition and counter

## Output Format

Document the plan design:

```json
{
  "schema_version": "1.0",
  "id": "{task-name}",
  "session_type": "generic",
  "entry": "session-overview",
  "nodes": {
    "session-overview": { "type": "agent", "prompt": "...", "next": "..." },
    "subtask-1": { "type": "agent", "prompt": "...", "next": "..." },
    ...
    "finalize": { "type": "agent", "prompt": "..." }
  }
}
```

## Success Criteria

- [ ] All subtasks from decomposition are nodes in the DAG
- [ ] Entry and terminal nodes defined
- [ ] Branching nodes (gates) have proper `next` objects with descriptions
- [ ] Looping nodes have `remaining_visits` set
- [ ] All node references are valid (no dangling `next` targets)
- [ ] DAG shape matches your chosen design (1A-1F)
- [ ] Dependencies are clear and explicit

## Notes

- This is still drafting; you won't write prompts yet
- The preview-gate will show the DAG structure to the user for validation
- If user requests changes, you'll loop back here to revise the structure
- After user approval at preview-gate, you'll write all prompt files
