# Subtask 5: Build and Verify Output

**Agent:** HW (direct)

## Goal

Run the build process and verify that all scout node updates are correctly reflected in the dist/ output. This node branches the DAG: success → finalize, failure → fix-rebuild loop.

## What to Do

1. **Run the build:**
   ```bash
   bun run build
   ```

2. **Analyze output:**
   - Did `bun run build` complete without errors?
   - Check dist/ directory exists and is not empty
   - Verify structure: `dist/index.json`, `dist/.well-known/`, `dist/components/`

3. **Verify scout updates in dist/:**
   - Navigate to `dist/components/` and look for plan components
   - For each updated planning DAG (generic, debug, collaborative, deep-research):
     - Verify the component folder exists (e.g., `dist/components/plan-generic/`)
     - Check the scout.md file inside: `dist/components/plan-generic/planning/plan-generic/prompts/scout.md`
     - Verify file contains the new external research section (grep for "External Research" or similar)
     - Verify no truncation or corruption

4. **Check dist/index.json:**
   - Verify all planning DAG components are listed
   - Verify version numbers and descriptions are correct
   - No obvious JSON syntax errors

5. **Check discovery endpoint:**
   - Verify `dist/.well-known/ocx.json` exists and is valid JSON

## Success Criteria

- **Build completes** without errors or warnings
- **dist/ directory** is present and contains expected structure
- **Scout updates** appear in dist/components/ with correct content (new research sections)
- **dist/index.json** is valid and lists all components
- **OCX discovery endpoint** is valid

## Branching

**If all checks pass:**
- Call `next_step({ next: "success" })` to advance to finalize

**If any check fails:**
- Call `next_step({ next: "failure" })` to enter the fix-rebuild loop
- Provide a clear summary of what failed (e.g., "Build error: JSONC syntax in registry.jsonc line 45" or "dist/components/plan-generic/ missing scout.md")

## Detailed Verification Commands

If you need to inspect files:

```bash
# Check build output
ls -la dist/

# Verify scout.md in dist (example for plan-generic)
cat dist/components/plan-generic/planning/plan-generic/prompts/scout.md | grep -A5 "External Research"

# Validate JSON
cat dist/index.json | jq . > /dev/null && echo "dist/index.json is valid JSON"

# Check discovery endpoint
cat dist/.well-known/ocx.json | jq .
```

## Notes

- This is the loop-branching node: it has `remaining_visits: 5` and will loop back to fix-rebuild up to 5 times
- After 5 failures, the DAG enters "failed" state; the executing agent can call `reset_counters()` to allow more attempts
- Be precise in your failure description so fix-rebuild can address the root cause

Call `next_step()` when verification is complete.
