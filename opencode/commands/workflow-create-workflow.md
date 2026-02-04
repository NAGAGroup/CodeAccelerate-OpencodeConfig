---
description: Create a new workflow command for common, bounded scenarios
agent: tech_lead
---

Create a new workflow command for the following scenario:

Scenario: $ARGUMENTS

## Critical Requirements

**Todo List Management (REQUIRED for ALL workflows):**
- Create a comprehensive todo list at the very beginning of workflow execution
- Maintain it throughout: mark tasks complete, add new tasks, remove irrelevant ones
- Todo list shows progress and ensures nothing is forgotten
- This requirement MUST be included in every workflow you create

## Process

1. **Create and initialize todo list**
   - Add all major workflow steps
   - Mark first task (understanding workflow goal) as in_progress

2. **Understand the workflow goal**
   - Ask clarifying questions about the scenario
   - Identify the inputs, steps, and expected outputs
   - **CRITICAL CHECK:** Does this workflow read or modify `opencode.json`?
     * If YES: You MUST include config inheritance handling (see "Config Inheritance Pattern" section below)
     * If NO: Proceed normally
   - Update todo: mark complete, add any new tasks discovered

3. **Define delegation strategy (REQUIRED)**

   > [!IMPORTANT]
   > If the user hasn't already specified who does the work, ask them explicitly:
   > - "Who should perform the actual work in this workflow?"
   > - "Should you (tech_lead) do this work directly, or should it be delegated to a subagent?"
   > - "If delegating, which agent should handle it? (explore, junior_dev, test_runner, librarian)"
   
   - Do NOT assume or suggest - let the user decide based on their understanding
   - Document whatever delegation pattern the user chooses
   - Update todo: mark complete

4. **Check for existing workflows**
   - Search for workflows with the same name in project (.opencode) and global config
   - Warn user if duplicate exists and ask if they want to override
   - Update todo: mark complete

5. **Design the workflow structure**
   - Define the exact sequence of steps (with or without delegations based on step 3)
   - Specify what information flows between steps
   - Identify decision points and validation criteria
   - Ensure workflow is bounded (has clear start/end, no open-ended exploration)
   - **If workflow touches opencode.json:** Plan to include config inheritance handling:
     * Read global config first, then project-local
     * Explain inheritance in the workflow instructions
     * Check against merged permissions, not just project-local
   - Update todo: mark complete

6. **Draft the command file**
   - Choose appropriate workflow name (kebab-case)
   - Write clear description for YAML frontmatter
   
   > [!IMPORTANT]
   > - Specify agent in frontmatter (always "tech_lead" for workflow coordination)
   > - Use correct syntax: `$ARGUMENTS` NOT `{{ARGUMENTS}}`
   > - Include todo list requirement in "Process" section
   > - Document the delegation strategy clearly in the workflow:
   >   - If tech_lead does the work: "You will generate/create/write [X] yourself..."
   >   - If delegating: "Delegate to [agent] to [specific task]..."
   > - **If workflow reads/modifies opencode.json:**
   >   - Add "Understanding Config Inheritance" section (see template below)
   >   - Update process steps to read BOTH configs (global + project-local)
   >   - Explain that project-local extends/overrides global
   
   - Define instruction template with $ARGUMENTS placeholder (use $ARGUMENTS for all user input, or $1, $2, $3 for specific positional arguments)
   - Include 2-4 realistic examples showing how $ARGUMENTS gets replaced
   - Document the step-by-step process with clear delegation points
   - Specify the expected output/deliverable
   - Update todo: mark complete

7. **Present workflow design to user**
   - Show the complete workflow markdown
   - Explain the delegation sequence
   - Get user approval or iterate on feedback
   - Update todo: mark complete or add refinement tasks

8. **Determine save location and write file**
   - Ask user: "Save to project config ($PWD/.opencode) or global config ($XDG_CONFIG/opencode)?"
   - Write to commands/workflow-<name>.md in chosen location
   - Update todo: mark complete

9. **Report completion**
   - Show the final command name: `/workflow-<name>`
   - Provide usage example
   - **For global commands only:**
     * Inform user that build mode has permissions to read/write files outside project directory
     * Suggest: "To edit this global command in the future, switch to build mode"
   - Mark all todos complete

## Examples
- `/workflow-create-workflow add comprehensive test suite to existing module`
- `/workflow-create-workflow refactor large file into smaller modules`
- `/workflow-create-workflow add new API endpoint with tests and docs`
- `/workflow-create-workflow investigate and fix failing CI pipeline`

## What Makes a Good Workflow

**Good workflows are:**
- [OK] Bounded and specific (clear start, middle, end)
- [OK] Deterministic (same inputs -> predictable process)
- [OK] Multi-step (requires coordination between subagents)
- [OK] Repeatable (common scenario that happens multiple times)
- [OK] Structured (follows a clear sequence)
- [OK] Includes todo list management (create at start, maintain throughout)

