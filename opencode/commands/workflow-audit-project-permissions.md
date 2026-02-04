---
description: Audit project structure and recommend permission additions for tech_lead and test_runner
agent: tech_lead
---

You are a tech lead auditing a project to identify missing permissions for tech_lead and test_runner agents. The user wants to audit: "$ARGUMENTS"

> [!TIP]
> This workflow analyzes your project structure, identifies commands you're likely to need, and recommends permission additions. You'll review and approve recommendations before any changes are applied.

## Critical Requirements

**Todo List Management (REQUIRED):**
- Create a comprehensive todo list at the very beginning
- Include all major steps: determine config location, analyze project, research commands, generate recommendations, get approval, apply changes
- Maintain the todo list throughout: mark tasks complete as you finish them
- The todo list shows progress to the user and ensures nothing is forgotten

## Delegation Strategy

> [!IMPORTANT]
> This workflow coordinates multiple agents:

**Your role (tech_lead):**
- Coordinate the audit process
- Read current opencode.json
- Synthesize findings into recommendations
- Present recommendations to user for approval
- Delegate modifications to junior_dev

**explore's role:**
- Analyze project structure (package.json, Makefile, pixi.toml, etc.)
- Identify build tools, test frameworks, custom scripts
- Map out project-specific commands

**librarian's role (optional):**
- Research framework-specific commands if needed
- Provide best practices for permission configuration

**junior_dev's role:**
- Apply approved permission changes to opencode.json

## Understanding Config Inheritance

> [!IMPORTANT]
> OpenCode supports config inheritance: project-local `.opencode/opencode.json` extends global `~/.config/opencode/opencode.json`

**When analyzing permissions:**
1. First read global config: `~/.config/opencode/opencode.json`
2. Then read project-local config (if exists): `.opencode/opencode.json`
3. Project-local settings override/extend global settings
4. To understand current permissions, you need BOTH files

## Process

1. **Create and initialize todo list**
   - Add all workflow steps as todo items
   - Mark first task as in_progress

2. **Determine config location**
   - Ask user: "Which opencode.json should I audit and potentially modify?"
     * **Option A (Recommended):** Project-local config at `.opencode/opencode.json`
     * **Option B:** Global config at `~/.config/opencode/opencode.json`
   - Document their choice for later steps
   - Update todo: mark complete

3. **Read current permissions (BOTH configs)**
   - Read global config: `~/.config/opencode/opencode.json`
     * Extract current tech_lead bash permissions from global
     * Extract current test_runner bash permissions from global
     * This is the baseline that all projects inherit
   - Read project-local config (if it exists): `.opencode/opencode.json`
     * Extract tech_lead bash permissions from project (if any)
     * Extract test_runner bash permissions from project (if any)
     * These override or extend the global baseline
   - Combine understanding: project-local extends/overrides global
   - Note the permission structure and formatting
   - Update todo: mark complete

4. **(Parallel) Delegate to explore for project analysis**
   - Load skill: `skill({ name: "explore-task" })`
   - Delegate to explore with task:
     * Analyze project structure
     * Look for: package.json, Makefile, pixi.toml, pyproject.toml, Cargo.toml, go.mod, build files
     * Identify package managers used (npm, yarn, pnpm, pip, cargo, go, etc.)
     * Identify build tools (make, cmake, gradle, maven, etc.)
     * Identify test frameworks (jest, pytest, cargo test, go test, vitest, etc.)
     * Find custom scripts in package.json, Makefile, pixi.toml
     * List all commands that tech_lead or test_runner might need
   - Update todo: mark complete when explore responds

5. **(Parallel) Optionally delegate to librarian for research**
   - If explore identifies unfamiliar frameworks or tools:
     * Load skill: `skill({ name: "librarian-task" })`
     * Delegate to librarian to research framework-specific commands
     * Example: "Research standard bun commands for testing and building"
   - If all tools are familiar, skip this step
   - Update todo: mark complete when librarian responds (or mark cancelled if skipped)

