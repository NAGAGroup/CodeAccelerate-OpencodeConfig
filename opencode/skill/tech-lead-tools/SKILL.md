---
name: tech-lead-tools
description: Guidelines for direct tool usage - when to use built-in tools vs bash
---

# Tool Usage Guide

## Critical Rule: Use Built-in Tools First

> [!CAUTION]
> **Use grep/glob/read for codebase analysis, NOT bash commands.**

### Built-in Tools (Use These First)

**For finding files:**
```typescript
glob({ pattern: "**/*.ts" })           // Find all TypeScript files
glob({ pattern: "src/**/test*.js" })   // Find test files in src/
```

**For searching content:**
```typescript
grep({ pattern: "function.*authenticate", include: "*.js" })
grep({ pattern: "import.*React", include: "**/*.tsx" })
```

**For reading files:**
```typescript
read({ filePath: "/absolute/path/to/file.js" })
```

> [!IMPORTANT]
> These tools are faster, more reliable, and provide structured output. Use them instead of bash equivalents.

---

## When to Use Bash

### You Run Bash For (with approval):

**Setup/Initialization:**
- `npm init`, `pixi init`, `cargo new`, `go mod init`
- Project scaffolding commands

**Dependency Management:**
- `npm install`, `pip install`, `pixi add package`
- `yarn add`, `cargo add`, `go get`

**Git Operations:**
- `git init`, `git checkout -b branch-name`, `git add .`, `git commit -m "message"`
- `git branch`, `git merge`, `git pull`, `git push`

**Code Generation:**
- `protoc`, scaffolding tools
- Commands that generate source files

**User-Requested Commands:**
- Any command the user explicitly asks you to run

---

## When to Delegate to test_runner

### NEVER Run These Yourself:

**Build Commands:**
- `npm run build`, `cargo build`, `make`, `gradle build`
- ANY command that compiles or builds the project

**Test Commands:**
- `npm test`, `pytest`, `cargo test`, `jest`, `mocha`
- ANY command that runs tests

**Verification/Diagnostics:**
- Commands to verify builds succeeded
- Commands to check test results
- Commands to diagnose failures

> [!WARNING]
> If you find yourself typing `npm test` or `cargo build`, STOP. Load skill -> Delegate to test_runner.

---

## Anti-Patterns: What NOT to Do

**Wrong:**
```bash
find . -name "*.ts"           # Use glob instead
grep -r "function" src/       # Use grep tool instead
cat src/index.js              # Use read instead
npm test                      # Delegate to test_runner
cargo build                   # Delegate to test_runner
```

**Correct:**
```typescript
glob({ pattern: "**/*.ts" })
grep({ pattern: "function", include: "src/**/*" })
read({ filePath: "/absolute/path/src/index.js" })

// For tests/builds:
skill({ name: "test_runner-task" })
task({
  subagent_type: "test_runner",
  template_data: { ... }
})
```

---

## File Editing Constraints

> [!CAUTION]
> You can ONLY edit/write markdown (.md) files.

**You CAN edit:**
- Documentation: `README.md`, `CONTRIBUTING.md`
- Plans: `.opencode/plans/*.md`, `docs/plans/*.md`
- Architecture docs: `.opencode/architecture/*.md`, `docs/architecture/*.md`

**You CANNOT edit:**
- Code files: `.js`, `.ts`, `.py`, `.rs`, `.cpp`, `.java`, `.go`, etc.
- Config files: `.json`, `.yaml`, `.toml`, `.xml`, `.env`, etc.
- Test files
- ANY non-markdown files

**For ALL code changes:** Load skill -> Delegate to junior_dev

---

## Quick Reference

| Task | Tool to Use | Don't Use |
|------|-------------|-----------|
| Find files by name | `glob` | `find`, `ls` |
| Search file contents | `grep` tool | `grep`, `rg`, `ag` bash commands |
| Read file contents | `read` | `cat`, `head`, `tail` |
| Install dependencies | `bash` (npm install) | Correct usage |
| Git operations | `bash` (git commit) | Correct usage |
| Run tests | Delegate to test_runner | `npm test` yourself |
| Run builds | Delegate to test_runner | `cargo build` yourself |
| Edit code | Delegate to junior_dev | edit/write yourself |
| Edit markdown | `edit`/`write` yourself | Correct usage |

---

## Other Tools

**Coordination:**
- `question` - Ask structured questions (see tech-lead-questions skill)
- `task` - Delegate to specialized agents (see tech-lead-delegation skill)
- `skill` - Load delegation templates

**Utilities:**
- `todowrite`/`todoread` - Track multi-step tasks
- `mermaid_*` - Create diagrams for documentation
- `lsp` - Code intelligence (when grep isn't enough)
