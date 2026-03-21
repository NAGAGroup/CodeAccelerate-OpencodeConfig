# Gate: Evaluate Root Cause

Based on the evidence gathered in the previous diagnosis steps, determine the most likely root cause of the DAG schema bug.

## Evidence Summary

Review the findings from Steps 1-5:

1. **Audit Planning Prompts:** Do they include JSON schema guidance?
2. **Check Gate Prompts:** Do they use semantic node IDs or generic labels?
3. **Validate `next_step()` Logic:** Is validation strict or permissive?
4. **Search Historical DAGs:** Were invalid DAGs found?
5. **Reproduce Issue:** Can you reliably generate an invalid DAG?

## Decision: Choose the Root Cause

### Option 1: Prompt-Issue

**Choose this if:**
- Steps 1-2 revealed that planning prompts lack JSON schema guidance
- Step 2 showed gate prompts using generic labels in examples
- Step 5 confirmed that generated DAGs contain invalid `next` keys like `"pass"` or `"fail"`

**Conclusion:** The planning agent prompts do not include explicit JSON schema for the `next` object structure and don't constrain keys to be actual node IDs. Agents default to generic outcome labels because the guidance is missing.

**Next Step:** Fix planning prompts by adding:
- Explicit JSON schema example with actual node IDs as keys
- Constraint statement: "keys must match actual node IDs"
- Bad example showing what NOT to do

### Option 2: Validation-Issue

**Choose this if:**
- Step 5 shows that generated DAGs are valid with proper node IDs
- Step 3 revealed permissive validation in `next_step()`
- OR the issue is intermittent and can't be reliably reproduced

**Conclusion:** The root cause is not in planning prompts but in validation logic, agent code paths, or environmental factors. The generated DAGs appear correct, suggesting prompts are fine but something else is causing the issue.

**Next Step:** Escalate to deeper code audit of:
- Agent implementation and knowledge cutoff
- Alternative code paths in planning agent
- Validation logic gaps in `next_step()`

## How to Proceed

Choose the option that best matches your evidence. Call `next_step({ next: "prompt-issue" })` or `next_step({ next: "validation-issue" })` accordingly.

## If Evidence is Inconclusive

If you have conflicting findings or are uncertain:
- Err toward **prompt-issue** (easier to fix and test)
- Prompts are the most likely culprit given the bug description
- Fixing prompts is a quick win; escalation can follow if needed
