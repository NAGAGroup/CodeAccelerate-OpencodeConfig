# New session - 2026-02-02T02:53:58.856Z

**Session ID:** ses_3e3ba8f37ffeR4e4kvq5HrkOAd
**Created:** 2/2/2026, 2:53:58 AM
**Updated:** 2/2/2026, 2:54:15 AM

---

## User

We recently made some massive changes to this project workspace repo. We left the opencode config in ./.opencode untouched for that work tho

Now, I want to do a complete review of the project-local opencode config, first just as an independent assessment of the config unrelated to any changes weve made in the workspace repo, then again for alignment with new workspace layout/workflow

---

## User

Please load your required skills before responding:

skill({name: "skill-invocation-policy"})
skill({name: "unicode-usage"})
skill({name: "callout-boxes"})
skill({name: "todo-usage"})
skill({name: "tech-lead-questions"})
skill({name: "tech-lead-tools"})
skill({name: "tech-lead-delegation"})

---

## Assistant (Tech_lead · claude-sonnet-4.5 · 5.2s)

I'll help you review the OpenCode configuration in `./.opencode`. Let me start by loading the required skills and then examining the current configuration.

```
Tool: skill

**Input:**
```json
{
  "name": "skill-invocation-policy"
}
```
**Output:**
```
## Skill: skill-invocation-policy

**Base directory**: /home/gta/.config/opencode/skill/skill-invocation-policy

## The Rule

If there's even a 1% chance a skill might apply to your task, invoke it using the `skill` tool.

**This is not negotiable.** Skills evolve and provide critical guidance.

## When to Load Skills

- **Before starting work** - Check for task-specific skills
- **When uncertain** - Load the skill to verify approach
- **When delegating** (tech_lead only) - Load delegation skill first

## How to Access Skills

Use: `skill({name: 'skill-name'})`

The skill content will be loaded - follow its instructions directly.

## Common Rationalizations (Don't Fall for These)

- [ISSUE] "This is simple, I don't need a skill"
- [ISSUE] "I need context first, I'll check skills later"
- [ISSUE] "I remember this skill from before"

Reality: Check skills FIRST, always.
```
```

```
Tool: skill

**Input:**
```json
{
  "name": "unicode-usage"
}
```
**Output:**
```
## Skill: unicode-usage

**Base directory**: /home/gta/.config/opencode/skill/unicode-usage

## The Rule

**Strictly prohibit emojis and decorative pictographs. Allow arrows and structural Unicode.**

## Prohibited Unicode (NEVER use these)

### Emojis and Pictographic Symbols (STRICTLY BANNED)
- Checkmarks/X marks: ❌, ✅, ✓, ✔, ✗, ✘
- Warning/alert: ⚠️, ⛔, 🚫
- Symbols: 📊, 🎯, 🎉, 💡, 🔧, 📝, etc.
- Faces: 😀, 😎, 🤔, etc.
- Objects: 🏠, 🚀, 📱, etc.
- **ANY pictographic emoji from Unicode blocks:**
  - Emoticons (U+1F600-U+1F64F)
  - Miscellaneous Symbols (U+2600-U+26FF) - includes ⚠️, ✓, ✔, ✗, ✘
  - Dingbats (U+2700-U+27BF) - includes ✓, ✔, ✗, ✘, ❌, ✅
  - Miscellaneous Symbols and Pictographs (U+1F300-U+1F5FF)
  - Transport and Map Symbols (U+1F680-U+1F6FF)

