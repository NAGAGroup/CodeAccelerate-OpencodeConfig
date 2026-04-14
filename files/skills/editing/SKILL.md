---
name: editing
description: Teaches how to use grepai for orientation, filesystem_read_file for full context, and filesystem_edit_file/filesystem_write_file for targeted changes.
---
<rules>
Always call filesystem_read_file on a file before filesystem_edit_file or filesystem_write_file — grepai results do not satisfy this requirement.
Always use filesystem_edit_file for targeted changes to existing files.
Never use filesystem_write_file unless creating a new file or intentionally replacing the entire file content.
Never guess at file content — call filesystem_read_file to see exact text before matching.
</rules>

<workflow>
1. Use grepai or grep/filesystem_search_files to locate the relevant files and understand surrounding context.
2. Call filesystem_read_file on the file you intend to edit.
3. Make the targeted change using filesystem_edit_file (preferred) or filesystem_write_file.

If filesystem_edit_file fails with no match:
  - Call filesystem_read_file again to see the exact current content.
  - Match exact whitespace and indentation — never approximate.
</workflow>
