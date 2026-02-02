---
name: callout-boxes
description: Use GitHub-style callout boxes for emphasis in markdown documentation
---

## The Rule

**Always use GitHub-style callout boxes for emphasis instead of bold statements in markdown documentation.**

## Why Callout Boxes

GitHub-style callout boxes provide:
1. **Better visual hierarchy** - Stand out more than bold text
2. **Semantic meaning** - Different types convey different levels of importance
3. **Modern standard** - GitHub, GitLab, and many markdown renderers support them
4. **Consistency** - Uniform appearance across documentation

## Approved Callout Types

### [!NOTE]
General information and neutral notices.

**Use for:**
- Informational side notes
- Additional context
- Related information
- General observations

**Example:**
```markdown
> [!NOTE]
> For the complete agent capabilities, see the opencode/agent/ directory.
```

### [!TIP]
Helpful suggestions and best practices.

**Use for:**
- Recommendations
- Best practices
- Helpful hints
- Optimization suggestions
- References to source files

**Example:**
```markdown
> [!TIP]
> See opencode/opencode.json for the complete permission configuration.
```

### [!IMPORTANT]
Critical information users need to know.

**Use for:**
- Essential requirements
- Critical constraints
- Must-know information
- Key architectural decisions

**Example:**
```markdown
> [!IMPORTANT]
> You must ALWAYS load the skill before using the task tool.
```

### [!WARNING]
Warning about risks or potential issues.

**Use for:**
- Potential pitfalls
- Common mistakes to avoid
- Risk notifications
- Caution about complex operations

**Example:**
```markdown
> [!WARNING]
> This task requires extensive changes across the codebase.
> Consider switching to the build agent.
```

### [!CAUTION]
Warnings about dangerous or irreversible actions.

**Use for:**
- Destructive operations
- Data loss risks
- Irreversible changes
- Security concerns

**Example:**
```markdown
> [!CAUTION]
> You are a coordinator and planner, NOT an implementer.
> You cannot implement code directly.
```

## Format Rules

### Basic Syntax
```markdown
> [!TYPE]
> Content goes here
> Multi-line content needs the > prefix on each line
```

### Single Line
```markdown
> [!NOTE]
> This is a single-line callout.
```

### Multi-Line
```markdown
> [!IMPORTANT]
> This is a multi-line callout.
> Each line needs the > prefix.
> Keep the content flowing naturally.
```

### With Lists
```markdown
> [!TIP]
> Consider these options:
> - Option 1
> - Option 2
> - Option 3
```

## Prohibited Patterns (Don't Use)

### Bold Emphasis Statements
```markdown
**CRITICAL:** You must do this.
**IMPORTANT:** Remember this.
**NOTE:** Be aware of this.
**WARNING:** Watch out for this.
```

These should ALL be converted to callout boxes.

### Quoted Emphasis
```markdown
> "This is an important note you should read."
```

Convert to appropriate callout type based on content.

### Inline Bold for Major Points
```markdown
**This is a really important point that needs attention.**
```

If it's important enough for bold emphasis, it deserves a callout box.

## Conversion Guide

| Old Pattern | New Pattern |
|------------|-------------|
| `**CRITICAL:**` | `> [!CAUTION]` or `> [!IMPORTANT]` |
| `**IMPORTANT:**` | `> [!IMPORTANT]` |
| `**NOTE:**` | `> [!NOTE]` |
| `**TIP:**` | `> [!TIP]` |
| `**WARNING:**` | `> [!WARNING]` |
| `> **Remember:**` | `> [!IMPORTANT]` |
| `> **This is GOOD!**` | `> [!IMPORTANT]` |
| `> **This is normal!**` | `> [!NOTE]` |
| `> **Source:**` | `> [!TIP]` |
| `> **Key Insight:**` | `> [!TIP]` |

## When NOT to Use Callout Boxes

Don't overuse callout boxes. Use them sparingly for truly important information. NOT every paragraph needs a callout box.

**Don't use for:**
- Regular paragraphs
- Standard explanations
- Code examples (use code fences)
- List items
- Headers (use proper markdown headers)

**Use regular markdown for:**
- Body text
- Explanations
- Instructions
- Examples
- Most content

**Reserve callout boxes for:**
- Important notices users might miss
- Critical constraints or requirements
- Helpful tips that enhance understanding
- Warnings about common pitfalls
- References to authoritative sources

## Examples