**Bad workflows are:**
- [X] Open-ended exploration ("understand the codebase")
- [X] Single-step tasks ("read this file")
- [X] Too general ("make it better")
- [X] Require human decision at every step
- [X] One-off scenarios that won't repeat
- [X] Missing todo list requirements

## Config Inheritance Pattern

> [!IMPORTANT]
> If your workflow reads or modifies `opencode.json`, you MUST handle config inheritance.

**OpenCode config inheritance:**
- Global config: `~/.config/opencode/opencode.json` (baseline for all projects)
- Project-local config: `.opencode/opencode.json` (extends/overrides global)
- Project-local settings extend or override global settings

**Workflows that need this:**
- Workflows that read agent permissions
- Workflows that modify opencode.json
- Workflows that analyze agent configuration

**How to handle inheritance in workflows:**

Add this section to workflows that read opencode.json:

```markdown
## Understanding Config Inheritance

> [!IMPORTANT]
> OpenCode supports config inheritance: project-local `.opencode/opencode.json` extends global `~/.config/opencode/opencode.json`

**When reading configuration:**
1. First read global config: `~/.config/opencode/opencode.json`
2. Then read project-local config (if exists): `.opencode/opencode.json`
3. Project-local settings override/extend global settings
4. To understand current configuration, you need BOTH files
```

Update relevant process steps:

```markdown
4. **Read current configuration (BOTH configs)**
   - Read global config: `~/.config/opencode/opencode.json`
     * Extract relevant settings from global (baseline)
   - Read project-local config (if it exists): `.opencode/opencode.json`
     * Extract relevant settings from project (overrides)
   - Combine understanding: project-local extends/overrides global
   - Note structure and formatting
   - Update todo: mark complete
```

## Workflow Template Structure

Every workflow MUST include:
1. **YAML frontmatter**: description, agent (always "tech_lead" for workflows)
2. **Main instruction**: What tech_lead should do with $ARGUMENTS
3. **CRITICAL REQUIREMENTS section**: Todo list management requirement
4. **Delegation Strategy**: Clearly state who does what work (based on user's decision)
5. **Process section**: Numbered steps starting with "Create todo list"
6. **Examples section**: 2-4 realistic usage examples
7. **Output section**: What deliverable the user receives

**Delegation clarity examples:**

If user wants tech_lead to do the work:
```markdown
You are a tech lead creating [X]. You will generate the [Y] yourself.
Do NOT delegate - you will handle this directly.
```

If user wants delegation:
```markdown
You are a tech lead coordinating [X]. Delegate to [agent_name] to [specific task].
```

## Understanding Command Arguments

> [!TIP]
> When creating workflows, you need to properly use argument placeholders so user input gets passed to the command.

### Argument Placeholders

**$ARGUMENTS** - Captures ALL user input after the command name
- Syntax: `$ARGUMENTS` (dollar sign prefix, NOT `{{ARGUMENTS}}`)
- Use when you want the entire user input as one string
- Example: `/workflow-name Create a new feature` -> `$ARGUMENTS` = "Create a new feature"

**$1, $2, $3, etc.** - Positional parameters for individual arguments
- Use when you need to parse specific arguments separately
- Arguments are space-separated (use quotes for multi-word arguments)
- Example: `/command arg1 arg2 "arg three"` -> `$1`="arg1", `$2`="arg2", `$3`="arg three"

### Examples of Proper Usage

**Example 1: Using $ARGUMENTS (most common for workflows)**
```markdown
---
description: Generate a mermaid diagram
agent: tech_lead
---

You are coordinating the creation of a mermaid diagram. 
The user wants: "$ARGUMENTS"

Generate mermaid code based on this description...
```

**Example 2: Using positional parameters**
```markdown
---
description: Create file in directory with content
agent: tech_lead
---

Create a file named $1 in directory $2 with content: $3
```
Usage: `/create-file config.json src "{ \"key\": \"value\" }"`

**Example 3: Combining both**
```markdown
---
description: Run tests with options
agent: tech_lead
---

Run tests for module $1 with these options: $2 $3 $4
Full command context: $ARGUMENTS
```

### Common Mistakes to Avoid

[X] **Wrong:** `{{ARGUMENTS}}` (this is Jinja2 syntax, not used for commands)
[X] **Wrong:** `$ARG` or `$ARGS` (these don't exist)
[X] **Wrong:** `{$ARGUMENTS}` (no curly braces)

[OK] **Correct:** `$ARGUMENTS`
[OK] **Correct:** `$1, $2, $3` (for positional args)

### Documentation Reference

Full documentation: https://opencode.ai/docs/commands/

## Output

Creates `commands/workflow-<name>.md` in either:
- Project config: `$PWD/.opencode/commands/workflow-<name>.md`
- Global config: `$XDG_CONFIG/opencode/commands/workflow-<name>.md`

User can immediately run `/workflow-<name>` to execute the new workflow.
