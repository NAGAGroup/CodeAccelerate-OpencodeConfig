---
description: "Remove a context file from project-local or global context."
agent: headwrench
---

$ARGUMENTS

Remove a context file. Arguments: `[--global] <filename>`

- Without `--global`: removes from `.opencode/context/{filename}.md`
- With `--global`: removes from `~/.config/opencode/context/{filename}.md`

Show the file content before deleting and ask for confirmation. Then delete and confirm.
