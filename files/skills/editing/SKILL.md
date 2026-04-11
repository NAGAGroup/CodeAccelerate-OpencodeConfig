---
name: editing
description: Teaches how to use grepai for orientation, read for full context, and edit/write for targeted changes.
---
<rules>
The Read tool must be called on a file before Edit or Write can be used on it. grepai results do NOT satisfy this requirement — only the Read tool does. If Edit or Write fails with "must read file first", call Read on that exact file path immediately.
Always use Edit for targeted changes to existing files. Use Write only when creating a new file or replacing the entire file content intentionally.
Never guess at file content when editing — Read the file first to see the exact text to match in oldString.
</rules>

<workflow>
1. Use grepai or glob/grep to locate the relevant files and understand the surrounding context.
2. Call Read on the specific file you intend to edit. This is required before any Edit or Write call on that file.
3. Make the targeted change using Edit (preferred) or Write.

If Edit fails with "oldString not found":
  - The text may differ from what you expected. Call Read again to see the exact current content.
  - Match the exact whitespace and indentation from the Read output — never approximate.

If Edit or Write fails with "must read file first":
  - Call Read on that exact file path immediately.
  - Do NOT use grepai as a substitute — grepai results will not resolve the error. Only Read will.
</workflow>
