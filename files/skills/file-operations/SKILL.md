---
name: file-operations
description: Teaches how to use file tools (read, edit, write, glob, grep) for code discovery, reading, and modification.
---

# File Operations

Use file tools to discover files, read contents, and make targeted edits.

## Tools
**read** — View file or directory. Key params: `filePath`, `offset` (line number), `limit` (line count).

**glob** — Find files by pattern. Key params: `pattern` (e.g., "**/*.js"), `path` (optional directory).

**grep** — Search file contents by regex. Key params: `pattern` (regex), `include` (file pattern, optional).

**edit** — Replace text in file. Key params: `filePath`, `oldString` (exact text), `newString` (replacement), `replaceAll` (boolean).

**write** — Create or replace entire file. Key params: `filePath`, `content`.

## Rules
- Always read before editing to verify content and ensure exact oldString match
- Include sufficient context around changed text to make oldString unique
- Use separate edit calls for multiple changes in one file
- Match exact indentation and formatting in oldString
- Use glob to discover files, then read to verify before changing
- Use read with offset and limit for large files
- Must read file first if it exists before calling write
