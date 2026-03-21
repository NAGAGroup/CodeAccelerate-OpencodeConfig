<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

## Objective

Update the `DagNode` interface in `opencode/plugins/planning-enforcement.ts` to match the new `next` field schema. Change the type from `string | string[] | undefined` to the new object format.

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts`
- **Excluded:** No files excluded

## Constraints

- Only change the `next` field type definition in the `DagNode` interface — do not change any implementation logic in this subtask
- Use `choose_when` (no hyphen) as the field name
- New type: `Record<string, { desc: string; choose_when: string }> | string | undefined`

## Todolist

- [ ] Read `opencode/plugins/planning-enforcement.ts`
- [ ] Locate the `DagNode` interface
- [ ] Update the `next` field type to the new format
- [ ] Verify no other type references to `next` need updating in this subtask (logic updates happen in subtask 3)

## Delegation

**Agent:** @JuniorDev (haiku)
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts`
- Goal: Update the `DagNode` interface `next` field type from `string | string[] | undefined` to `Record<string, { desc: string; choose_when: string }> | string | undefined`
- Verify: The type definition compiles correctly alongside the rest of the file

## Advance

Call `next_step()` when this subtask is complete.
