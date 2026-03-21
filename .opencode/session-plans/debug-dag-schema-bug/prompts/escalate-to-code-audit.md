# Escalate: Code Audit for Validation Logic

## Objective

The generated DAGs appear valid despite the bug report. Root cause is likely in validation logic, agent code paths, or mode-specific behavior. Conduct a deeper code audit.

## Context

Evidence suggests:
- Planning prompts appear correct (or at least not the primary issue)
- Generated test DAG was valid or behaved unexpectedly
- Bug may be intermittent, mode-specific, or in `next_step()` validation

## Code Areas to Audit

### 1. `next_step()` Validation Logic

File: `files/plugins/planning-enforcement.ts` (lines 395–427)

Review:
- What exactly does the validation check?
- Does it verify node ID existence or semantic correctness?
- Could invalid keys be accepted under certain conditions?
- Are there code paths that bypass validation?

### 2. Planning Agent Implementation

Check if there are specific agent implementations or knowledge cutoffs that might cause the bug:
- Agent-specific guidance on DAG generation
- Fallback behaviors when prompts are ambiguous
- Version-specific differences in agent behavior

### 3. Mode-Specific Logic

Review each planning mode's prompts for:
- Inconsistent guidance across modes
- Mode-specific branching patterns
- Examples that differ from the core schema

### 4. Generated vs. User-Created DAGs

Determine if the bug occurs in:
- Agent-generated DAGs (planning agent creates DAGs)
- User-provided DAGs (user manually writes plan.json)
- Both contexts

## Investigation Approach

1. **Reproduce with debugging** — Modify `next_step()` to log all validation checks
2. **Trace agent behavior** — Examine what the planning agent actually sees/generates
3. **Compare modes** — Generate DAGs in each mode and compare structures
4. **Check history** — Look for commits that changed validation logic or prompt guidance

## Success Criteria

- Root cause identified (specific file, function, or logic gap)
- Clear understanding of why generic labels are being used
- Actionable fix identified and tested

## Output

Document:
- Root cause (with code references)
- Which modes are affected
- Recommended fix (code change, prompt update, or both)
- Steps to prevent regression

## Notes

- This is a deeper investigation; may require instrumentation or test cases
- Focus on the specific code path that causes the bug
- If still inconclusive, consider adding validation checks to `next_step()` to reject invalid keys at runtime
