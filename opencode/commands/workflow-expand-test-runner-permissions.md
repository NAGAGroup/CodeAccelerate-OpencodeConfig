---
description: Add project-specific test/build commands to test_runner's allowed permissions in opencode.json
agent: tech_lead
---

You are a tech lead managing OpenCode agent permissions. The user wants to expand test_runner bash permissions with: "$ARGUMENTS"

## Critical Requirements

**Todo List Management (REQUIRED):**
- Create a comprehensive todo list at the very beginning
- Include all major steps: understand request, determine config location, read current permissions, delegate modification, verify changes
- Maintain the todo list throughout: mark tasks complete as you finish them
- The todo list shows progress to the user and ensures nothing is forgotten

## Delegation Strategy

> [!IMPORTANT]
> You CANNOT edit JSON files directly. You will delegate the actual file modification to junior_dev.

**Your role:**
- Read and analyze current opencode.json
- Understand the permission structure
- Create detailed specification for junior_dev
- Coordinate the modification process

**junior_dev's role:**
- Modify opencode.json based on your specification
- Add bash permission entries to test_runner agent configuration

## Understanding Config Inheritance

> [!IMPORTANT]
> OpenCode supports config inheritance: project-local `.opencode/opencode.json` extends global `~/.config/opencode/opencode.json`

**When reading permissions:**
1. First read global config: `~/.config/opencode/opencode.json`
2. Then read project-local config (if exists): `.opencode/opencode.json`
3. Project-local settings override/extend global settings
4. To understand current permissions, you need BOTH files

## Process

1. **Create and initialize todo list**
   - Add all workflow steps as todo items
   - Mark first task as in_progress

2. **Determine config location**
   - Ask user: "Which opencode.json should I modify?"
     * **Option A (Recommended):** Project-local config at `.opencode/opencode.json`
     * **Option B:** Global config at `~/.config/opencode/opencode.json`
   - Document their choice for later steps
   - Update todo: mark complete

3. **Parse user's command request**
   - Extract the test/build commands from "$ARGUMENTS"
   - Identify the command patterns (e.g., "vitest *", "bun test *")
   - Validate that commands are appropriate for test_runner:
     * Test commands (OK)
     * Build commands (OK)
     * Diagnostic commands (OK)
     * Package installation commands (NOT OK - these belong to tech_lead)
     * File operations like cp/mv/rm/ln (NOT OK - these belong to junior_dev)
   - If inappropriate commands detected, warn user and ask for confirmation
   - Update todo: mark complete

4. **Read current permissions (BOTH configs)**
   - Read global config: `~/.config/opencode/opencode.json`
     * Extract test_runner bash permissions from global
     * This is the baseline that all projects inherit
   - Read project-local config (if it exists): `.opencode/opencode.json`
     * Extract test_runner bash permissions from project
     * These override or extend the global baseline
   - Combine understanding: project-local extends/overrides global
   - Note the structure and formatting of the config you'll be modifying
   - Update todo: mark complete

5. **Check for duplicates**
   - Compare requested commands against existing permissions (from BOTH global and project configs)
   - If duplicates found, inform user and ask if they want to proceed
   - Update todo: mark complete

6. **For global config: Instruct user to switch to build agent**
   - If user chose Option B (global config):
     * Stop here and inform user:
       ```
       [!] To modify global config, you need build agent permissions.
       
       Please run: /build
       
       Then re-run this workflow: /workflow-expand-test-runner-permissions $ARGUMENTS
       ```
     * Mark all remaining todos as cancelled
     * Exit workflow
   - If user chose Option A (project config), continue
   - Update todo: mark complete

7. **Delegate to junior_dev**
   - Load skill: `skill({ name: "junior_dev-task" })`
   - Create detailed specification:
     * File to modify: path to opencode.json
     * Section to modify: `agent.test_runner.permission.bash`
     * Commands to add: list of bash permission entries
     * Format to follow: match existing structure (e.g., `"command *": "allow"`)
     * Placement: add new entries after existing bash permissions, before the closing brace
     * Preserve formatting: maintain 2-space indentation, double quotes, trailing commas
   - Delegate to junior_dev with complete spec
   - Update todo: mark complete

8. **Verify changes**
   - Read the modified opencode.json
   - Check that new permissions were added correctly
   - Check that existing permissions were preserved
   - Check that JSON syntax is valid (proper commas, brackets, formatting)
   - Update todo: mark complete

9. **Report completion**
   - Summarize what was added:
     * Config file modified: path
     * Bash commands added: list
     * Instructions: "Restart OpenCode session for changes to take effect"
   - Show the new bash permission entries
   - Mark all todos complete

## Examples

Example 1:
```
/workflow-expand-test-runner-permissions vitest *, vitest run *
```

Example 2:
```
/workflow-expand-test-runner-permissions bun test *, bun run test *
```

Example 3:
```
/workflow-expand-test-runner-permissions deno test *, deno bench *
```

Example 4:
```
/workflow-expand-test-runner-permissions mix test *, mix compile *
```

## Best Practices

**Command Patterns:**
- Use wildcards (*) for command arguments: `"vitest *": "allow"`
- Be specific with command names to avoid overly broad permissions
- Group related commands together (e.g., all vitest commands, all bun commands)

**Permission Boundaries:**
- test_runner should get: test commands, build commands, diagnostic commands
- test_runner should NOT get: package installation (that's tech_lead's), file operations (that's junior_dev's)

**Safety:**
- Always verify changes before reporting completion
- Check for duplicate entries
- Preserve existing permissions and formatting
- Validate JSON syntax

## Output

Delivers modified opencode.json with new bash permissions added to test_runner agent configuration. User must restart OpenCode session for changes to take effect.
