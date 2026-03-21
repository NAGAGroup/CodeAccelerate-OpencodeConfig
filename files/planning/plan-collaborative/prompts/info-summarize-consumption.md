# INFO: Collaboration Summary

Consolidate your planning decisions. You will now be asked for final approval before proceeding to finalize.

## What You've Decided

Review and summarize:

1. **Design Understanding**
   - Design goal and success criteria
   - Key constraints and context
   - Artifact to be produced

2. **Collaboration Approach**
   - Collaboration shape (rapid, moderate, or deep)
   - Proposed DAG shape (1A, 1B, 1D, 1E, or 1F)
   - Why this shape fits the work

3. **Collaboration Decomposition (3-7 steps)**
   - Design steps with descriptions
   - User input needed at each step
   - Decision gates and their criteria

4. **Output Artifact**
   - Artifact type and format
   - Scope and structure
   - End-state location and usage

5. **Agent Routing**
   - Each design step → agent type → model tier

6. **Design Details**
   - Dialogue loops (if applicable) with user gates and `remaining_visits`
   - User decision gates with options
   - Session-overview context for the collaborating agent

## Output

Provide a concise but complete summary of these 6 sections.

Call `next_step()` to present to user for approval.
