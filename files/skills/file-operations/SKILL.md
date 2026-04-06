---
name: file-operations
description: Teaches how to use file tools (read, edit, write, glob, grep) for code discovery, reading, and modification.
---

# File Operations

This skill teaches how to use file tools effectively for investigation, reading, and modification. Load it when you need to discover files, read their contents, or make targeted edits.

## Tool Overview

**Use the read tool to examine file contents.** Call read with a filePath parameter to view a file or directory. For large files, use the offset parameter to read specific line ranges and the limit parameter to control how many lines to return. Reading before editing prevents conflicts and ensures you understand the current state.

**Use the glob tool to discover files by pattern.** Call glob with a pattern parameter (e.g., "**/*.js" or "src/**/*.ts") to find files matching that pattern. Glob is fast and returns sorted results by modification time. Use it to locate files by name, extension, or path structure before reading them.

**Use the grep tool to search file contents by pattern.** Call grep with a pattern parameter (regex) and optional include parameter (file pattern) to find files containing specific content. Grep returns file paths and line numbers with matches. Use it for exact text matching within files you've already narrowed down with glob or search tools.

**Use the edit tool to make targeted changes to existing files.** Call edit with filePath, oldString (exact text to replace), and newString (replacement text). You MUST call read first to verify the current content and get exact formatting correct. The oldString must match exactly including indentation. Use replaceAll parameter to replace all occurrences of a string across the file.

**Use the write tool to create new files.** Call write with filePath and content parameters. You MUST call read first if the file exists. Write will overwrite existing files. Use write only when creating new files or when the entire file should be replaced.

## Patterns for Safe File Modification

**Pattern: Read → Edit → Verify**
1. Call read to examine the current state of the file
2. Identify the exact text to replace (oldString) with proper indentation and formatting
3. Call edit with the exact match and replacement text
4. The edit succeeds only if oldString is found exactly; mismatched indentation or text will fail

**Pattern: Glob → Read → Analyze**
1. Use glob with a pattern to find candidate files
2. Read key files identified by glob to understand structure
3. Use grep for exact text matching only after narrowing scope with glob

**Pattern: Large File Reading with Offset**
1. Call read with offset parameter to start from a specific line number
2. Use limit parameter to control how many lines to return
3. For very large files, read specific sections rather than entire files

## Rules

Always read a file before editing it — this verifies current content and ensures your oldString match is exact. When editing, include sufficient context around the changed text to make oldString unique and avoid accidental matches elsewhere in the file. For multiple changes in one file, make separate edit calls rather than trying to batch changes. Use glob to discover files, then read to verify before making changes. Use grep only after narrowing scope with glob or semantic search — full-codebase grep is a last resort. Match exact indentation and formatting in oldString — tabs vs spaces matter, and leading whitespace must match exactly.

## Examples

**Good:** You need to change a function. Call read to see the current implementation. Call edit with oldString showing the exact function signature and a few lines of body, newString with the changed version. This ensures you match exactly and don't accidentally replace a similar pattern elsewhere.

**Good:** You need to find all authentication-related files. Call glob with pattern "**/*auth*.ts" to find candidates. Read key files to verify they contain what you're looking for. Then use grep within those files for specific pattern matching if needed.

**Good:** You need to update configuration in a 500-line file. Call read with offset=200 and limit=100 to read lines 200-300. Call edit with the exact text you found in that section, making your oldString unique to that location.

**Bad — edit without read:** You try to edit without reading first, guessing at indentation and exact text. The edit fails because oldString doesn't match exactly, and you've wasted a tool call.

**Bad — grep entire codebase:** You grep the entire project for "token" without first using glob to narrow to relevant files, getting back 100+ matches with low signal.

**Bad — multiple edits in one call:** You try to make three different changes with one edit call by setting replaceAll. If the pattern appears elsewhere, you risk unintended changes. Use separate edit calls for logically distinct changes.

**Bad — mismatched indentation:** You read a file and see 2-space indentation. You edit with 4-space indentation in oldString. The edit fails because indentation doesn't match exactly.
