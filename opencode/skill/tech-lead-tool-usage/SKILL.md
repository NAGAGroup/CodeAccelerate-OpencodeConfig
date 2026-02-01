---
name: tech-lead-tool-usage
description: Guidelines for using tools correctly and avoiding common mistakes
---

## Tool Usage Guidelines

### Direct Usage (You Handle These)

#### Read-Only Analysis

- **read** - Examine files to understand code, configs, documentation
- **glob** - Find files matching patterns (e.g., "**/*.ts", "src/**/*.js")
- **grep** - Search for specific patterns across codebase

#### Coordination

- **question** - Ask structured questions with options (NOT free-text)
- **task** - Delegate work to specialized agents (load skill first!)
- **skill** - Load delegation templates and specialized knowledge

#### Documentation (Markdown Only)

- **edit** - Modify existing markdown files ONLY (*.md)
- **write** - Create new markdown files ONLY (*.md)

> [!CAUTION]
> You can ONLY edit or write markdown (*.md) files. All other file modifications must be delegated to junior_dev.

**You can write:**
- Plans in .opencode/plans/*.md or docs/plans/*.md
- Architecture docs in .opencode/architecture/*.md or docs/architecture/*.md
- README files, documentation, guides (*.md)

**You CANNOT write:**
- Code files (.js, .ts, .py, .rs, .cpp, etc.)
- Configuration files (.json, .yaml, .toml, etc.)
- Test files
- ANY non-markdown files

#### Setup Commands (Requires Approval)

- **bash** - For project setup, dependency installation, git operations

> [!TIP]
> See tech-lead-cli-commands skill for detailed guidance on which commands to run vs delegate.

**Commands YOU run directly (with approval):**
- npm install, pip install, pixi add - Dependency management
- git commit, git push, git checkout - Version control
- npm init, pixi init - Project setup
- protoc, code generation tools

**Commands to DELEGATE to test_runner:**
- npm run build, cargo build, pixi run build - Build commands
- npm test, pytest, cargo test - Test commands
- Any verification or diagnostic commands

> [!WARNING]
> DO NOT use bash for builds or tests. Delegate to test_runner instead.

#### Utilities

- **todowrite/todoread** - Track multi-step tasks
- **mermaid_*** - Create diagrams for documentation
- **lsp** - IDE language services for code intelligence

## Tool Invocation Discipline

> [!CAUTION]
> Always verify tool parameters before invoking any tool.

### Pre-Invocation Checklist

Before calling any tool, verify:

1. All required parameters are provided (not undefined, not null)
2. Parameters match expected types (string, array, object, etc.)
3. File paths are absolute (when required)
4. Template data is complete (when delegating)

### Common Mistakes to Avoid

#### Wrong - Missing Parameters

```typescript
write(); // No content, no filePath - WILL FAIL
edit(); // No filePath, oldString, newString - WILL FAIL
task(); // No description, subagent_type, template_data - WILL FAIL
```

#### Correct - All Parameters Provided

```typescript
write({
  filePath: "/absolute/path/to/file.md",
  content: "Complete file content here...",
});

edit({
  filePath: "/absolute/path/to/file.md",
  oldString: "exact text to replace",
  newString: "replacement text",
});

task({
  description: "Short task description",
  subagent_type: "junior_dev",
  template_data: {
    /* complete data */
  },
});
```

### Why This Matters

- Tool invocation failures waste tokens and time
- Invalid parameters cause immediate rejection
- Missing data in multi-step workflows breaks continuity
- User experience degrades with tool errors

## Verification Strategy

### When Writing Markdown Files

1. Mentally prepare the full content structure first
2. Verify filePath is absolute and correct
3. Ensure content parameter is not empty
4. Double-check file path ends in .md

### When Delegating

1. Load skill first to see required template fields
2. Build complete template_data object
3. Verify all required fields are present
4. Only then call task tool

### When Editing

1. Read the file first to verify content
2. Copy exact oldString from file (with correct indentation)
3. Prepare newString with proper formatting
4. Verify all three parameters before invoking

## Pre-Edit Safety Check

Before calling edit or write on ANY file, verify the file extension:

**Is file extension .md?**
→ YES: Proceed with edit/write
→ NO: STOP - Delegate to junior_dev instead

> [!CAUTION]
> If you catch yourself about to edit a non-.md file, STOP immediately and delegate to junior_dev.
