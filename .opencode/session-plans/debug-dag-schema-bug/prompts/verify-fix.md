# Verify Fix: Confirm Prompt Updates Resolve the Bug

## Objective

Verify that the planning prompt updates successfully prevent agents from generating invalid `next` structures.

## What to Do

1. **Trigger a new planning session** with the updated prompts
   - Use `plan_generic()` or any planning mode
   - Allow the planning agent to generate a complete DAG

2. **Inspect the generated `plan.json`** in `.opencode/session-plans/{new-session-name}/plan.json`

3. **Validate all `next` structures:**
   - Check every `next` field in every node
   - For branching `next` objects (object format), verify:
     - All keys are actual node IDs in the DAG
     - No generic labels like `"pass"`, `"fail"`, `"yes"`, `"no"`, etc.
     - All keys match something in the nodes section

## Verification Checklist

For each node in the generated DAG:

- [ ] If `next` is a string → valid (single node ID)
- [ ] If `next` is an array → valid (multiple node IDs)
- [ ] If `next` is an object:
  - [ ] All keys exist as node IDs in the DAG
  - [ ] No keys are generic labels
  - [ ] Each key has `desc` and `choose_when` properties
  - [ ] All values reference real nodes

## Expected Outcome

**Success:** Generated DAG is fully valid with semantic node IDs throughout.

**Failure:** DAG still contains invalid `next` keys despite prompt updates.

## If Verification Succeeds

- Bug is fixed
- Planning prompts now properly guide agents
- Call `next_step()` to proceed to finalization

## If Verification Fails

- Prompt updates were incomplete or unclear
- Agent may need additional guidance or examples
- Document what's still wrong and escalate for iteration

## Notes

- Compare the new generated DAG to the previous one (if available)
- Check for improvement in semantic meaningfulness of node names
- The fix should be immediately visible in generated DAGs
