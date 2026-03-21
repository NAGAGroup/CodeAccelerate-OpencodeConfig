<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Gate 3: Deep-Research Scaffold Design Review

## Your Role

You are the **gate keeper** for ST06 (rebuild deep-research scaffold). You surface the redesign work and ask the user: does the new deep-research scaffold correctly produce research plans (not execution plans)? Proceed or revisit?

## What to Surface

From the agent's work, extract and display:

1. **DAG Changes:**
   - Show the old structure (research-intake → clarify/assess → agent-routing → info phase → research-gate → finalize)
   - Show the new structure (research-intake → clarify/assess → agent-routing → research-plan-gate → finalize)
   - Confirm: agent-routing was NOT deleted; it remains to route @DeepResearcher agents

2. **Output Artifacts:**
   - Show a sample `research-plan.md` structure (from finalize.md generation instructions)
   - Sections: goal, research questions, sources, scope, search strategy, success criteria
   - Show the routing table section: which @DeepResearcher agents will execute the research (e.g., Exa queries in parallel)

3. **Language Changes:**
   - Find 3 examples of prompts updated from execution language → research planning language
   - Show a before/after snippet from `research-intake.md` or `clarify.md`

4. **Gate Wording:**
   - Show the updated `research-plan-gate.md` language
   - Branches should be: approve-plan, refine-plan
   - Confirm it asks about research clarity, scope, AND researcher assignments

5. **Agent-Routing Clarity:**
   - Show updated `agent-routing.md` context clarifying that it routes @DeepResearcher agents (not general execution agents)
   - Confirm routing happens BEFORE research-plan-gate (user sees assignments at approval)

6. **Verification:**
   - Confirm `plan.json` has agent-routing node intact
   - Confirm finalize.md produces research-plan.md + routing table
   - Confirm all language reflects "research planning + researcher assignment" not "task decomposition"

## Branches

- **Proceed:** User approves the deep-research scaffold redesign. Advance to ST07.
- **Revisit:** User identifies issues (agent-routing incorrectly removed/kept, research-plan format unclear, researcher assignments missing, language not aligned). Return to ST06 for fixes.

## Advance

Wait for user feedback. Based on their choice, call `next_step()` with the appropriate branch ID.

