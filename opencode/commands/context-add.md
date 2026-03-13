---
description: "Write a new context file directly to project-local or global context, with required YAML metadata."
agent: headwrench
---

$ARGUMENTS

Add a permanent context file. Arguments format: `[--global] <filename> [<content>]`

- Without `--global`: writes to `.opencode/context/{filename}.md` (project-local, Tier 3)
- With `--global`: writes to `~/.config/opencode/context/{filename}.md` (global, Tier 2)

## Step 1 — Determine Content

If `<content>` is provided as an argument, use it directly.

If no content is provided, ask the user what the context file should contain before proceeding.

## Step 2 — Write the File

Write the file with a required YAML front-matter header as the first block:

```yaml
---
topic: <short-slug>
tier: global   # or: local
promoted_from: direct
session: ~
created: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
supersedes: ~
superseded_by: ~
---
```

Set `tier` to `global` if `--global` was passed, otherwise `local`. Set `created` and `last_reviewed` to today's date.

## Step 3 — If Promoting from Inbox

If the content originates from an inbox file (e.g. the user says "promote inbox/foo.md"):

1. Read the inbox file
2. Write the context file with the full content and a correct YAML header (`promoted_from: inbox`)
3. Update the source inbox file — set `superseded_by: <new-context-file-path>` and `active: false` in its YAML header. **Do not delete the inbox file.**

## Step 4 — Confirm

Report the file path written and show the first 10 lines including the YAML header.
