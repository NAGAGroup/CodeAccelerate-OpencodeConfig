# INFO: Investigation Summary

Consolidate your planning decisions. You will now be asked for final approval before proceeding to finalize.

## What You've Decided

Review and summarize:

1. **Bug Understanding**
   - Symptoms and reproduction path
   - Impact and severity
   - Affected code areas

2. **Hypothesis & Investigation Approach**
   - Primary hypothesis and alternatives
   - Investigation approach (serial vs. parallel)
   - Proposed investigation shape

3. **Diagnosis Decomposition (3-7 steps)**
   - Diagnosis steps with descriptions
   - Which hypothesis each tests
   - Branching points

4. **Test Strategy**
   - Test method per diagnosis step
   - Evidence to gather
   - Expected outcomes and fallbacks

5. **Agent Routing**
   - Each diagnosis step → agent type → model tier

6. **Design Details**
   - Diagnosis loops (if applicable) with evaluation nodes and `remaining_visits`
   - Hypothesis gates with decision criteria
   - Session-overview context for the investigating agent

## Output

Provide a concise but complete summary of these 6 sections.

Call `next_step()` to present to user for approval.
