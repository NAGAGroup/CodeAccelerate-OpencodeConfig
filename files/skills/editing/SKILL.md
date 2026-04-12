---
name: editing
description: Teaches how to use grepai for orientation, read for full context, and edit/write for targeted changes.
---
<rules>
Always call Read on a file before Edit or Write — grepai results do not satisfy this requirement.
Always use Edit for targeted changes to existing files.
Never use Write unless creating a new file or intentionally replacing the entire file content.
Never guess at file content — Read the file to see exact text before matching.
</rules>

<workflow>
1. Use grepai or glob/grep to locate the relevant files and understand surrounding context.
2. Call Read on the file you intend to edit.
3. Make the targeted change using Edit (preferred) or Write.

If Edit fails with "oldString not found":
  - Call Read again to see the exact current content.
  - Match exact whitespace and indentation from the Read output — never approximate.

If Edit or Write fails with "must read file first":
  - Call Read on that exact file path immediately.
  - grepai results will not resolve this error — only Read will.
</workflow>
