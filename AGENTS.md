# AGENTS.md - OpenCode Agent Configuration Guide

This file provides coding agents with essential information for working in this repository.

## Build, Lint, and Test Commands

### Installation
```bash
# Install dependencies
cd opencode && npm install
```

### Testing
This is a configuration repository with plugins (not a typical codebase with tests).
- No test suite is configured
- Verification is done through OpenCode agent testing

### Running Plugins
Plugins are TypeScript files that run within OpenCode's plugin system:
```bash
# No direct execution - plugins load automatically when OpenCode starts
# OpenCode looks in opencode/plugins/ directory
```

### Linting/Formatting
No linter or formatter is configured. Follow the style guidelines below.

## Code Style Guidelines

### General Principles

1. **Follow existing patterns** - Match the style of surrounding code
2. **Be explicit** - Prefer clarity over cleverness
3. **No emojis** - Use ASCII alternatives ([OK], [X], [!]) instead of checkmarks/emojis
4. **Arrows allowed** - Use arrows for flow (→, ←, ↑, ↓) and box-drawing (│, ├, └) for structure

### TypeScript/JavaScript Style

#### Imports
- Use ES6 import syntax
- Group imports: external packages first, then local modules
- Use destructuring for specific exports

```typescript
// External packages first
import { type Plugin, tool } from "@opencode-ai/plugin";
import * as fs from "fs/promises";
import * as path from "path";

// Local modules
import { helperFunction } from "./utils";
```

#### Types
- Use TypeScript `type` keyword for type aliases
- Use `interface` for object shapes when extending
- Prefer `any` only when necessary (plugin APIs often require it)
- Use explicit return types for public functions

```typescript
// Type aliases
type TaskSession = {
  sessionId: string;
  parts: Record<string, { id: string; tool: string }>;
};

// Plugin pattern
export const MyPlugin: Plugin = async ({ client, directory }) => {
  return {
    tool: {
      my_tool: tool({
        description: "Tool description",
        args: {
          param: tool.schema.string().describe("Parameter description"),
        },
        async execute(args, context) {
          // Implementation
        },
      }),
    },
  };
};
```

#### Formatting
- 2 spaces for indentation (not tabs)
- Semicolons required
- Trailing commas in multiline objects/arrays
- Double quotes for strings (not single quotes)
- Line length: Keep under 100 characters when reasonable

```typescript
// Good
const config = {
  agent: "tech_lead",
  model: "claude-sonnet-4.5",
};

// Bad
const config = {
    agent: 'tech_lead',
    model: 'claude-sonnet-4.5'
}
```

#### Functions
- Use async/await (not promises with .then())
- Prefer arrow functions for callbacks
- Use descriptive names (not abbreviations)

```typescript
// Good
async function loadConfiguration() {
  const data = await readFile(configPath, "utf-8");
  return JSON.parse(data);
}

// Bad
function loadCfg() {
  return readFile(configPath, "utf-8").then(data => JSON.parse(data));
}
```

#### Error Handling
- Use try-catch for async operations
- Provide helpful error messages
- Return structured error objects for tools

```typescript
try {
  const result = await operation();
  return JSON.stringify({ success: true, result }, null, 2);
} catch (error: any) {
  return JSON.stringify({ 
    success: false, 
    error: error.message || String(error) 
  }, null, 2);
}
```

### Naming Conventions

- **Files:** kebab-case (mermaid-render-svg.ts, skill-loader.ts)
- **Plugins:** PascalCase with "Plugin" suffix (MermaidRenderSvgPlugin)
- **Tools:** snake_case (mermaid_render_svg, query_required_skills)
- **Variables:** camelCase (sessionId, configPath)
- **Constants:** SCREAMING_SNAKE_CASE (DESCRIPTION_TEMPLATE)
- **Types:** PascalCase (TaskSession, Plugin)

### Markdown Style

#### Headers
- Use ## for main sections (never use emojis in headers)
- Use ### for subsections
- Use #### sparingly

#### Lists
- Use `-` for unordered lists (not `*` or bullets)
- Use numbered lists for sequential steps
- No decorative emojis - use [OK], [X], [!] for status

```markdown
## Good Example

- Step one
- Step two
  - Sub-item

[OK] Task completed
[X] This won't work
[!] Warning: Be careful
```

#### Code Blocks
- Always specify language for syntax highlighting
- Use backticks for inline code
- Use triple backticks for code blocks

#### Callout Boxes
Use GitHub-style callout boxes for emphasis:

```markdown
> [!NOTE]
> Informational notes

> [!TIP]
> Helpful tips

> [!IMPORTANT]
> Critical information

> [!WARNING]
> Warnings about potential issues

> [!CAUTION]
> Strong warnings about dangerous operations
```

### JSON Configuration Style

- 2 spaces for indentation
- No trailing commas (JSON spec compliance)
- Use descriptive keys
- Group related configuration together

