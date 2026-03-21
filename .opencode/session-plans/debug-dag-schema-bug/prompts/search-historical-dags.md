# Diagnosis Step 4: Search Historical DAGs for Invalid Examples

## Objective

Determine whether invalid DAGs with generic `next` keys exist in the codebase's archived session plans. This reveals if the bug is systemic and repeatable.

## What to Do

Search `.opencode/archived-plans/` for any `plan.json` files containing invalid `next` structures:

1. **Glob pattern:** `.opencode/archived-plans/*/plan.json`
2. **Search each file for:**
   - `"pass":` with a next object
   - `"fail":` with a next object
   - Other generic outcome labels: `"yes"`, `"no"`, `"success"`, `"error"`, `"skip"`
3. **Document any matches** with file path and full context of the invalid `next` structure

## Evidence to Gather

For each invalid DAG found:
- File path: `.opencode/archived-plans/{session-name}/plan.json`
- The node containing the invalid `next`
- The full `next` object showing generic keys
- Date or session context (if available)

## Expected Outcomes

**Confirms Bug is Systemic:**
- Found multiple invalid DAGs across different sessions
- Pattern is consistent: generic labels used as keys
- Suggests the bug has been occurring for a while

**Indicates Bug is Isolated:**
- No invalid DAGs found in archives
- Bug may be recent, or affected sessions haven't been archived yet
- Suggests the bug is from a recent change

**Either Outcome is Useful:**
- Systemic → prioritize prompt fixes
- Isolated → may indicate recent regression in planning logic

## How to Advance

Summarize findings:
- How many invalid DAGs found?
- Pattern consistency across sessions?
- Any common planning mode(s) affected?

Call `next_step()` to proceed to Step 5 (reproduce issue).

## Notes

- Check both `.opencode/session-plans/` (active) and `.opencode/archived-plans/` (completed)
- The bug may exist in active plans too — check both directories
- If archive is empty, that's okay — Step 5 will provide definitive reproduction
