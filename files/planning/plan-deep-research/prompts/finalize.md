# Finalize: Validate & Close Research Planning Session

## Objective

Validate the research project DAG structure and close the planning session.

---

## Validation Steps

### 1. JSON Syntax Validation

Verify that `plan.json` is valid JSON:
- Check JSON structure (braces, quotes, commas)
- Confirm all required fields (id, schema_version, entry, nodes)
- Validate using: `jq . plan.json` (or equivalent)

### 2. Node Reference Validation

Ensure all node references are consistent:
- **Entry node exists:** Check that the `entry` field points to a defined node
- **All `next` references exist:** Check every `next` (direct or branching) points to defined nodes
- **No broken links:** Verify no node references a non-existent target
- **Terminal node identified:** Confirm at least one node has no `next` field (finalization)

### 3. Prompt File Validation

Verify prompt files exist:
- For each node with a `prompt` field, confirm the file exists at the specified path
- Check that path is relative to the planning structure (e.g., `planning/plan-deep-research/prompts/[name].md`)
- Ensure no prompt references are dangling

### 4. DAG Invariant Checks

Confirm the DAG follows planning conventions:
- **Acyclic except for loops:** The DAG is acyclic or loops are explicit with `remaining_visits`
- **Branching is explicit:** Multi-next scenarios use object syntax with clear choice descriptions
- **Gates have choices:** Gate nodes have multiple next options with decision criteria
- **Agents have clear paths:** Agent nodes have clear single next or branching

## Handling Validation Failures

If validation fails:

```
VALIDATION FAILED:
- Error: Node "synthesize-findings" referenced but not defined in plan.json
- Action: Return to write-prompts to fix missing node definition
```

For each failure:
1. Identify the issue (missing node, missing prompt, broken reference)
2. Provide specific guidance on what to fix
3. Option to loop back: Return to `write-prompts` or `design-plan` to fix

## Success Criteria

Validation passes when:
- ✓ JSON is valid syntax
- ✓ All node references are defined and consistent
- ✓ All prompt files exist and are referenced correctly
- ✓ DAG structure follows invariants (acyclic + explicit loops)
- ✓ Entry and terminal nodes are identified

## Output

If validation succeeds:
```
✓ Research planning DAG is valid and ready for execution
✓ Session closes with reference to generated research project
```

If validation fails:
```
✗ Validation issue identified: [description]
  Returning to [design-plan / write-prompts] for correction
```

---

## Implementation Notes

This finalize step does NOT write the research project DAG files. (That happens during research execution, not planning.)

This step validates the **planning output** (plan.json structure and prompts) before closing the planning session.

---

**Terminal Node:** This is the final step of the planning DAG. Research execution begins in the next session.

Ref: planning-audit-spec.md § Improvement 9 (Validation Before Commit)
