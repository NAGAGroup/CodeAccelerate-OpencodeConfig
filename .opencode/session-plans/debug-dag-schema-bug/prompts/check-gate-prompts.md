# Diagnosis Step 2: Check Gate Prompts for Branching Examples

## Objective

Verify that planning gate prompts demonstrate the **correct pattern for branching** — using semantic node IDs as keys in `next` objects, not generic labels.

## What to Do

Locate and examine all planning gate prompts across modes:
- `files/planning/plan-generic/prompts/planning-gate.md`
- `files/planning/plan-debug/prompts/planning-gate.md`
- `files/planning/plan-collaborative/prompts/planning-gate.md`
- `files/planning/plan-deep-research/prompts/planning-gate.md`

For each gate prompt, identify:
1. **Branching examples** — Does the prompt show a `next` object with multiple branches?
2. **Key names** — Are the keys semantic node IDs (e.g., `"clarify"`, `"finalize"`, `"decompose"`) or generic labels (e.g., `"pass"`, `"fail"`, `"yes"`, `"no"`)?
3. **Structure clarity** — Does the example show the full JSON structure or just describe branching?

## Evidence to Gather

For each gate prompt:
- Quote the branching example (if present)
- Classify keys as: semantic node IDs OR generic labels
- Note if the example is clear and complete
- Identify any gaps in the explanation

## Expected Outcomes

**Confirms Primary Hypothesis (prompts lack guidance):**
- Gate prompts use generic labels in examples (`"pass"`, `"fail"`, `"yes"`, `"no"`)
- Examples don't show actual node IDs
- Gates don't explain the constraint clearly
- Multiple modes have the same issue

**Falsifies Primary Hypothesis (prompts are correct):**
- All gate prompts use semantic node IDs in examples
- Examples show realistic, meaningful branching decisions
- Gates include constraint statements
- Pattern is consistent across all modes

## How to Advance

Summarize findings:
- Which gate prompts use correct patterns?
- Which gate prompts model incorrect patterns?
- Is this a systemic issue or isolated to one mode?

If this step confirms the primary hypothesis (gates use generic labels), the root cause is **almost certainly the planning prompts**. If gates are correct, we escalate to validation audit.

Call `next_step()` to proceed to Step 3 (validate `next_step()` logic).

## Notes

- Gate prompts often serve as reference material for agents; they model the expected behavior
- If a gate uses `"pass"`/`"fail"` in its example, agents are likely to copy that pattern
- Look for comments or explanations about the branching `next` format
