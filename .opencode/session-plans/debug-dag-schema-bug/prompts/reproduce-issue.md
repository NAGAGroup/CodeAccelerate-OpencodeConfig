# Diagnosis Step 5: Reproduce the Issue with a Test Planning Session

## Objective

**Definitively reproduce the bug** by triggering a planning session and inspecting the generated `plan.json` for invalid `next` structures.

## What to Do

1. **Trigger a planning session** using `plan_generic()` (or any planning mode)
2. **Inspect the generated `plan.json`** in `.opencode/session-plans/{session-name}/plan.json`
3. **Check for invalid `next` keys:**
   - Search for branching `next` objects with keys like `"pass"`, `"fail"`, `"yes"`, `"no"`, etc.
   - Verify that all branching `next` keys match actual node IDs in the same DAG

## Evidence to Gather

From the generated DAG:
- All `next` values (string, array, or object format)
- Any branching `next` objects with their keys
- Do the keys match actual node IDs in the DAG?
- Do any keys look like generic outcome labels?

**Specific Questions:**
- Does the generated DAG have any invalid `next` keys?
- If yes, which nodes have the invalid structure?
- Can you quote the invalid section?

## Expected Outcomes

**Confirms Primary Hypothesis (prompts cause the bug):**
- Generated DAG contains `next` objects with `"pass"`, `"fail"`, or similar generic keys
- These keys don't correspond to any node IDs in the DAG
- This directly proves agents are generating invalid structures
- Next step: fix the planning prompts

**Falsifies Primary Hypothesis (bug is elsewhere):**
- Generated DAG is valid — all `next` keys match actual node IDs
- Bug may be in validation logic, agent code paths, or intermittent
- Next step: escalate to code audit

## How to Advance

Report findings:
- Is the generated DAG valid or invalid?
- If invalid, quote the offending `next` structure
- If valid, note any observations about the DAG structure

Based on your findings, the gate node will route to either:
- `fix-planning-prompts` (if invalid DAG reproduced)
- `escalate-to-code-audit` (if DAG is valid)

## Notes

- The planning session will create new files in `.opencode/session-plans/`
- Look for the most recently created directory
- The generated DAG should be parseable JSON — if it's malformed, that's also worth noting
