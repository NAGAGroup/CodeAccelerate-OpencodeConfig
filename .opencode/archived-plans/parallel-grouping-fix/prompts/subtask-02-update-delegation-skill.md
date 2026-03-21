<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02: Update Delegation Skill — Parallel Grouping Rule

## Objective

Add a rule to the delegation skill clarifying that `@JuniorDev (parallel × N)` or `@QuickDoc (parallel × N)` means **one DAG subtask node** dispatches N agents simultaneously — not N separate subtask nodes. This is the skill that planning agents load during agent-routing; adding the rule here propagates it into any planning session that uses the skill.

## Scope

**Discover and edit:**
- The source file for the delegation skill. Expected path: `files/skills/delegation/SKILL.md` within this repository (`/home/jack/CodeAccelerate-OpencodeConfig/`). Confirm via glob before editing.

**Excluded:** The installed copy under `/tmp/` — do not edit that. Only edit the source file in the repository.

## Constraints

- You MUST confirm the source file path via glob before editing. Do not assume the path.
- If the file is NOT found at `files/skills/delegation/SKILL.md`, search the repo for `SKILL.md` files and identify the correct delegation skill source.
- Do NOT edit the installed copy in `/tmp/`.
- Match existing formatting style in the file — do not rewrite or restructure existing content.
- This is a HW-direct task. Do not delegate the path discovery. The edit itself may be done directly or delegated to @QuickDoc after the path is confirmed.

## Todolist

1. Glob for `SKILL.md` files under `/home/jack/CodeAccelerate-OpencodeConfig/` to confirm the source path
2. Read the file to locate the **Assignment Format** section (or equivalent section describing how to write subtask delegation blocks)
3. After the existing `@JuniorDev (parallel × N)` example or the parallel dispatch description, insert the following rule:

```
> **One node per parallel batch:** When routing multiple independent tasks as parallel (e.g., `@JuniorDev (parallel × 3)`), they must be grouped into a **single subtask node** in the generated `plan.json`. That node's prompt dispatches all agents simultaneously in one response, waits for all to return, then calls `next_step()`. Do NOT produce one subtask node per parallel agent — the DAG plugin executes nodes sequentially and has no mechanism for parallel node execution.
```

4. Verify the inserted content is present and reads coherently in context
5. Call `close_session()` — this is the terminal subtask

## Delegation

**Agent:** HW (direct)
**Reason:** File discovery step (glob + path confirmation) requires HW's filesystem access before the edit can be scoped. Once the path is confirmed, HW edits directly or delegates the insert to @QuickDoc.

## Advance

Call `next_step()` when the edit is complete — the DAG will detect this is the terminal node and prompt you to call `close_session()`. Call `close_session()` exactly once. Do NOT call `next_step()` again after `close_session()`.
