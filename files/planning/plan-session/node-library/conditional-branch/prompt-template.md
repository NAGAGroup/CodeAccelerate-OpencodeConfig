# {{NODE_TITLE}}

{{CONDITION_DESCRIPTION}}

## Branch conditions

- **{{BRANCH_1_LABEL}}** — {{BRANCH_1_DESCRIPTION}}
- **{{BRANCH_2_LABEL}}** — {{BRANCH_2_DESCRIPTION}}

Branch labels must exactly match the `when` conditions in this node's `next` array in `plan.json`. A mismatch silently breaks routing.

## How to decide

{{HOW_HW_KNOWS}}

## What to do

Evaluate the condition using prior context — no new tool calls are needed. Then call `next_step({ next: '<node-id>' })` where `<node-id>` is the id of the branch node that matches the condition. The available branch IDs come from the `next` array for this node in `plan.json`.

## Todo

`[]` — No tools to call. HW evaluates the condition from prior context and calls `next_step({ next: '<node-id>' })` to take the branch.

## Example

If the preceding bash node ran `bun run build` and exited 0, take the `build-passed` branch. If it exited non-zero, call `next_step({ next: 'fix-errors' })`.
