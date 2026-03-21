<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

## Objective

Update the `next_step()` function in `opencode/plugins/planning-enforcement.ts` to detect when `next` is in the new object format and append a formatted `## Available Next Steps` guidance block to the tool response. The injected block tells the agent how to choose before calling `next_step()`.

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts`
- **Excluded:** No files excluded

## Constraints

- Only modify the response returned by `next_step()` when `next` is a non-string (the new object format)
- The injected block must use the format:
  ```
  ## Available Next Steps

  - **{key}**: {desc} _(choose when: {choose_when})_
  ```
- Do NOT edit `DagNode` type — that was done in subtask 2
- Do NOT change how `next` values are validated or resolved — only add the injection block

## Todolist

- [ ] Read `opencode/plugins/planning-enforcement.ts`
- [ ] Locate the `next_step()` function and its response handling
- [ ] Find the point where a multi-option error is returned (when `next` is an array but `next` arg is missing)
- [ ] Add a new branch: if `currentNode.next` is the new object format, generate and append `## Available Next Steps` block to the tool response
- [ ] Verify: when `next` is a plain string or undefined (terminal), no injection block is added

## Delegation

**Agent:** @JuniorDev (haiku)
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts`
- Goal: In `next_step()`, after determining `currentNode.next` is a non-string, non-undefined object (new format), append a `## Available Next Steps` block to the tool response. Format: `- **{key}**: {desc} _(choose when: {choose_when})_` per entry.
- Verify: The tool response includes the guidance block when `next` is an object; no change when `next` is a string or absent

## Advance

Call `next_step()` when this subtask is complete.
