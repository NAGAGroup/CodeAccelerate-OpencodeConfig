<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 4: Build and verify

## Objective

Generate dist output and verify both profiles are registered correctly.

## Scope

**Run:**
- `bun run build`

**Verify:**
- `dist/index.json` contains `ocx-naga-haiku` component
- `dist/index.json` contains `ocx-naga-haiku-pilot` component

## Constraints

- Build must succeed without errors
- Both profile components must appear in dist/index.json

## Todolist

- [ ] Run `bun run build`
- [ ] Read `dist/index.json` and verify both `ocx-naga-haiku` and `ocx-naga-haiku-pilot` are present

## Delegation

**Agent:** HW (direct)
**Reason:** Shell command requiring output analysis

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
