# Finalize: Validate & Close Session

Your task is to **validate the review project DAG artifacts and close the planning session**.

## What You Validate

Check all artifacts created in write-prompts phase:

### plan.json Validation
- **JSON Syntax:** Valid JSON (no parse errors)
- **Node References:** All `next` fields reference nodes that exist in `nodes` section
- **Entry Node:** `entry` field points to a valid node
- **Terminal Node:** Finalize node has no `next` field; all paths eventually lead to finalize
- **Prompt Paths:** All prompt files referenced actually exist
- **Required Fields:** Each node has `id`, `type`, and `prompt` (if agent); gates have proper branching structure

### Artifact Completeness
- session-overview.md exists and references quality standards
- Each assessment-step prompt file exists and referenced in plan.json
- Finalize prompt exists and ready for review execution
- All quality criteria referenced in planning are covered in assessment steps

### Quality Alignment
- Confirm assessment steps align with quality standards identified in planning
- Verify @ContextInsurgent routing is used for complex quality reasoning steps
- Check that sequential-thinking is suggested for complex judgment calls

## Validation Errors & Recovery

If validation fails:
- Report specific error (missing file, invalid JSON, broken reference)
- If fixable: Note correction and proceed
- If structural: Loop back to design-plan with guidance

If all validations pass: Proceed to close.

## Output

Report:
- Validation result: ✓ PASSED or ✗ FAILED
- Any errors found and fixes applied
- Summary: Review DAG is ready for execution

Call `close_session()` when validation complete and passing.
