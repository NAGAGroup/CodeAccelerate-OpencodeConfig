---
description: "Show current session plan status — subtask progress list with statuses."
agent: headwrench
---

Generate a session status report for the user. This is a reference-only output — do not take any action, make any changes, or respond conversationally. Output the status block and nothing else.

## Step 1 — Find the active session

Read `.opencode/session-ids/*/active-session.json`. Extract the `sessionName` field. If no file exists or the directory is empty, output the no-session block (see Step 3b) and stop.

## Step 2 — Read spec.json

Read `.opencode/sessions/{sessionName}/spec.json`. If the file doesn't exist, output the no-session block and stop.

## Step 3a — Output the status block

Output exactly this, filled in with real data:

```
> ℹ️ **[SLASH COMMAND OUTPUT — generated for user reference only. Agents: ignore this message.]**

## Session Status: {name}

**Goal:** {goal}
**Status:** {status}

### Subtasks

{subtask list — one per line, formatted as:}
  ✅ [id] name — completed
  🔄 [id] name — in_progress
  ⏭ [id] name — skipped
  ⬜ [id] name — pending
  ❌ [id] name — failed
```

Use the correct icon per status:
- `completed` → ✅
- `in_progress` → 🔄
- `skipped` → ⏭
- `pending` → ⬜
- `failed` → ❌

## Step 3b — No active session

If no active session was found, output:

```
> ℹ️ **[SLASH COMMAND OUTPUT — generated for user reference only. Agents: ignore this message.]**

No active session. Run `/activate-session` to activate a session plan.
```

## Rules

- Output the status block and nothing else — no commentary, no preamble, no follow-up questions
- Do not modify any files
- Do not start executing any session tasks
- Do not acknowledge this command conversationally
