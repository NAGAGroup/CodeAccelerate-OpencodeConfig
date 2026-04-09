---
name: editing
description: Teaches how to use grepai for orientation, read for full context, and edit/write for targeted changes.
---
<overview>
Three-step workflow: orient with grepai, understand with read, then change with edit or write. Skipping orient leads to missed dependencies. Skipping read leads to failed edits.
</overview>

<procedure name="orient">
Use grepai_grepai_search to find where relevant code lives. Describe what the code does in natural language. Use compact=true for discovery, then targeted queries with path to drill into specific areas.

If trace tools are available (grepai_grepai_trace_callers, grepai_grepai_trace_callees, grepai_grepai_trace_graph), use them to understand how the code connects to the rest of the codebase before editing.
</procedure>

<procedure name="understand">
Use read to see the full content before changing anything.

Read a directory to understand project structure around the area being edited. Read a file to get full content with line numbers. Use offset and limit for large files.

You must read every file before editing it. The edit tool requires exact string matching — guessing at content from grepai snippets causes edits to fail.
</procedure>

<procedure name="change">
edit — for modifying existing files. Provide oldString (copied exactly from read output) and newString. The old string must match exactly: same indentation, same whitespace, same content. If the string appears multiple times, provide more surrounding context or use replaceAll.

write — for creating new files or completely rewriting existing ones. You must have read the file first if it exists. Prefer edit over write for existing files — write overwrites the entire file.
</procedure>
