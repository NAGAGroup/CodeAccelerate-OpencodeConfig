# Task 6: Build & Verify

Your task is to **build the project and verify the dist/ output is clean and valid**.

## Agent: HeadWrench (HW Direct)

This is a shell execution and output analysis task. You handle the build.

## What You're Building

After all 5 planning DAGs have been updated, you need to verify the build succeeds and the distributed artifacts are valid.

Location: `/home/jack/CodeAccelerate-OpencodeConfig`

## Steps

### 1. Run Build
```bash
npm run build
```

This compiles the project, validates all plan.json files, and outputs to `dist/`.

### 2. Check Build Output
- [ ] Build completes without errors
- [ ] No warnings (or only minor ones)
- [ ] dist/ directory is populated

### 3. Verify dist/ Structure
```bash
# Check that dist/index.json exists and is valid
# Check that all planning DAGs are included:
#   - dist/plan-generic/
#   - dist/plan-debug/
#   - dist/plan-collaborative/
#   - dist/plan-deep-research/
#   - dist/plan-deep-review/
# Check that prompts are copied correctly
# Check that plan.json files are valid JSON
```

### 4. Spot-Check plan.json Validity
For at least one DAG (e.g., plan-generic):
```bash
# Verify plan.json is valid JSON and has:
#   - All required fields (schema_version, id, entry, nodes)
#   - No dangling node references (all 'next' target valid nodes)
#   - All node prompts referenced actually exist in dist/
```

### 5. Check for Obvious Issues
- No broken symlinks
- No missing prompt files
- All profiles (naga-free, naga-copilot, etc.) updated consistently

## Branching Decision

### If Build Succeeds
- dist/ is clean and valid
- All structure checks pass
- Call `next_step()` to proceed to **finalize**

### If Build Fails
- Note the specific error(s)
- Call `next_step({ next: "fix-rebuild" })` to diagnose and fix
- The fix-rebuild loop allows up to 3 attempts (remaining_visits: 3)

## Outputs Expected

Document your findings:
- Build output (success/failure)
- dist/ structure verification
- Any warnings or minor issues
- Decision: proceed to finalize, or loop to fix-rebuild

Format: Brief summary with key findings.

## Notes

- This is the **first full integration test** of all 5 DAGs
- Syntax errors in plan.json or broken node references will show up here
- If build fails, don't over-diagnose; just note the error and let fix-rebuild handle it
- Small issues (formatting, missing comments) are OK; focus on structural validity
