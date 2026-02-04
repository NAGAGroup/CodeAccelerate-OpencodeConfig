---
name: tech-lead-tools
description: Guidelines for direct tool usage - when to use built-in tools vs bash
---

# Tool Usage Guide

## Critical Rule: Create Todolist Before ANY Work

> [!CAUTION]
> **You MUST create a todolist before using ANY tools.**

Before you can use read/glob/grep/bash/edit/write/task or ANY other tools (except question/skill/todoread/todowrite), you must first create a todolist:

```typescript
// Simple task:
todowrite({ 
  todos: [
    { id: "1", content: "Research auth and delegate implementation", status: "in_progress", priority: "high" }
  ]
})

// Complex task:
todowrite({
  todos: [
    { id: "1", content: "Analyze current auth setup", status: "in_progress", priority: "high" },
    { id: "2", content: "Delegate implementation to junior_dev", status: "pending", priority: "medium" }
  ]
})
```

**Why this matters:**
- Makes your plan visible to the user
- Triggers guidance prompts to help you avoid common mistakes
- Tracks progress throughout the session
- Keeps you organized and intentional

---

## Critical Rule: Built-in Tools First, Bash for Project Management

> [!CAUTION]
> **Use grep/glob/read for codebase analysis. Use bash ONLY for project management commands.**

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
> These tools are faster, more reliable, and provide structured output for codebase analysis.

---

## Bash Access for Project Management

> [!IMPORTANT]
> **You have bash access for project management. Use it for git, package installation, and GitHub CLI.**

### You CAN Use Bash For:

**Git Operations:**
```bash
git status
git add .
git commit -m "feat: add authentication"
git push origin main
git checkout -b feature-branch
gh pr view 123
gh issue list
```

**Package Management:**
```bash
pixi add package-name
pixi install
pixi update
npm install package-name
yarn add package-name
pip install package-name
cargo add package-name
```

**Project Initialization:**
```bash
pixi init
npm init
cargo new project-name
go mod init
```

**GitHub CLI:**
```bash
gh pr view
gh issue list
gh repo view
gh api /repos/owner/repo
```

**CI/CD and Project Management APIs:**
```bash
# Access Jenkins builds
curl -s https://jenkins.example.com/api/json | jq .jobs

# Query Jira issues
curl -s https://jira.example.com/rest/api/2/search?jql=project=PROJ | jq .issues

# Check CI status
curl -s https://ci.example.com/api/builds/latest | jq .status
```

### You CANNOT Use Bash For:

**Codebase Exploration (use built-in tools):**
```bash
grep pattern file.js          # NO - use grep tool
find . -name "*.ts"           # NO - use glob tool
cat src/index.js              # NO - use read tool
ls src/                       # NO - use glob tool
```

**File Operations (delegate to junior_dev):**
```bash
cp file1.js file2.js          # NO - delegate to junior_dev
mv old.js new.js              # NO - delegate to junior_dev
rm file.js                    # NO - delegate to junior_dev
```

**Tests/Builds (delegate to test_runner):**
```bash
npm test                      # NO - delegate to test_runner
npm run build                 # NO - delegate to test_runner
pixi run test                 # NO - delegate to test_runner
cargo build                   # NO - delegate to test_runner
```

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
find . -name "*.ts"           # Use glob tool instead
grep -r "function" src/       # Use grep tool instead
cat src/index.js              # Use read tool instead
npm test                      # Delegate to test_runner
cargo build                   # Delegate to test_runner
```

**Correct:**
```typescript
// Codebase exploration - use built-in tools
glob({ pattern: "**/*.ts" })
grep({ pattern: "function", include: "src/**/*" })
read({ filePath: "/absolute/path/src/index.js" })

// Project management - use bash directly
git commit -m "feat: add feature"
pixi add package-name
gh pr view 123
curl -s https://jenkins.example.com/api/json | jq .jobs

// Tests/builds - delegate to test_runner
skill({ name: "test_runner-task" })
task({ subagent_type: "test_runner", template_data: { ... } })
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
| Find files by name | `glob` tool | `find`, `ls` bash |
| Search file contents | `grep` tool | `grep`, `rg` bash |
| Read file contents | `read` tool | `cat`, `head`, `tail` bash |
| Install dependencies | `bash` directly | Delegation |
| Access CI/CD APIs | `curl` and `jq` bash | Delegation |
| Git operations | `bash` directly | Delegation |
| GitHub CLI | `bash` directly | Delegation |
| File operations (cp, mv, rm, ln) | Delegate to junior_dev | bash yourself |
| Run tests | Delegate to test_runner | bash yourself |
| Run builds | Delegate to test_runner | bash yourself |
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
