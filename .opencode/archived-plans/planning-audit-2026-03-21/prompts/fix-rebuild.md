# Task 7: Fix & Rebuild

Your task is to **diagnose build failures and fix them**, then loop back to build-verify for re-verification.

## Agent: HeadWrench (HW Direct)

This is a diagnostic and edit task. You analyze the build failure, identify root cause, fix it, and prepare for re-build.

## Loop Context

- **Max visits:** remaining_visits: 3 (up to 3 fix-rebuild attempts)
- **Entry:** Called when build-verify fails
- **Exit:** After fix is applied, loop back to build-verify for re-verification
- **If exhausted:** After 3 failures, escalate to user at finalize gate for decision

## Diagnostic Steps

### 1. Review Build Error
From the build-verify output, identify:
- Which DAG has the error (plan-generic, plan-debug, etc.)
- Which file caused the error (plan.json, a prompt file, etc.)
- Error type (JSON syntax, missing file, broken reference, etc.)

### 2. Common Failure Patterns
Expect one of these issues:

**JSON Syntax Errors in plan.json**
- Missing commas between object properties
- Trailing commas in arrays/objects
- Unclosed braces or brackets
- Invalid escape sequences in strings
- Solution: Validate JSON structure, fix syntax

**Broken Node References**
- plan.json references a node that doesn't exist
- A prompt file references a next node that isn't defined
- Solution: Ensure all `next` targets are valid node IDs

**Missing Prompt Files**
- plan.json references a prompt file that wasn't written
- Paths are incorrect (should be relative to repo root)
- Solution: Create missing prompts or fix file paths

**Invalid Node Types**
- A node has `"type": "invalid_type"` (should be "agent" or "gate")
- Solution: Correct node type

**Missing Required Fields**
- A node missing `id`, `prompt`, or `type`
- Solution: Add missing field

### 3. Locate and Fix
- Use grep/find to locate the problematic file
- Read the file and identify the issue
- Fix the specific error
- Validate syntax (e.g., run `jq` on JSON)

## Execution Pattern

1. **Diagnose** — Identify which DAG/file has the error
2. **Fix** — Edit the file to correct the issue
3. **Validate** — Quick check that the fix is correct (e.g., test JSON parse)
4. **Loop back** — Call `next_step()` to return to build-verify for re-build

## Outputs Expected

Document each fix:
- Which DAG and file
- What the error was
- What you fixed
- Confidence that fix is correct

Brief summary (can be inline with next_step call).

## Notes

- You have 3 attempts total across the fix-rebuild loop
- If you run out of visits, the DAG enters "failed" state
- The finalize gate will surface this to the user
- Focus on the specific error reported; don't try to refactor or improve while fixing
- After fix, loop back to build-verify by calling `next_step()`

## Loop Termination

After you fix the issue:
```
next_step()
```

This loops back to build-verify. If that build succeeds, you exit the loop to finalize. If it fails again, you're back here for another fix attempt (up to 3 total).
