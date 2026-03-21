# Diagnosis Step 1: Audit Planning Prompts for JSON Schema Guidance

## Objective

Determine whether planning agent prompts **include explicit JSON schema specification** for the `next` object structure and clearly constrain keys to be actual node IDs.

## What to Do

Examine all planning mode prompts to check for:

1. **JSON schema example** showing the correct `next` object format with actual node IDs as keys
2. **Explicit constraint statement** that says: "keys in branching `next` objects must be actual node IDs from your DAG"
3. **"Bad example"** demonstrating what NOT to do (e.g., using `"pass"` or `"fail"` as keys)

### Specific Files to Check

Search in `files/planning/` directory:
- `plan-generic/prompts/` — Look for node decomposition and gate prompts
- `plan-debug/prompts/` — Look for hypothesis formation and gate prompts
- `plan-collaborative/prompts/` — Look for design and gate prompts
- `plan-deep-research/prompts/` — Look for research and gate prompts

Pay special attention to:
- Prompts that guide agent JSON generation (any prompt that says "produce a JSON structure" or "output a plan")
- Gate prompts (they likely show branching `next` examples)
- Any prompts mentioning the `plan.json` schema

## Evidence to Gather

For **each planning mode**, document:
- Does the prompt include a JSON schema example for `next`?
- If yes, what do the keys in the example look like? (node IDs or generic labels?)
- Is there an explicit constraint about what keys are allowed?
- Is there a "bad example" showing what NOT to do?

## Expected Outcomes

**Confirms Primary Hypothesis (missing schema):**
- Prompts lack JSON schema guidance
- Prompts don't constrain keys to node IDs
- No bad examples shown
- Any examples use generic labels

**Falsifies Primary Hypothesis (prompts are correct):**
- Prompts include full JSON schema with node IDs
- Clear constraint: "keys must be actual node IDs"
- Bad examples show pitfalls like `"pass"`/`"fail"`
- All examples use semantic node IDs

## How to Advance

Summarize findings:
- Which prompts lack schema guidance?
- Which prompts have correct guidance?
- Overall: Are prompts complete enough to guide agents correctly?

Call `next_step()` to proceed to Step 2 (check gate prompts).

## Notes

- Look for file patterns like `*gate*.md`, `*decompose*.md`, `*plan*.md`
- Search for keywords: "JSON", "next", "schema", "node", "branching"
- If a prompt file is unclear, note it for escalation