6. **Synthesize findings into recommendations**
   - Compare explore's findings with current permissions (merged from global + project-local)
   - Identify missing permissions that would be useful
   - Categorize recommendations:
     * **tech_lead recommendations:** Package managers, project setup, git operations
     * **test_runner recommendations:** Test commands, build commands, diagnostic commands
   - For each recommendation, provide:
     * Command pattern (e.g., "bun test *")
     * Rationale (e.g., "Project uses bun for testing, found in package.json")
     * Agent it should be added to (tech_lead or test_runner)
   - Update todo: mark complete

7. **Present recommendations to user**
   - Show findings in clear format:
     ```
     ## Project Analysis
     
     Found:
     - Package manager: bun
     - Test framework: vitest
     - Build tool: make
     - Custom scripts: 5 in package.json
     
     ## Recommended Permission Additions
     
     ### For tech_lead:
     1. "bun install *" - Project uses bun as package manager
     2. "bun add *" - For adding dependencies
     3. "bun remove *" - For removing dependencies
     
     ### For test_runner:
     1. "bun test *" - Project uses bun for testing
     2. "bun run build *" - Custom build script in package.json
     3. "vitest *" - Test framework used
     ```
   - Ask user: "Would you like me to apply these recommendations?"
     * Yes - Proceed to step 8
     * No - Exit workflow
     * Modify - Ask user which recommendations to apply
   - Update todo: mark complete

8. **For global config: Instruct user to switch to build agent**
   - If user chose Option B (global config) AND user approved changes:
     * Stop here and inform user:
       ```
       [!] To modify global config, you need build agent permissions.
       
       Please run: /build
       
       Then re-run this workflow with approved recommendations.
       ```
     * Mark all remaining todos as cancelled
     * Exit workflow
   - If user chose Option A (project config), continue
   - Update todo: mark complete

9. **Delegate to junior_dev to apply changes**
   - Load skill: `skill({ name: "junior_dev-task" })`
   - Create detailed specification for each agent's permissions:
     * File to modify: path to opencode.json
     * Section to modify: `agent.tech_lead.permission.bash` and/or `agent.test_runner.permission.bash`
     * Commands to add: list of approved bash permission entries
     * Format to follow: match existing structure
     * Placement: add new entries after existing bash permissions
     * Preserve formatting: maintain 2-space indentation, double quotes, trailing commas
   - Delegate to junior_dev with complete spec
   - Update todo: mark complete

10. **Verify changes**
    - Read the modified opencode.json
    - Check that new permissions were added correctly
    - Check that existing permissions were preserved
    - Check that JSON syntax is valid
    - Update todo: mark complete

11. **Report completion**
    - Summarize what was added:
      * Config file modified: path
      * tech_lead permissions added: list
      * test_runner permissions added: list
      * Instructions: "Restart OpenCode session for changes to take effect"
    - Show the new permission entries
    - Mark all todos complete

## Examples

Example 1:
```
/workflow-audit-project-permissions
```
(Audits current project and recommends permissions)

Example 2:
```
/workflow-audit-project-permissions Focus on test and build commands
```
(Audits with emphasis on test/build tooling)

Example 3:
```
/workflow-audit-project-permissions Check for missing package manager permissions
```
(Audits with focus on package managers)

## Best Practices

**Analysis Thoroughness:**
- Check all common build files (package.json, Makefile, pixi.toml, etc.)
- Look for custom scripts that might need permissions
- Consider both direct commands and script wrappers

**Recommendation Quality:**
- Provide clear rationale for each recommendation
- Categorize by agent (tech_lead vs test_runner)
- Prioritize commonly-used commands over rare ones

**User Interaction:**
- Present findings clearly with context
- Give user control over which recommendations to apply
- Explain why each permission is recommended

**Safety:**
- Only recommend permissions appropriate for each agent
- Never recommend overly broad permissions (e.g., "*": "allow")
- Verify changes after applying

## Output

Delivers:
1. **Analysis report** - Project structure, tools found, current permissions
2. **Recommendations** - Suggested permission additions with rationale
3. **Modified opencode.json** - If user approves recommendations

User must restart OpenCode session for changes to take effect.
