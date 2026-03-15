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
- `Yes, delete it` — proceed to Step 3 (chain validation)
- `No, keep it` — abort and report that no changes were made

## Step 3 — Chain Validation

Grep the following locations for any file whose `superseded_by:` field references the file being removed:
- `.opencode/context/`
- `~/.config/opencode/context/`
- `.opencode/inbox/`

**If dependent files are found:** Surface a warning listing them:

> "Warning: the following files reference `{filename}` as their `superseded_by` target: [list]. Removing it will orphan their supersession chain."

Use the `question` tool to ask:

> "Proceed and update orphaned files? (This will set their `superseded_by:` to null)"

- If the user confirms: remove the target file AND update each dependent file's `superseded_by:` field to `~` (null)
- If the user cancels: abort and report that no changes were made

**If no dependent files are found:** proceed directly to Step 4.

## Step 4 — Execute

Delete the file and report success.