### Typographic Symbols
- Smart quotes: " " ' ' (use straight quotes: " ')
- Em/en dashes: — – (use -- or -)
- Ellipsis: … (use ...)
- Special bullets: •, ◦, ▪, ◘, ◙

### Mathematical Symbols
- ≠, ≤, ≥, ≈, ∞, ∑, ∏, etc.
- Use ASCII equivalents: !=, <=, >=, ~=, etc.

## Allowed Unicode (Functional Structural Set)

### All Arrow Types (Unicode U+2190-U+21FF)
Arrows are functional indicators, not decorative emojis. ALL arrow types are allowed:

**Basic Arrows:**
- Left: ← (U+2190)
- Up: ↑ (U+2191)
- Right: → (U+2192)
- Down: ↓ (U+2193)
- Left-right: ↔ (U+2194)
- Up-down: ↕ (U+2195)

**Diagonal Arrows:**
- ↖ ↗ ↘ ↙ (U+2196-U+2199)

**Double/Heavy Arrows:**
- ⇐ ⇑ ⇒ ⇓ ⇔ (U+21D0-U+21D4)

**Curved/Special Arrows:**
- ↩ ↪ ⤴ ⤵ (U+21A9, U+21AA, U+2934, U+2935)

**Use case:** Flow diagrams, process descriptions, directional indicators, mappings

**Example:**
```
User input → tech_lead → junior_dev
             ↓
        test_runner

Process flow: Start ⇒ Middle ⇒ End
Navigation: ← Back | Next →
```

### Box-Drawing Characters (U+2500-U+257F)
Render properly in terminals for structured visual content:

- Vertical: │
- Horizontal: ─
- Corners: ┌ ┐ └ ┘
- Junctions: ├ ┤ ┬ ┴ ┼
- Heavy/double variants: ═ ║ ╔ ╗ ╚ ╝ etc.

**Use case:** Directory structures, tables, ASCII art diagrams

**Example:**
```
project/
├── src/
│   ├── main.rs
│   └── lib.rs
└── tests/
    └── integration.rs
```

## Why This Matters

**Emojis are prohibited because:**
1. **LLM task adherence** - Models copy emojis into code or misinterpret context
2. **Inconsistent rendering** - Emojis look different across platforms
3. **Unprofessional** - Decorative symbols reduce technical clarity
4. **Parsing issues** - Emoji can break parsers and tools

**Arrows and box-drawing are allowed because:**
1. **Functional purpose** - Convey direction, structure, and flow
2. **Terminal support** - Modern terminals handle these well
3. **No ASCII equivalent** - Vertical arrows and box-drawing have no good ASCII alternative
4. **Structural clarity** - Improve readability of diagrams and trees

## Approved ASCII Alternatives (for prohibited Unicode)

| Prohibited Unicode | ASCII Alternative | Usage |
|---------|------------------|--------|
| ✅, ✓, ✔ | `[OK]`, `(yes)`, `+`, `PASS` | Positive indicator |
| ❌, ✗, ✘ | `[X]`, `(no)`, `-`, `FAIL` | Negative indicator |
| ⚠️ | `[!]`, `WARNING`, `!` | Warning indicator |
| 📊 | `[Chart]`, `[Data]` | Data/chart reference |
| 🎯 | `[Target]`, `[Goal]` | Goal/objective |
| • | `-`, `*` | List bullet |
| " " | `"` (straight quotes) | Quotation marks |
| — | `--` (double dash) | Em dash |
| – | `-` (single dash) | En dash |
| … | `...` | Ellipsis |

## Examples

### Wrong (Prohibited emojis):
```
- ✅ Task completed successfully
- ❌ This approach won't work
- 📊 Data shows improvement
- ⚠️ Warning: Be careful here
```

### Correct (ASCII alternatives):
```
- [OK] Task completed successfully
- [X] This approach won't work
- [Data] Data shows improvement
- [!] Warning: Be careful here
```

### Correct (Allowed arrows and structure):
```
User → tech_lead → junior_dev
             ↓
        test_runner

src/
├── agent/
│   ├── tech_lead.md
│   └── junior_dev.md
└── skill/
    └── unicode-usage/
```

## Enforcement: Three Contexts

> [!IMPORTANT]
> The unicode policy applies to ALL output: agent responses, file content, and reports. The same strict rules apply everywhere.

### Context 1: Agent Responses (ALL agents)

Before sending ANY response to user or parent agent:

1. **Scan your entire response** for prohibited Unicode (emojis, smart quotes, special bullets)
2. **Replace with ASCII alternatives**:
   - ✅, ✓, ✔ → `[OK]`, `PASS`, `+`
   - ❌, ✗, ✘ → `[X]`, `FAIL`, `-`
   - ⚠️ → `[!]`, `WARNING`
   - • → `-` or `*`
   - " " → `"` (straight quotes)
   - … → `...`
3. **Keep allowed Unicode** - Arrows (→ ↓ ←) and box-drawing (│ ├ └) are GOOD
4. **Never introduce new emojis** - Don't add decorative symbols

**Example response:**
```
[OK] Analysis complete. Found 3 authentication patterns.

Flow: User → API → Database
      ↓
   Response

Directory structure:
src/
├── auth/
│   ├── middleware.js
│   └── validator.js
└── routes/

[!] Warning: Found deprecated pattern in auth.js
```

---

### Context 2: Writing Files (junior_dev, tech_lead on .md)

When using edit or write tools:

1. **Read file first** to check for existing prohibited Unicode
2. **Apply all replacements** when modifying content
3. **Preserve allowed Unicode** (arrows, box-drawing) - these are GOOD
4. **Don't introduce new emojis** in your edits

**Specific file type rules:**

**Markdown (.md):**
- Headers: `## Section Name` (no emoji prefixes)
- Lists: Use `-` or `*` (not •)
- Flow diagrams: Use arrows freely (→, ↓, ↑, ←)
- Directory trees: Use box-drawing (│, ├, └, ─)
- Indicators: Use `[OK]`, `[X]`, `[!]` instead of ✅, ❌, ⚠️
- Emphasis: Use GitHub callout boxes (see callout-boxes skill)

**Code files (.js, .ts, .py, etc):**
- Replace emojis in comments: `// ✅ Done` → `// [OK] Done`
- Replace emojis in strings: `'✅ Success'` → `'[OK] Success'`
- Fix smart quotes: `"hello"` → `"hello"`
- Mathematical operators: Use `!=`, `<=`, `>=` (not ≠, ≤, ≥)

---

### Context 3: Reading Files (explore, librarian, test_runner)

You cannot edit files, but you MUST detect and report prohibited Unicode violations.

**When reading files during your analysis:**

1. **Scan for prohibited Unicode** - Emojis, smart quotes, special bullets
2. **Ignore allowed Unicode** - Don't report arrows (→ ↓) or box-drawing (│ ├)
3. **Report violations** if significant

**Report format:**
```
[Prohibited Unicode Found] in /path/to/file.md:
- Line 42: Found "✅" (U+2705 WHITE HEAVY CHECK MARK - emoji) → suggest "[OK]"
- Line 58: Found "⚠️" (U+26A0 WARNING SIGN - emoji) → suggest "[!]"
- Line 103: Found smart quotes " " → suggest straight quotes " "
Total: 3 violations
```

**Reporting thresholds:**

Report prohibited Unicode when:
- You find 3+ violations in a single file, OR
- You find violations in multiple related files, OR
- User/tech_lead explicitly asks about code quality, OR
- Violations appear in critical documentation (README, API docs, etc.)

Do NOT report:
- Allowed Unicode (arrows, box-drawing)
- Single isolated violations in large files
- Violations in third-party/vendor files you're not analyzing

**Priority in your reports:**
- Include Unicode findings in your summary alongside other findings
- Don't make Unicode the focus unless it's pervasive
- Frame as "Also found X unicode violations" at the end

## Special Cases

### Code Examples
When showing prohibited Unicode IN code as an example of what NOT to do:
```markdown
Wrong: `console.log('✅ Done')`  // Emoji in code
Correct: `console.log('[OK] Done')`  // ASCII alternative
```

### Markdown Files
- Headers: `## Section Name` (no emoji prefixes like 📊)
- Lists: Use `-` or `*` (not •)
- Flow diagrams: Arrows are ALLOWED and ENCOURAGED (→, ↓, ↑, ←)
- Directory trees: Box-drawing characters are ALLOWED (│, ├, └, ─)
- Emphasis: Use `**bold**` and `*italic*` (not Unicode emphasis)
- Indicators: Use `[OK]`, `[X]`, `[!]` instead of ✅, ❌, ⚠️

### Documentation Standards
- Use GitHub callout boxes for emphasis: `> [!NOTE]`, `> [!WARNING]`, etc.
- Don't use emojis for emphasis or decoration
- Use arrows freely for flow descriptions (→, ↑, ↓, ←, ↔)
- Use box-drawing for directory structures
- Replace checkmarks/X marks with [OK]/[X]

## Quick Reference

### PROHIBITED (Never use)
- Emojis: ✅, ❌, ✓, ⚠️, 📊, 🎯, 🎉, and ALL other pictographs
- Smart quotes: " " ' '
- Decorative bullets: •, ◦

### ALLOWED (Use freely)
- All arrows: → ← ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ⇒ ⇐ ↩ ↪ etc.
- Box-drawing: │ ─ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ etc.

### WHEN IN DOUBT
If it looks like an emoji or pictograph: **DON'T USE IT**
If it's an arrow or box-drawing character: **IT'S ALLOWED**
```
```

```
Tool: skill

**Input:**
```json
{
  "name": "callout-boxes"
}
```
**Output:**
```
## Skill: callout-boxes

**Base directory**: /home/gta/.config/opencode/skill/callout-boxes

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
```
```

```
Tool: skill

**Input:**
```json
{
  "name": "todo-usage"
}
```
**Output:**
```
## Skill: todo-usage

**Base directory**: /home/gta/.config/opencode/skill/todo-usage

## The Rule

**Use todolist to track progress on multi-step tasks. Keep todos updated in real-time.**

## When to Use Todolist

Use todolist when:
- Task has 3+ sequential steps
- Work spans multiple files or phases
- Progress tracking helps coordination
- User or parent agent needs visibility into progress

Do NOT use todolist when:
- Task is single-step and trivial
- No benefit to tracking granular progress
- Task completes in one action

---

## How to Use Todolist

### Creating Todos

At the start of multi-step work:

```typescript
todowrite({
  todos: [
    { id: "1", content: "Brief description of step", status: "in_progress", priority: "high" },
    { id: "2", content: "Next step", status: "pending", priority: "high" },
    { id: "3", content: "Final step", status: "pending", priority: "medium" }
  ]
});
```

### Updating Progress

After completing each step:

```typescript
todowrite({
  todos: [
    { id: "1", content: "Brief description of step", status: "completed", priority: "high" },
    { id: "2", content: "Next step", status: "in_progress", priority: "high" },
    { id: "3", content: "Final step", status: "pending", priority: "medium" }
  ]
});
```

### Todo States

- `pending` - Not yet started
- `in_progress` - Currently working on (limit to ONE at a time)
- `completed` - Finished successfully
- `cancelled` - No longer needed

### Priority Levels

- `high` - Critical path items
- `medium` - Important but not blocking
- `low` - Nice to have

---

## Best Practices

**Real-time updates:**
- Update status immediately after completing each step
- Don't batch multiple completions
- Keep ONE task in_progress at a time

**Clear descriptions:**
- Use specific, actionable language
- "Create auth middleware" (good)
- "Work on auth" (bad)

**Appropriate granularity:**
- Break work into meaningful chunks
- Not too fine-grained (every line edit)
- Not too coarse (entire feature as one todo)

---

## Role-Specific Examples

### For tech_lead

When coordinating work:
- Create high-level todos for your coordination tasks
- Use todolist when managing multi-agent workflows
- Track planning, delegating, and verifying phases

**Example:**
```typescript
todowrite({
  todos: [
    { id: "1", content: "Analyze authentication requirements", status: "completed", priority: "high" },
    { id: "2", content: "Delegate implementation to junior_dev", status: "in_progress", priority: "high" },
    { id: "3", content: "Verify with test_runner", status: "pending", priority: "high" },
    { id: "4", content: "Update documentation", status: "pending", priority: "medium" }
  ]
});
```

### For junior_dev

When executing multi-step specs:
- Create todos that mirror spec steps
- Update after completing each step
- Helps tech_lead track implementation progress

**Example:**
```typescript
todowrite({
  todos: [
    { id: "1", content: "Create auth middleware file", status: "completed", priority: "high" },
    { id: "2", content: "Implement JWT validation logic", status: "in_progress", priority: "high" },
    { id: "3", content: "Update routes to use middleware", status: "pending", priority: "high" },
    { id: "4", content: "Add error handling", status: "pending", priority: "medium" }
  ]
});
```

### For Other Agents

If you gain todo access in the future:
- Follow the same patterns
- Update in real-time
- Keep todos specific and actionable
```
```

```
Tool: skill

**Input:**
```json
{
  "name": "tech-lead-questions"
}
```
**Output:**
```
## Skill: tech-lead-questions

**Base directory**: /home/gta/.config/opencode/skill/tech-lead-questions

# Using the Question Tool

> [!IMPORTANT]
> You MUST use the question tool to ask questions to the user. NEVER ask questions in plain text.

## Why This Matters

Plain text questions like "Should I...?" or "Would you like...?" are:
- Not programmatically parsable
- Require free-form user responses
- Lead to ambiguous answers

The question tool provides structured options with clear choices.

---

## Basic Structure

```typescript
question({
  questions: [
    {
      header: "Short Label (max 30 chars)",
      question: "Complete question text?",
      options: [
        { label: "Option 1", description: "Explanation of what this means" },
        { label: "Option 2", description: "Alternative approach explained" },
      ],
    },
  ],
});
```

---

## Simple Example

```typescript
question({
  questions: [
    {
      header: "Dark Mode Persistence",
      question: "Should dark mode preference persist across sessions?",
      options: [
        { 
          label: "Yes, persist", 
          description: "Save to localStorage, survives browser restart" 
        },
        { 
          label: "No, session only", 
          description: "Reset to default on each visit" 
        },
      ],
    },
  ],
});
```

---

## Multiple Questions

```typescript
question({
  questions: [
    {
      header: "OAuth Provider",
      question: "Which OAuth provider should we use?",
      options: [
        { label: "Google", description: "Google OAuth 2.0" },
        { label: "GitHub", description: "GitHub OAuth" },
        { label: "Custom", description: "Custom OAuth provider" },
      ],
    },
    {
      header: "Token Storage",
      question: "Where should tokens be stored?",
      options: [
        { label: "localStorage", description: "Browser localStorage" },
        { label: "httpOnly cookie", description: "Secure cookie (recommended)" },
      ],
    },
  ],
});
```

---

## Multiple Selection

```typescript
question({
  questions: [
    {
      header: "Features to Include",
      question: "Which features should we implement?",
      multiple: true, // Allow selecting multiple options
      options: [
        { label: "Authentication", description: "User login/logout" },
        { label: "Authorization", description: "Role-based access control" },
        { label: "Password reset", description: "Forgot password flow" },
      ],
    },
  ],
});
```

---

## When to Use

Use the question tool when you have one or more questions AND:
- User request is ambiguous
- Multiple valid approaches exist
- You need to clarify requirements before proceeding
- Implementation choice significantly affects the solution
- User preference is needed

---

## When NOT to Use

Do NOT use the question tool when you have no questions OR:
- Answer is obvious from context
- Industry standard approach exists
- User already specified the approach
- Question is trivial or purely informational

---

## Guidelines

**Headers:** Keep under 30 characters

**Questions:** Write as complete sentences

**Options:** 
- Label: Short, clear (1-5 words)
- Description: Explain implications and tradeoffs

**Recommendations:** If you recommend an option, make it first and add "(Recommended)" to the label
```
```

```
Tool: skill

**Input:**
```json
{
  "name": "tech-lead-tools"
}
```
**Output:**
```
## Skill: tech-lead-tools

**Base directory**: /home/gta/.config/opencode/skill/tech-lead-tools

# Tool Usage Guide

## Critical Rule: Use Built-in Tools, Delegate Shell Commands

> [!CAUTION]
> **You have NO bash access. Use built-in tools for analysis and delegate shell commands to generic_runner.**

### Built-in Tools (Use These)

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
> These tools are faster, more reliable, and provide structured output. You MUST use them - you don't have bash access.

---

## When to Delegate to generic_runner

### For Shell Commands:

**Git Operations:**
```typescript
skill({ name: "generic_runner-task" })
task({
  subagent_type: "generic_runner",
  template_data: {
    task: "Commit changes with message",
    commands: "git add . && git commit -m 'Add authentication'",
    context: "Committing authentication implementation",
    expected_output: "Successful commit with clean git status",
    required_skills: ["skill-invocation-policy", "unicode-usage", "callout-boxes"]
  }
})
```

**Dependency Management:**
```typescript
skill({ name: "generic_runner-task" })
task({
  subagent_type: "generic_runner",
  template_data: {
    task: "Install project dependencies",
    commands: "npm install",
    context: "Setting up project after cloning repository",
    expected_output: "Dependencies installed successfully, node_modules created",
    required_skills: ["skill-invocation-policy", "unicode-usage", "callout-boxes"]
  }
})
```

**Project Setup:**
```typescript
skill({ name: "generic_runner-task" })
task({
  subagent_type: "generic_runner",
  template_data: {
    task: "Initialize new npm project",
    commands: "npm init -y",
    context: "Setting up package.json for new project",
    expected_output: "package.json created with default values",
    required_skills: ["skill-invocation-policy", "unicode-usage", "callout-boxes"]
  }
})
```

---

## When to Delegate to test_runner

### NEVER Run These Yourself (or via generic_runner):

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
> If you need to run tests or builds, STOP. Load skill -> Delegate to test_runner (NOT generic_runner).

---

## Anti-Patterns: What NOT to Do

**Wrong:**
```bash
# These will FAIL - you don't have bash access:
find . -name "*.ts"           # Use glob instead
grep -r "function" src/       # Use grep tool instead
cat src/index.js              # Use read instead
git commit -m "message"       # Delegate to generic_runner
npm install                   # Delegate to generic_runner
npm test                      # Delegate to test_runner
cargo build                   # Delegate to test_runner
```

**Correct:**
```typescript
// Built-in tools for analysis:
glob({ pattern: "**/*.ts" })
grep({ pattern: "function", include: "src/**/*" })
read({ filePath: "/absolute/path/src/index.js" })

// Delegate shell commands:
skill({ name: "generic_runner-task" })
task({
  subagent_type: "generic_runner",
  template_data: { ... }
})

// Delegate tests/builds:
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
| Find files by name | `glob` | `find`, `ls`, bash |
| Search file contents | `grep` tool | `grep`, `rg`, `ag` bash commands |
| Read file contents | `read` | `cat`, `head`, `tail` |
| Install dependencies | Delegate to generic_runner | bash (you don't have it) |
| Git operations | Delegate to generic_runner | bash (you don't have it) |
| Run tests | Delegate to test_runner | bash or generic_runner |
| Run builds | Delegate to test_runner | bash or generic_runner |
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
```
```

```
Tool: skill

**Input:**
```json
{
  "name": "tech-lead-delegation"
}
```
**Output:**
```
## Skill: tech-lead-delegation

**Base directory**: /home/gta/.config/opencode/skill/tech-lead-delegation

# Delegation Guide

## Your Specialized Agents

| Agent | Use For |
|-------|---------|
| **explore** | Deep codebase analysis, extensive file mapping |
| **librarian** | External research, API docs, library usage |
| **junior_dev** | ALL code implementation (no bash access) |
| **test_runner** | ALL builds, tests, verification (bash for testing only) |
| **generic_runner** | Shell commands: git, package management, setup |

> [!IMPORTANT]
> junior_dev has NO bash access. Always delegate verification to test_runner after implementation.

> [!NOTE]
> You also have NO bash access. Delegate shell commands to generic_runner.

---

## Delegation Protocol

> [!CAUTION]
> You MUST load the skill template before using the task tool.

### Every Delegation Follows This Pattern:

```typescript
// Step 1: Load the -task skill template
skill({ name: "junior_dev-task" })

// Step 2: Review template_data fields shown in skill
// Step 3: Delegate with complete data
task({
  description: "Brief task description",
  subagent_type: "junior_dev",
  template_data: {
    // Fill ALL required fields from template
    // The -task skill shows exactly what's needed
  }
})
```

> [!TIP]
> The `-task` skill shows all required template_data fields with descriptions. Load it first to see what you need to provide.

---

## Core Workflow Patterns

### Pattern 1: Simple Implementation

```
User request
    ↓
Analyze codebase (read/grep/glob)
    ↓
Ask clarifying questions if needed
    ↓
junior_dev implements
    ↓
test_runner verifies
    ↓
Success or iterate with NEW spec
```

**Example:** "Add dark mode toggle"
1. Read settings page components
2. Search for existing theme patterns
3. Ask: "Should preference persist?" (question tool)
4. Delegate to junior_dev with detailed spec
5. Delegate to test_runner to verify
6. Report results

---

### Pattern 1b: Simple Implementation with Setup

```
User request
    ↓
Analyze codebase (read/grep/glob)
    ↓
generic_runner installs dependencies
    ↓
junior_dev implements
    ↓
test_runner verifies
```

**Example:** "Add authentication using passport.js"
1. Read existing auth code
2. Delegate to generic_runner: `npm install passport`
3. Delegate to junior_dev with implementation spec
4. Delegate to test_runner to verify

---

### Pattern 2: Research-First Approach

```
User request
    ↓
librarian researches ← → explore analyzes
    ↓
Synthesize findings
    ↓
junior_dev implements
    ↓
test_runner verifies
```

**Example:** "Implement OAuth2"
1. Ask clarifying questions (which provider? token storage?)
2. Delegate to librarian (OAuth2 best practices)
3. Delegate to explore (existing auth code) - in parallel
4. Create architectural plan (write markdown)
5. Delegate to junior_dev in phases
6. Delegate to test_runner after each phase

---

### Pattern 3: Bug Fix

```
User report
    ↓
Read code + search patterns
    ↓
test_runner reproduces issue
    ↓
Analyze error output
    ↓
junior_dev fixes with detailed spec
    ↓
test_runner verifies fix
```

**Example:** "Login endpoint returns 500"
1. Read login endpoint code
2. Search for error handling patterns
3. Delegate to test_runner to run and capture errors
4. Analyze test_runner output to identify root cause
5. Delegate to junior_dev with specific fix
6. Delegate to test_runner to verify

---

### Pattern 4: Git Operations

```
User request
    ↓
Delegate to generic_runner for git commands
    ↓
Report results
```

**Example:** "Commit the changes"
1. Delegate to generic_runner: `git add . && git commit -m "message"`
2. Report commit success

**Example:** "What's the git status?"
1. Delegate to generic_runner: `git status`
2. Report status to user

---

## Iteration Pattern

> [!WARNING]
> When test_runner reports failures, NEVER say "try again" or reuse the same spec.

### Wrong Approach:
```
Tests failed. Try again.
```

### Correct Approach:
1. Analyze the failure output carefully
2. Identify the root cause
3. Write a NEW, MORE DETAILED spec
4. Delegate to junior_dev with improved spec
5. Delegate to test_runner again

> [!TIP]
> Each iteration should include MORE detail than the previous one, addressing specific failure points.

---

## Advanced Patterns

### Parallel Delegation

When tasks are independent:

```typescript
// Load both skills first
skill({ name: "librarian-task" })
skill({ name: "explore-task" })

// Delegate both in same message
task({ subagent_type: "librarian", template_data: {...} })
task({ subagent_type: "explore", template_data: {...} })

// Wait for both, then synthesize results
```

---

### Session Management

For multi-step tasks requiring shared context:

```typescript
// First delegation
task({
  session_id: "feature-oauth",
  subagent_type: "junior_dev",
  template_data: {...}
})

// Follow-up delegation (shares context)
task({
  session_id: "feature-oauth",  // Same ID = shared memory
  subagent_type: "junior_dev",
  template_data: {...}
})
```

> [!NOTE]
> Without session_id, each delegation is stateless. Use session_id when agents need to remember previous context.

---

### Phased Implementation

For large features, break into phases:

**Each phase:**
1. Delegate to junior_dev for implementation
2. Delegate to test_runner for verification
3. If pass → Next phase; if fail → Improve spec and retry

**Example phases:** Core functionality → Error handling → Edge cases

---

## When to Suggest Build Agent

The build agent is for exceptional circumstances only.

Suggest build agent when:
- Delegation has failed 3+ times
- Task requires tight integration across 15+ files
- Needs simultaneous changes to frontend, backend, database, infrastructure, tests, and docs
- User is frustrated with delegation overhead
- Task requires rapid iteration that delegation would slow down

> [!WARNING]
> Default approach: ALWAYS try delegation first. Build agent is the exception, not the rule.

---

## Common Delegation Mistakes

| Mistake | Correct Approach |
|---------|------------------|
| Delegating without loading skill | Load skill first, then delegate |
| Incomplete template_data | Fill ALL required fields shown in -task skill |
| Reusing failed specs | Write NEW spec with more detail |
| Sequential when parallel works | Delegate to multiple agents in same message |
| No session_id for multi-step | Use session_id for shared context |
```
```

---

## Assistant (Tech_lead · claude-sonnet-4.5 · 3.5s)

Now let me examine the OpenCode configuration files to conduct the review.

```
Tool: glob

**Input:**
```json
{
  "pattern": ".opencode/**/*"
}
```
**Error:**
```
Error: [Todolist Required]

You must create a todolist before beginning work.

Even for simple tasks, create a single-item todolist:
todowrite({ todos: [
  { id: "1", content: "Brief description of what you're doing", status: "in_progress", priority: "high" }
]})

For complex tasks, break it down:
todowrite({ todos: [
  { id: "1", content: "First step", status: "in_progress", priority: "high" },
  { id: "2", content: "Second step", status: "pending", priority: "high" },
  { id: "3", content: "Third step", status: "pending", priority: "medium" }
]})

Benefits:
- Makes your plan visible to the user
- Tracks progress through the session
- Keeps you organized
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "./.opencode/opencode.json"
}
```
**Error:**
```
Error: [Todolist Required]

You must create a todolist before beginning work.

Even for simple tasks, create a single-item todolist:
todowrite({ todos: [
  { id: "1", content: "Brief description of what you're doing", status: "in_progress", priority: "high" }
]})

For complex tasks, break it down:
todowrite({ todos: [
  { id: "1", content: "First step", status: "in_progress", priority: "high" },
  { id: "2", content: "Second step", status: "pending", priority: "high" },
  { id: "3", content: "Third step", status: "pending", priority: "medium" }
]})

Benefits:
- Makes your plan visible to the user
- Tracks progress through the session
- Keeps you organized
```
```

---

## Assistant (Tech_lead · claude-sonnet-4.5 · 26.8s)

I need to create a todo list first. This is a multi-phase review task that requires careful tracking.

```
Tool: todowrite

**Input:**
```json
{
  "todos": [
    {
      "id": "1",
      "content": "Discover and catalog all OpenCode config files in ./.opencode",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "id": "2",
      "content": "Review opencode.json configuration structure and settings",
      "status": "pending",
      "priority": "high"
    },
    {
      "id": "3",
      "content": "Review agent definitions and permissions",
      "status": "pending",
      "priority": "high"
    },
    {
      "id": "4",
      "content": "Review skills configuration and content",
      "status": "pending",
      "priority": "high"
    },
    {
      "id": "5",
      "content": "Perform independent assessment of config quality",
      "status": "pending",
      "priority": "high"
    },
    {
      "id": "6",
      "content": "Analyze workspace repo structure for alignment check",
      "status": "pending",
      "priority": "high"
    },
    {
      "id": "7",
      "content": "Assess alignment between config and workspace layout/workflow",
      "status": "pending",
      "priority": "high"
    },
    {
      "id": "8",
      "content": "Provide final recommendations and findings",
      "status": "pending",
      "priority": "medium"
    }
  ]
}
```
**Error:**
```
Tool execution aborted
```
```

---

## User


[Reflection Checkpoint]

Your todos don't mention delegating to subagents:
- "Discover and catalog all OpenCode config files in ./.opencode"
- "Review opencode.json configuration structure and settings"
- "Review agent definitions and permissions"

Question: Is all this work for you to do personally?

Consider: Could some of these be delegated in parallel?
- Analysis work -> explore agent
- Implementation -> junior_dev agent  
- Verification -> test_runner agent

Or are you still in the solo research phase? (That's fine too!)


---

