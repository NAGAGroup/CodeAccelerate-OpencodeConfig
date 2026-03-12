# Subtask 06 — Agent Commit Rules

## What Changed

Updated 4 files to establish a clear commit ownership model:

### checkpoint.md — Step 1 WIP Commit
- Now uses a **3-way ownership rule**:
  - Implementation subtask (CodeWriter/DocWriter): agent already committed; HW verifies with `git log -1 --oneline` and skips
  - Read-only/analysis subtask: skip as before
  - HW-direct edits: HW runs `git add -A && git commit`
- Added note: commit must include session directory files when they were part of the task

### code-writer.md
- Added commit rule to `## Rules`: `git add -A && git commit -m "<type>: <description>"` at end of each task
- Types: `feat`, `fix`, or `docs`
- Explicit inclusion of `.opencode/sessions/` files when in scope

### doc-writer.md
- Same commit rule, adapted: `git add -A && git commit -m "docs: <description>"`
- Explicit inclusion of `.opencode/sessions/` files when in scope

### headwrench.md
- Updated Layer 3 checkpoint step 1 text to reflect the 3-way rule
- Added `## Commit Ownership` section clarifying HW's commit scope is limited to:
  1. Read-only subtask checkpoint commits (when no agent committed)
  2. Session metadata updates not covered by agent commits
  3. Final session-close commit

## Key Decisions

- **Agents own their commits** — commit instruction lives in the agent's own file, not just in checkpoint.md
- **HW verifies, not re-commits** — avoids duplicate commits
- **Final session-close commit always HW** — never delegated to an agent
- **`git add -A` is mandatory** — ensures session files are captured without needing to list them individually

## Commit

`647c6a4` — feat: agents commit own work + session dir — update checkpoint, code-writer, doc-writer, headwrench
