# Diagnosis Step 3: Validate `next_step()` Logic Strictness

## Objective

Audit the `next_step()` function in `planning-enforcement.ts` to determine if its **validation logic is strict enough** to reject invalid `next` keys or if it's too permissive.

## What to Do

Examine the `next_step()` implementation in `files/plugins/planning-enforcement.ts` (lines 395–427):

1. **Validation Checks** — What does the function verify?
   - Does it check that branching keys exist as node IDs in the DAG?
   - Does it reject unknown keys?
   - Does it enforce semantic meaningfulness?

2. **Error Handling** — What happens when invalid keys are encountered?
   - Does it throw an error?
   - Does it log a warning?
   - Does it silently accept invalid keys?

3. **Edge Cases** — Are there gaps in validation?
   - What if a branching object has keys that don't match any node IDs?
   - What if keys are generic labels like `"pass"`/`"fail"`?

## Evidence to Gather

- Extract the validation logic from `next_step()`
- Identify each check performed on the `next` parameter
- Note what happens if validation fails
- Identify any gaps or permissive behavior

## Expected Outcomes

**Confirms Alternative Hypothesis 3 (validation is permissive):**
- `next_step()` validates that node IDs exist
- But it doesn't enforce semantic correctness
- Invalid keys like `"pass"` are accepted if they exist in the branching object
- No warning or error is logged for semantic meaninglessness

**Falsifies Alternative Hypothesis 3 (validation is strict):**
- `next_step()` strictly validates branching keys against the DAG
- Unknown keys are rejected with clear error messages
- Semantic labels are detected and flagged
- Validation logic is comprehensive

## How to Advance

Summarize findings:
- Is validation strict or permissive?
- What gaps exist in validation?
- If validation is permissive, does this support the primary hypothesis (prompts need stricter guidance)?

If validation is strict and prompts are correct, the bug must be elsewhere (agent code paths, mode-specific logic). If validation is permissive, we still need to fix prompts to prevent agents from generating invalid keys in the first place.

Call `next_step()` to proceed to Step 4 (search historical DAGs).

## Notes

- Look for `Object.keys()` usage — this typically validates branching keys
- Pay attention to error messages — they reveal what the code considers valid
- Check for any conditional logic that might allow certain keys
