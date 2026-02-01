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

## Agent-Specific Guidance

### For Agents That Can Edit Files (junior_dev, tech_lead on .md)

When writing or editing markdown documentation:
1. **Scan for bold emphasis** - Look for `**CRITICAL:**`, `**IMPORTANT:**`, etc.
2. **Convert to callouts** - Choose appropriate type based on severity
3. **Use sparingly** - Reserve for truly important information
4. **Follow format** - Always use `> ` prefix on all lines
5. **Choose wisely** - Pick the callout type that matches the intent

**Priority for conversion:**
1. High: `**CRITICAL:**`, `**IMPORTANT:**` in documentation
2. Medium: `**NOTE:**`, `**WARNING:**`, `**TIP:**` patterns
3. Low: Other bold emphasis that might benefit from callouts

### For Read-Only Agents (explore, librarian, test_runner)

When you encounter convertible patterns during your analysis:

**Report back to tech_lead with:**
1. **File path and line numbers** - Exact locations of patterns
2. **Pattern found** - Show the old pattern (e.g., `**IMPORTANT:**`)
3. **Recommended callout type** - Suggest appropriate `[!TYPE]`
4. **Count of occurrences** - How many instances in the file

**Example report format:**
```markdown
Found convertible patterns in docs/EXAMPLE.md:
- Line 45: **IMPORTANT:** → Recommend [!IMPORTANT]
- Line 67: **NOTE:** → Recommend [!NOTE]
- Line 89: > **Remember:** → Recommend [!IMPORTANT]
Total: 3 conversion opportunities
```

**Only report if:**
- You find 3+ instances in a file, OR
- You find patterns in multiple related files, OR
- User explicitly asks about documentation quality

Do NOT report every single bold statement - focus on the prohibited patterns listed in the Conversion Guide.
