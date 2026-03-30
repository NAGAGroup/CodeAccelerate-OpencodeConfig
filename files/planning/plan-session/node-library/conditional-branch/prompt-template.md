# {{NODE_TITLE}}

*Descriptive title matching the condition being evaluated. E.g., "Build Result Check" or "File Exists Check". Avoid generic titles like "Branch Node".*

{{CONDITION_DESCRIPTION}}

*Describe the condition in one sentence: what was evaluated, when it was evaluated, and what the possible results are. E.g., "The build command `bun run build` ran in the preceding `run-build` node — check whether it exited 0 (success) or non-zero (failure)."*

## Branch conditions

- **{{BRANCH_1_LABEL}}** — {{BRANCH_1_DESCRIPTION}}
- **{{BRANCH_2_LABEL}}** — {{BRANCH_2_DESCRIPTION}}

Branch labels must exactly match the `when` conditions in this node's `next` array in `plan.json`. A mismatch silently breaks routing.

## How to decide

{{HOW_HW_KNOWS}}

*Describe where the condition result lives in HW's context: which prior node produced it, what tool call generated it, and what the result looks like. E.g., "The bash tool output from the `run-build` node shows either 'Build succeeded' or an error trace." Do NOT write "HW should check the results" — name the exact context artifact.*

## What to do

Evaluate the condition using prior context — no new tool calls are needed.

Then call `next_step({ next: '<node-id>' })` where `<node-id>` is the exact `id` field of the branch node in plan.json — NOT the `when` string. Branch routing uses node ID matching. The available branch IDs are in the `next` array for this node in plan.json.

Do NOT call `question` to ask the user — this branch is machine-decided.

## Todo

`[]` — No tools to call. HW evaluates the condition from prior context and calls `next_step({ next: '<node-id>' })` to take the branch.

> **How to branch:**
> (1) Identify the condition result from prior context — do not call any tool to re-evaluate it;
> (2) match the result against the branch conditions listed above;
> (3) call `next_step({ next: '<node-id>' })` using the id from the matching branch's node object in plan.json.
> Do NOT use the `when` string as the argument.

## Example

If the preceding bash node ran `bun run build` and exited 0, take the `build-passed` branch. If it exited non-zero, call `next_step({ next: 'fix-errors' })`.
