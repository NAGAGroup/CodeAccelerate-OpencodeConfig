---
name: file-operations
description: Teaches how to use file tools (read, edit, write, glob, grep) for code discovery, reading, and modification.
---

# File Operations

Use file tools to discover files, read contents, and make targeted edits.

## Tool Overview

**read** — Call with filePath to view file or directory. For large files, use offset (line number) and limit (line count) to read specific ranges. Always read before editing to verify current content.

**glob** — Call with pattern (e.g., "**/*.js", "src/**/*.ts") to find files by name, extension, or path. Returns sorted results by modification time. Use to locate files before reading.

**grep** — Call with pattern (regex) and optional include (file pattern) to search file contents. Returns file paths and line numbers with matches. Use for exact text matching after narrowing scope with glob.

**edit** — Call with filePath, oldString (exact text to replace), and newString (replacement). Must call read first to verify content and formatting. oldString must match exactly including indentation. Use replaceAll parameter to replace all occurrences in file.

**write** — Call with filePath and content to create new files or replace entire files. Must call read first if file exists. Use write only when creating new files or replacing entire file content.

## Rules

Always read a file before editing — this verifies current content and ensures oldString match is exact. Include sufficient context around changed text to make oldString unique. For multiple changes in one file, use separate edit calls. Use glob to discover files, then read to verify before changing. Match exact indentation and formatting in oldString — tabs vs spaces matter. For large files, use read with offset and limit to read specific sections.
