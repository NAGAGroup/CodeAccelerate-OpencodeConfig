<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

## Objective

Update the canonical plan.json schema documentation in `opencode/planning/plan-design-guidelines.md` to reflect the new `next` field format. The `next` field entries change from plain strings (e.g., `["load-guidelines"]`) to objects with `desc` and `choose_when` fields (e.g., `{"load-guidelines": {"desc": "...", "choose_when": "..."}}`). Update the schema reference, node field table, examples, and minimal example.

## Scope

- **Edit:** `opencode/planning/plan-design-guidelines.md`
- **Excluded:** No files excluded

## Constraints

- Only change the `next` field description, examples, and schema type reference — do not rewrite unrelated sections
- Use `choose_when` (no hyphen) as the field name
- The new format is: `Record<string, { desc: string; choose_when: string }> | string | undefined`
- String-only `next` values are still supported for simple linear cases (backward compat not required per user, but the type allows it)

## Todolist

- [ ] Read `opencode/planning/plan-design-guidelines.md`
- [ ] Update the `### Node Fields` table `next` field row with new type description
- [ ] Update the `### Loop Nodes` example to use new object format
- [ ] Update the `### Gate Nodes` example to use new object format
- [ ] Update the `### Minimal Example` to use new object format

## Delegation

**Agent:** @QuickDoc (haiku)
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-design-guidelines.md`
- Goal: Update all `next` field documentation to the new `{ "id": { "desc": "...", "choose_when": "..." } }` object format per the task description
- Verify: All `next` field examples use the new format; schema type shows `Record<string, { desc: string; choose_when: string }> | string | undefined`

## Advance

Call `next_step()` when this subtask is complete.