Example from opencode.json:
```json
{
  "agent": {
    "tech_lead": {
      "mode": "primary",
      "model": "github-copilot/claude-sonnet-4.5",
      "permission": {
        "*": "deny",
        "read": { "*": "allow" }
      }
    }
  }
}
```

## Unicode Policy

### PROHIBITED (Never Use)
- Emojis: ✅, ❌, ✓, ⚠️, 📊, 🎯, and ALL pictographs
- Smart quotes: " " ' '
- Decorative bullets: •, ◦

### ALLOWED (Use Freely)
- All arrows: → ← ↑ ↓ ↔ ⇒ ⇐ (for flow diagrams)
- Box-drawing: │ ─ ┌ ┐ └ ┘ ├ (for directory trees)

### ASCII Alternatives
- Use `[OK]` instead of ✅
- Use `[X]` instead of ❌
- Use `[!]` instead of ⚠️
- Use straight quotes `"` instead of smart quotes

## File Organization

```
opencode/
├── opencode.json          # Agent configuration and permissions
├── agent/                 # Agent role definitions
│   ├── tech_lead.md
│   ├── explore.md
│   ├── librarian.md
│   ├── junior_dev.md
│   └── test_runner.md
├── skill/                 # Task delegation templates
│   ├── explore-task/
│   ├── librarian-task/
│   ├── junior_dev-task/
│   ├── test_runner-task/
│   └── tech-lead-*/       # Tech lead guidance skills
├── plugins/               # Custom plugin implementations
│   ├── delegate.ts        # Task delegation plugin
│   ├── skill-loader.ts    # Auto-load required skills
│   ├── mermaid-*.ts       # Diagram rendering plugins
│   └── query-*.ts         # Query utilities
└── commands/              # Custom workflow commands
    └── workflow-*.md
```

## Plugin Development Guidelines

### Plugin Structure
All plugins follow this pattern:

```typescript
import { type Plugin, tool } from "@opencode-ai/plugin";

export const MyPlugin: Plugin = async ({ client, directory, worktree }) => {
  // Plugin initialization
  
  return {
    // Optional: Event hooks
    event: async ({ event }) => {
      // Handle events
    },
    
    // Optional: Lifecycle hooks
    "tool.execute.after": async (input, output) => {
      // Post-execution logic
    },
    
    // Required: Tool definitions
    tool: {
      my_tool: tool({
        description: "Clear, comprehensive tool description",
        args: {
          param: tool.schema.string().describe("Parameter description"),
        },
        async execute(args, context) {
          // Tool implementation
          return "Result string or JSON";
        },
      }),
    },
  };
};
```

### Key Patterns

1. **Lazy loading** - Import heavy dependencies only when needed
2. **Error handling** - Always wrap in try-catch and return structured errors
3. **Validation** - Validate arguments before processing
4. **Context awareness** - Use directory/worktree from plugin context
5. **Tool descriptions** - Write comprehensive descriptions for AI consumption

## Common Pitfalls to Avoid

1. **Don't use emojis** - Use ASCII alternatives ([OK], [X], [!])
2. **Don't abbreviate** - Use full descriptive names
3. **Don't use single quotes** - Use double quotes for strings
4. **Don't skip error handling** - Always handle async errors
5. **Don't mix tabs and spaces** - Use 2 spaces consistently
6. **Don't use .then()** - Use async/await instead
7. **Don't hardcode paths** - Use path.join() and context paths

## Agent-Specific Notes

### For tech_lead Agent
- Can only edit/write markdown files (*.md)
- Has bash access for project management (git, gh cli, pixi, npm/yarn/pip install, curl/jq for CI/CD APIs)
- Must use built-in tools (grep/glob/read) for codebase exploration (not bash)
- Must delegate code changes to junior_dev
- Must delegate tests/builds to test_runner
- Use skill templates before calling task tool

### For junior_dev Agent
- Follow specs exactly - no improvisation
- Report unclear specs instead of guessing
- Can edit any file type (not restricted to .md)
- Has bash access for file operations only (cp, mv, rm, ln)

### For test_runner Agent
- Has selective bash permissions for test/build/diagnostic commands
- Can write to /tmp for capturing large output
- Cannot install packages, modify files, or change git state
- Focus on verification and diagnostics
- Report results clearly with status indicators

## Documentation Standards

When creating or updating documentation:

1. Use clear, concise language
2. Include code examples for complex concepts
3. Use callout boxes for important notes
4. Keep line length reasonable (80-100 chars)
5. Link to source files as reference
6. Use ASCII alternatives for indicators

## Version Control

- This is a configuration repository (not versioned packages)
- Follow conventional commit format when possible
- Keep commits focused on single changes
- Reference issues/PRs when applicable

---

> [!NOTE]
> This file is for AI agents operating in this repository. For human documentation, see docs/ directory.

> [!TIP]
> When in doubt about style, look at existing files in opencode/plugins/ or opencode/agent/ as reference.
