# Collaborative Planning: Finalize (Terminal)

**Phase:** FINALIZE (Terminal)  
**Purpose:** Validate plan.json syntax and structure; activate the DAG  
**Duration:** 2-3 minutes  
**Domain:** Collaborative design exploration

---

## Task

Perform final validation on plan.json and all prompt files. Confirm the DAG is ready to execute; activate the planning session.

## Validation Steps

**1. JSON Syntax Validation**
- Check: Valid JSON structure in plan.json
- Check: No trailing commas or syntax errors
- Report: Success or detailed error message

**2. Node Reference Validation**
- Verify: All `next` references point to existing node IDs
- Verify: All `branches` in gates point to existing node IDs
- Report: Missing nodes or broken references

**3. Prompt File Validation**
- Verify: All `prompt` paths in nodes exist
- Verify: All files are readable and contain content
- Report: Missing or empty files

**4. Gate Validation**
- Verify: Each gate has `next` field with 2+ branch options
- Verify: Each branch points to a valid next node
- Report: Gate structure warnings

**5. Entry Point Validation**
- Verify: `entry` node exists in nodes list
- Verify: Node is reachable from entry

## Validation Report

Write:

```
## Finalization Report

### JSON Syntax
- Status: ✓ Valid / ✗ Invalid
- Issues (if any): [Detailed error]

### Node References
- Status: ✓ All references valid / ✗ Broken references
- Broken references (if any): [List]

### Prompt Files
- Status: ✓ All files exist / ✗ Missing files
- File manifest: [Confirmed list of all prompt files]

### Gates
- Status: ✓ All gates valid / ✗ Invalid gate structure
- Gate validation: [Summary of gates and branches]

### Entry Point
- Status: ✓ Valid / ✗ Invalid
- Entry point: `[id]` ([title])

### Overall Status
- ✓ Ready to activate / ✗ Requires fixes
```

## If Validation Fails

Stop and report specific error with suggested fix. **Do NOT activate.**

## If Validation Succeeds

```
## DAG Activation ✓

All validation checks passed.

### Activated DAG
- **Name:** [Design/feature name]
- **Nodes:** [N task + M gate nodes]
- **Entry point:** [node-id]
- **Prompt location:** planning/plan-collaborative/prompts/

### What Happens Next
1. User begins execution at entry point
2. DAG tasks guide step-by-step planning
3. Gates allow branching and refinement
4. Planning session completes when all nodes done

---

**Planning session finalized and ready for execution.**
```

---

**See also:**
- `planning-audit-spec.md` Improvement 9 (Validation before commit)
- `planning-audit-spec.md` Improvement 4 (Finalize split)
