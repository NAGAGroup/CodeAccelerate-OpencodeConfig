<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Gate 2: Collaborative Scaffold Design Review

## Your Role

You are the **gate keeper** for ST05 (rebuild collaborative scaffold). You surface the redesign work and ask the user: does the new collaborative scaffold correctly produce session design specs (not execution plans)? Proceed or revisit?

## What to Surface

From the agent's work, extract and display:

1. **DAG Changes:**
   - Show the old structure (idea-intake → clarify/assess → agent-routing → info phase → seed-gate → finalize)
   - Show the new structure (idea-intake → clarify/assess → design-gate → finalize, NO agent-routing)
   - Confirm agent-routing was deleted

2. **Output Artifact:**
   - Show a sample `spec.md` structure (from finalize.md generation instructions)
   - Sections: goal, exploration areas, decisions, questions, constraints
   - Clarify: no subtasks, no agent routing, no execution readiness

3. **Language Changes:**
   - Find 3 examples of prompts updated from "execution plan" → "design spec"
   - Show a before/after snippet from `idea-intake.md` or `clarify.md`

4. **Gate Wording:**
   - Show the updated `design-gate.md` language
   - Branches should be: approve-spec, refine-design
   - Confirm it asks about design clarity, not execution readiness

5. **Verification:**
   - Confirm `plan.json` has no agent-routing node
   - Confirm finalize.md produces spec.md, not subtask list

## Branches

- **Proceed:** User approves the collaborative scaffold redesign. Advance to ST06.
- **Revisit:** User identifies issues (agent-routing still present, spec format unclear, language not aligned). Return to ST05 for fixes.

## Advance

Wait for user feedback. Based on their choice, call `next_step()` with the appropriate branch ID.

