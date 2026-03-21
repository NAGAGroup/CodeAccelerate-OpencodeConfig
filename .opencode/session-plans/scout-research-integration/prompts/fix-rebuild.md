# Subtask 6: Fix and Rebuild Loop

**Agent:** HW (direct)

## Goal

Diagnose build failures from the previous build-verify step, fix the root cause, and prepare for re-running the build. This node loops back to build-verify until the build succeeds.

## What to Do

1. **Read the failure message** from the previous build-verify step
   - What was the error? (syntax, missing files, broken references, etc.)
   - Where did it occur? (file path, line number if available)

2. **Diagnose the root cause:**
   - Is it a syntax error in JSONC (registry.jsonc or plan.json)?
   - Is it a missing file or incorrect path reference?
   - Is it a prompt file with invalid content?
   - Is it a structural issue (nodes referencing non-existent next targets)?

3. **Fix the issue:**
   - Edit the problematic file
   - Verify the fix is correct
   - Example fixes:
     - **Syntax error:** Fix JSON/JSONC formatting (missing commas, quotes, etc.)
     - **Missing file:** Create the missing file (e.g., missing scout.md)
     - **Bad path reference:** Correct the path in plan.json
     - **Invalid content:** Ensure prompt files contain valid markdown

4. **Validate the fix:**
   - If you edited JSONC, parse it to ensure valid JSON: `cat file.jsonc | jq .`
   - If you edited markdown, verify no syntax errors (headers, code blocks balanced)
   - Spot-check the fix makes sense in context

5. **Report and advance:**
   - Summarize the issue and fix applied
   - Call `next_step()` to loop back to build-verify
   - The loop will rebuild and verify again

## Common Build Failures & Fixes

### Failure: JSONC Syntax Error in plan.json
**Example:** "Unexpected token '}' in plan.json line 42"
**Fix:**
- Open `.opencode/session-plans/scout-research-integration/plan.json`
- Check line 42 area for missing commas, quotes, or extra braces
- Ensure all node definitions are properly closed
- Validate: `cat plan.json | jq . > /dev/null`

### Failure: Path Reference Not Found
**Example:** "prompt file not found: .opencode/session-plans/..."
**Fix:**
- Verify the prompt file exists at the referenced path
- Check spelling and case sensitivity
- Ensure path is relative to workspace root

### Failure: Missing Prompt File
**Example:** "audit-scout-nodes.md not found"
**Fix:**
- Create the missing file in `.opencode/session-plans/scout-research-integration/prompts/`
- Populate with a reasonable prompt if not yet created

### Failure: Invalid Node Reference in DAG
**Example:** "Node 'build-verify' references unknown next target 'success'"
**Fix:**
- Check plan.json: ensure next targets match actual node names
- Verify all referenced nodes are defined in the nodes section

## Loop Mechanics

- You are in a loop: fix-rebuild → build-verify
- After you fix and call `next_step()`, the loop returns to build-verify
- build-verify will re-run the build and branch again (success or failure)
- The loop can repeat up to **5 times** (remaining_visits: 5)
- If the loop is exhausted, call `reset_counters()` to allow more attempts

## Expected Loop Behavior

**Iteration 1:** Fix first issue → rebuild
**Iteration 2:** If still broken, fix next issue → rebuild
...
**Success:** Build passes → branch to finalize

## Notes

- Stay focused: fix one issue at a time
- Each iteration should make progress (either fixing the problem or identifying the next issue)
- If you're stuck on the same issue, reassess: is there a deeper structural problem?

Call `next_step()` when you've fixed the issue and are ready to rebuild.
