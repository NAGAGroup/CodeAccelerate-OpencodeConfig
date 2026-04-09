---
name: editing
description: Teaches how to use grepai for orientation, read for full context, and edit/write for targeted changes.
---

# What does this skill teach?

In this skill, you learn the workflow for making targeted changes to a codebase: orient with grepai, understand with read, then change with edit or write. Each tool has a distinct role — skipping one leads to blind edits or wasted effort.

## The workflow

### 1. Orient (grepai)

Use `grepai_grepai_search` to find where the relevant code lives. This is semantic search — describe what the code does in natural language, not keywords. Use `compact=true` for discovery to save tokens, then targeted queries with `path` to drill into specific areas.

If you have access to trace tools (`grepai_grepai_trace_callers`, `grepai_grepai_trace_callees`, `grepai_grepai_trace_graph`), use them to understand how the code you found connects to the rest of the codebase. This prevents edits that break callers or miss dependent code.

GrepAI gives you the map — file paths, line numbers, symbols. It does not give you the full picture.

### 2. Understand (read)

Use `read` to see what you're working with before changing anything. This tool has two modes:

**Read a directory** — returns the file listing (files and subdirectories). Use this to understand project structure around the area you're editing. If grepai found `src/handlers/auth.ts`, read `src/handlers/` to see what else lives there. This reveals related files, test files, configuration, and other context that grepai might not have surfaced.

**Read a file** — returns the full content with line numbers. You MUST read every file before editing it. The `edit` tool requires exact string matching of the old content — if you guess at what a file contains based on grepai snippets, the edit will fail. Use `offset` and `limit` for large files to read specific sections.

### 3. Change (edit / write)

**`edit`** — for modifying existing files. Provide the exact `oldString` (copied from what `read` showed you) and the `newString` to replace it with. The old string must match exactly — same indentation, same whitespace, same content. If the string appears multiple times, provide more surrounding context to make it unique, or use `replaceAll` for intentional bulk replacements.

**`write`** — for creating new files or completely rewriting existing ones. You must have read the file first if it exists. Prefer `edit` over `write` for existing files — `write` overwrites the entire file, which risks losing content you didn't read.

## How to think through this skill

<|think|>
- Have I used grepai to find where the relevant code lives before jumping to edits?
- Have I read the directory structure around my target to understand what else is there?
- Have I read every file I'm about to edit — do I know its exact current content?
- Am I using edit (targeted replacement) rather than write (full overwrite) for existing files?
- Is my oldString an exact match of what read showed me — same indentation, same whitespace?
- Have I checked for callers/dependents that my edit might affect?