### Wrong (Bold Emphasis)
```markdown
## Authentication

**CRITICAL:** You must implement JWT token validation before deploying to production.

The authentication system uses middleware to protect routes.

**IMPORTANT:** Remember to set the JWT_SECRET environment variable.
```

### Correct (Callout Boxes)
```markdown
## Authentication

> [!CAUTION]
> You must implement JWT token validation before deploying to production.

The authentication system uses middleware to protect routes.

> [!IMPORTANT]
> Remember to set the JWT_SECRET environment variable.
```

### Wrong (Over-use)
```markdown
> [!NOTE]
> This is the authentication section.

> [!TIP]
> Authentication verifies user identity.

> [!IMPORTANT]
> We use JWT tokens for authentication.
```

### Correct (Appropriate Use)
```markdown
## Authentication

This section covers authentication using JWT tokens.

> [!IMPORTANT]
> All API endpoints require authentication except /login and /register.

To implement authentication, configure the JWT middleware...
```

## Enforcement: Three Contexts

> [!IMPORTANT]
> The callout box policy applies to ALL markdown output: agent responses, markdown files, and reports. Use callout boxes instead of bold emphasis everywhere.

### Context 1: Agent Responses (ALL agents)

When responding to user or parent agent with markdown:

**Use callout boxes for:**
- Important notices or warnings in your response
- Critical information user shouldn't miss
- Highlighting key findings or recommendations

**Don't use:**
- `**IMPORTANT:**` - Use `> [!IMPORTANT]` instead
- `**NOTE:**` - Use `> [!NOTE]` instead
- `**WARNING:**` - Use `> [!WARNING]` instead
- `**TIP:**` - Use `> [!TIP]` instead

**Example response:**
```markdown
I found 3 authentication patterns in the codebase.

> [!WARNING]
> The JWT secret is currently hardcoded in config.js.
> This should be moved to environment variables.

Implementation options:
1. Use existing auth middleware pattern
2. Create new OAuth2 flow
3. Implement custom JWT solution

> [!TIP]
> Pattern 1 is already tested and follows the project's architecture.
```

---

### Context 2: Writing Markdown Files (junior_dev, tech_lead)

When using edit or write tools on .md files:

**Scan for prohibited patterns:**
- `**CRITICAL:**` → Convert to `> [!CAUTION]` or `> [!IMPORTANT]`
- `**IMPORTANT:**` → Convert to `> [!IMPORTANT]`
- `**NOTE:**` → Convert to `> [!NOTE]`
- `**WARNING:**` → Convert to `> [!WARNING]`
- `**TIP:**` → Convert to `> [!TIP]`

**Conversion priority:**
1. **High**: `**CRITICAL:**`, `**IMPORTANT:**` - Convert immediately
2. **Medium**: `**NOTE:**`, `**WARNING:**`, `**TIP:**` - Convert when editing nearby
3. **Low**: Other bold emphasis - Use judgment based on context

**Don't convert:**
- Regular bold for emphasis: `**bold text**` is fine
- Bold in tables or lists for structure
- Bold for UI element names: `**Save** button`

**Example conversion:**

Before:
```markdown
## Setup

**IMPORTANT:** Run npm install before starting.

The application requires Node.js 18+.

**NOTE:** You can use nvm to manage versions.
```

After:
```markdown
## Setup

> [!IMPORTANT]
> Run npm install before starting.

The application requires Node.js 18+.

> [!NOTE]
> You can use nvm to manage versions.
```

---

### Context 3: Reading Markdown Files (explore, librarian, test_runner)

When reading files during your analysis:

**Scan for convertible patterns** and report if significant.

**Report format:**
```markdown
[Convertible Callout Patterns] in docs/GUIDE.md:
- Line 45: **IMPORTANT:** → Recommend [!IMPORTANT]
- Line 67: **NOTE:** → Recommend [!NOTE]
- Line 89: **WARNING:** → Recommend [!WARNING]
Total: 3 conversion opportunities
```

**Reporting thresholds:**

Report convertible patterns when:
- You find 5+ instances in a single file, OR
- You find patterns in multiple documentation files, OR
- User/tech_lead explicitly asks about documentation quality, OR
- File is critical documentation (README, CONTRIBUTING, API docs)

Do NOT report:
- 1-2 isolated instances
- Regular bold emphasis (not the `**LABEL:**` pattern)
- Files you're not actively analyzing

**Priority in your reports:**
- Include callout findings at the end of your summary
- Don't make it the focus unless it's pervasive
- Frame as "Also found X convertible patterns" after main findings
