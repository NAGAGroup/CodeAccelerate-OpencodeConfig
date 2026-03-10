---
description: "Add a context file to project-local (.opencode/context/) or global (~/.config/opencode/context/) context."
agent: headwrench
---

$ARGUMENTS

Add a context item. Arguments format: `[--global] <filename> <content or source path>`

- Without `--global`: writes to `.opencode/context/{filename}.md` (project-local, read by ContextScout during planning)
- With `--global`: writes to `~/.config/opencode/context/{filename}.md` (available across all projects)

If promoting from inbox, read the inbox file content and write it to the appropriate context location, then delete the inbox file.

Confirm the file was written and show its location.
