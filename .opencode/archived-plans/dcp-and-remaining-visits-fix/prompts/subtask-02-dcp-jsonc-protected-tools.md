<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02 — Add DAG Tools to protectedTools in dcp.jsonc

## Objective

Add `activate_plan`, `close_session`, and `next_step` to the `compress.protectedTools` array in `opencode/dcp.jsonc`. After the plugin refactor in subtask-01, these tools return prompt content as their tool result. Adding them to `protectedTools` ensures DCP appends their output during any compression event rather than discarding it — keeping node prompt content in context.

## Scope

- **Edit:** `opencode/dcp.jsonc`
- **Excluded:** All other files

## Constraints

- The `compress.protectedTools` field currently exists in the config as an empty array `[]`. Add the three tool names to it.
- Tool names must exactly match the tool IDs registered in the plugin: `"activate_plan"`, `"close_session"`, `"next_step"`.
- Do not change any other fields in dcp.jsonc.

## Todolist

- [ ] Read `opencode/dcp.jsonc` to locate the `compress.protectedTools` field
- [ ] Add `"activate_plan"`, `"close_session"`, `"next_step"` to the array
- [ ] Verify the JSON is still valid after the edit

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/dcp.jsonc`
- Goal: Add `"activate_plan"`, `"close_session"`, `"next_step"` to the `compress.protectedTools` array
- Constraints: Exact tool name strings; no other changes
- Verify: JSON remains valid

## Advance

Call `next_step()` when this subtask is complete.
