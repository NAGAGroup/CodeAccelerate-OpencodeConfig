# Investigation Complete: Summarize Findings and Next Steps

## Session Summary

This debug session investigated an issue where planning agents generate DAGs with invalid `next` object structures, using generic labels like `"pass"` and `"fail"` instead of actual node IDs.

## Investigation Path

You followed this diagnosis sequence:

1. **Audited Planning Prompts** — Checked for JSON schema guidance
2. **Checked Gate Prompts** — Verified branching examples use semantic node IDs
3. **Validated `next_step()` Logic** — Reviewed validation strictness
4. **Searched Historical DAGs** — Looked for existing invalid examples
5. **Reproduced Issue** — Triggered a planning session to confirm the bug
6. **Evaluated Root Cause** — Chose between prompt-issue or validation-issue paths

## Key Findings

Document the most important discoveries:
- Were planning prompts missing JSON schema guidance?
- Could you reliably reproduce the invalid DAG generation?
- Which planning modes were affected?
- What was the primary root cause?

## Action Taken

Based on your findings, you either:
- **Fixed planning prompts** by adding JSON schema, constraints, and bad examples
- **Escalated to code audit** if validation logic or agent behavior was the issue

## Verification Results

Report the outcome:
- Did prompt updates resolve the bug?
- Are new planning sessions generating valid DAGs?
- Any remaining issues or edge cases?

## Recommendations

### For Implementation

If the issue was prompt-related:
1. Ensure all planning mode prompts include JSON schema examples
2. Add explicit constraints: "keys must be actual node IDs"
3. Include bad examples in all relevant prompts
4. Test each planning mode to confirm fix

If the issue was validation-related:
1. Add runtime validation to `next_step()` to reject invalid keys
2. Provide clear error messages when invalid keys are detected
3. Update prompts to reference the schema specification

### For Prevention

- Add schema validation tests for generated DAGs
- Include DAG schema validation in the build/test pipeline
- Document the `next` object format prominently in planning agent instructions
- Periodically audit planning prompts for clarity and completeness

## Closure

- Session plan files are located in `.opencode/session-plans/debug-dag-schema-bug/`
- Archive this session plan to `.opencode/archived-plans/` when complete
- Commit all prompt updates and fixes to the repository

Thank you for investigating this issue thoroughly. The structured diagnosis approach ensures the root cause is clear and the fix is sustainable.
