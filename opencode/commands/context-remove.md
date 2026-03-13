---
description: "Remove a context file from project-local or global context."
agent: headwrench
---

$ARGUMENTS

Remove a context file. Arguments: `[--global] <filename>`

- Without `--global`: targets `.opencode/context/{filename}.md`
- With `--global`: targets `~/.config/opencode/context/{filename}.md`

## Step 1 — Read the File

Read the full content of the target file and display it to the user.

## Step 2 — Confirm Deletion

Use the `question` tool to ask:

> "Delete `{filepath}`?"

Options:
- `Yes, delete it` — proceed with deletion
- `No, keep it` — abort

## Step 3 — Execute

If confirmed: delete the file and report success.

If aborted: report that no changes were made.
