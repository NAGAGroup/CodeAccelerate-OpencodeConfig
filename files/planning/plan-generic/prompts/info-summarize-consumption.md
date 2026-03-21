# INFO: Planning Summary

Consolidate your planning decisions. You will now be asked for final approval before proceeding to finalize.

## What You've Decided

Review and summarize:

1. **Task Understanding**
   - Goal (one sentence)
   - Acceptance criteria (3-5)
   - Key constraints

2. **Chosen DAG Shape (1A-1F)**
   - Which shape and why
   - What unknowns it handles (gates/loops)

3. **Decomposition (3-9 subtasks)**
   - Subtask list with brief descriptions
   - Dependencies

4. **Agent Routing**
   - Each subtask → agent type → model tier

5. **Design Details**
   - Loop patterns (if applicable) with branching nodes and `remaining_visits`
   - Gate placement (if applicable) with decision points
   - Session-overview context for the executing agent

## Output

Provide a concise but complete summary of these 5 sections.

Call `next_step()` to present to user for approval.
