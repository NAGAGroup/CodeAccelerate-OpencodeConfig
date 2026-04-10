---
name: editing
description: Teaches how to use grepai for orientation, read for full context, and edit/write for targeted changes.
---
<rules>
Always orient with grepai before editing — never edit without understanding context.
Always read a file before editing it — the edit tool requires exact string matching and guessing causes failures.
If trace tools are available, use them to understand how code connects to the rest of the codebase before editing.
Prefer edit over write for existing files — write overwrites the entire file.
</rules>

<example>
Step 1 — Orient.
Use grepai_grepai_search to find where relevant code lives. Describe what the code does, not what it is called. Use compact=True for discovery, then targeted queries with path to drill into specific areas.

Step 2 — Understand.
Use read to get full file content with line numbers before making any changes.
Read a directory to understand project structure around the area being edited.
Use offset and limit for large files.

Step 3 — Change.
edit — for modifying existing files.
  oldString: copied exactly from read output, same indentation and whitespace
  newString: the replacement
  If the string appears multiple times, provide more surrounding context or use replaceAll.

write — for new files or complete rewrites.
  Must have read the file first if it already exists.
</example>
