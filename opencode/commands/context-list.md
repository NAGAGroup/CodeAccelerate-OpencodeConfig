---
description: "List all permanent context files (project-local and global) with metadata."
agent: headwrench
---

List all context files currently in the tiered context system.

## Project-local context — `.opencode/context/`

For each file, show:
- Filename
- `topic:` from YAML header (or `(no header)` if missing)
- `last_reviewed:` from YAML header (or `—`)
- `superseded_by:` if set — mark as ⚠️ superseded
- File size

Display rules for inactive entries:
- If `active: false` is set in the YAML header, prefix the entry with `⚪ [inactive]`
- If `superseded_by:` is set in the YAML header, prefix the entry with `⚪ [inactive → {superseding-filename}]` showing the filename that supersedes it

## Global context — `~/.config/opencode/context/`

Same format as above.

## Summary line

End with:
```
N files total (X global, Y local)
```

If either location is empty or doesn't exist, say so explicitly. Do not error silently.
