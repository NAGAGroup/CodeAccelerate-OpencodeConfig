# Finalize: Validate & Close Session (Terminal)

Your task is to **validate the generated project DAG and close the planning session**.

## What to Validate

1. **JSON Syntax**
   - Verify plan.json is valid JSON (can be parsed without errors)
   - Validate schema structure

2. **Node References**
   - All node IDs referenced in `next` fields exist in `nodes`
   - No dangling references
   - Entry node is valid
   - Terminal node has no `next` field

3. **Prompt Files**
   - All prompt files referenced in `prompt` fields exist
   - No missing files

4. **DAG Integrity**
   - No unreachable nodes (all nodes are reachable from entry)
   - All branching logic is sound
   - Loop nodes have `remaining_visits` if needed

## Validation Steps

```bash
# Validate JSON structure
jq . plan.json

# Verify all node references
jq '.nodes | keys[] as $id | .[$id].next // empty' plan.json

# Check all prompt files exist
find prompts/ -name "*.md"
```

## Validation Report

Report findings:
- ✓ JSON syntax valid
- ✓ All node references exist
- ✓ All prompt files present
- ✓ DAG is reachable from entry to terminal
- ✓ No structural issues

## Outcome

If **validation passes:** Planning session is complete and ready for execution.

If **validation fails:** Report errors and do NOT close session.

Call `close_session()` when validation passes.
