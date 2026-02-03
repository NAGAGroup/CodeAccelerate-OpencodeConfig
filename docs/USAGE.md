# Usage Guide

## Working with tech_lead

All workflow requests go through **tech_lead** (the coordinator agent). Tech_lead analyzes your request, asks clarifying questions if needed, and automatically delegates work to appropriate agents.

### What to Request

You can ask tech_lead for:
- **Feature additions** - "Add dark mode toggle to settings"
- **Bug fixes** - "Fix authentication timeout issue"
- **Refactoring** - "Split auth.ts into smaller modules"
- **Code analysis** - "Show me all error handling patterns"
- **Research** - "What's the latest React performance optimization?"

Tech_lead will delegate to specialized agents and coordinate their work.

---

## Available Workflows

### /workflow-generate-mermaid-diagram

**Generate ASCII or SVG diagrams from descriptions.**

Example usage:
```
/workflow-generate-mermaid-diagram Create a flowchart showing the authentication flow
```

**Process:**
1. Asks clarifying questions (purpose, audience, detail level)
2. Gathers context from your codebase
3. Confirms output format (ASCII, SVG, or both)
4. Generates and validates mermaid code
5. Shows preview and saves to disk/markdown

[Full workflow details](../opencode/commands/workflow-generate-mermaid-diagram.md)

---

### /workflow-create-workflow

**Create new workflow commands for bounded, repeatable scenarios.**

Example usage:
```
/workflow-create-workflow add comprehensive test suite to a module
```

**Process:**
1. Clarifies workflow goal and expected outputs
2. Determines delegation strategy (who does the work)
3. Checks for existing workflows with same name
4. Designs multi-step sequence with clear decision points
5. Saves command file to .opencode or global config

> [!IMPORTANT]
> Good workflows are bounded and repeatable. Bad workflows are open-ended or one-off.
> 
> [OK] Bounded, multi-step, deterministic, repeatable
> [X] Open-ended exploration, single-step, too general, one-off

[Full workflow details](../opencode/commands/workflow-create-workflow.md)

---

### /workflow-create-agent-skill

**Create reusable skill files for agent knowledge and constraints.**

Example usage:
```
/workflow-create-agent-skill Create a new execution protocol for test_runner
```

**Process:**
1. Gathers skill name, description, content, and target agents
2. Determines save location (global or project-level)
3. Checks for existing skills to avoid conflicts
4. Delegates skill file creation and registration
5. Verifies creation and reports completion

[Full workflow details](../opencode/commands/workflow-create-agent-skill.md)

---

## Common Usage Patterns

### Feature Implementation

→ User describes needed feature
→ tech_lead analyzes requirements and asks questions
→ delegates to junior_dev for implementation
→ delegates to test_runner for verification
→ reports completion with test results

### Bug Investigation

→ User reports bug or unexpected behavior
→ tech_lead reads relevant code sections
→ delegates to test_runner to reproduce issue
→ tech_lead analyzes root cause
→ delegates to junior_dev for fix
→ test_runner verifies fix and runs tests

### Codebase Understanding

→ User asks about code structure or patterns
→ tech_lead delegates to explore agent to read/search
→ explore synthesizes findings
→ tech_lead summarizes for user
→ tech_lead offers diagram if visual aid would help

### Research + Implementation

→ User requests feature requiring research
→ librarian researches external APIs/libraries
→ tech_lead presents options with pros/cons
→ user selects approach
→ junior_dev implements selected solution
→ test_runner verifies implementation

---

## What to Avoid

### Don't Violate Agent Constraints

Each agent has capabilities and limits. Don't request violations:

| Agent | Capabilities | Constraint |
|-------|-------------|-----------|
| explore | Read/search code | [X] Cannot modify files |
| librarian | Research external sources | [X] Cannot write code |
| junior_dev | Write/edit code | [X] Cannot run tests |
| test_runner | Run tests/builds | [X] Cannot edit code |
| general_runner | Git commands, npm install | [X] Cannot modify logic |

Example violations:

[X] "explore, read this file and fix the bug"
→ Explore can't modify code

[OK] "explore, read this file and report what you find"
→ Explore analyzes and reports

---

### Don't Be Vague

[X] "Make it better"
[X] "Add error handling"
[X] "Improve performance"

[OK] "Add try/catch blocks to API routes and log to console"
[OK] "Cache API responses in Redis with 5-minute expiry"
[OK] "Add pagination to user search results (50 per page)"

---

### Don't Assume Agents Know Custom Tooling

Your team may use internal tools agents don't know about.

[X] "Run the build script"
→ Might fail - agent doesn't know which script

[OK] "Run `npm run build:prod` in the project root"
→ Clear command, agent knows exactly what to do

[OK] "There's a custom internal tool at /tools/deploy.sh. First, read it to understand the parameters, then run it with staging environment"
→ Provides context agent needs

---

### Don't Create Workflows for One-Off Tasks

Workflows are for repeatable scenarios. One-off requests should go to tech_lead directly.

[X] Workflow: "Deploy to production" (likely one-time per release)
[X] Workflow: "Investigate this specific error" (unique incident)

[OK] Workflow: "Add comprehensive test suite to module" (recurring for new modules)
[OK] Workflow: "Refactor large file into components" (common scenario)

---

## What to DO

### Direct Complex Delegations

Tell tech_lead exactly who should do what:

```
Please coordinate this:
1. Have explore read src/auth.ts and src/auth-helpers.ts
2. Have junior_dev update all imports in src/routes/ to point to new locations
3. Have test_runner verify no test failures
4. Report completion
```

### Provide Specific Commands with Context

Include exact commands or file paths:

```
Fix the authentication middleware:
- File: src/middleware/auth.js
- Issue: JWT_SECRET is hardcoded, should use environment variable
- Solution: Replace hardcoded string with process.env.JWT_SECRET
- Test with: npm test -- src/middleware/auth.test.js
```

### Give Implementation Hints When You Have Knowledge

Share what you know to guide implementation:

```
Add dark mode support:
- Use React Context for theme state (pattern exists in ThemeProvider.tsx)
- CSS-in-JS with styled-components (already in project)
- Add toggle to Settings component
- Test in both light and dark modes
```

### Use Agents for Verification After Manual Changes

After you manually edit code, have agents verify:

```
I've updated src/config.json with new settings.
Please have test_runner verify no config-related tests broke.
Then have explore check if there are other references to the old settings.
```

---

## When to Use Build Agent

The **build agent** is available as a fallback when tech_lead delegation isn't the right fit.

### What is Build Agent?

Build agent has comprehensive permissions to implement tasks end-to-end without delegation. It can read, write, run tests, execute commands - everything needed to complete a task in one agent.

### When to Switch to Build Agent

Consider build agent when:

- **Rapid prototyping** - Delegation overhead slows you down for quick experiments
- **Tight integration needed** - Task requires simultaneous changes across many files
- **Delegation has failed** - Multiple attempts with tech_lead coordination haven't worked
- **You want single-agent flow** - Prefer one agent handling everything for this specific task

### When to Use tech_lead (Default)

Stick with tech_lead delegation for:

- **Most standard tasks** - Feature additions, bug fixes, refactoring
- **Quality matters** - Benefit from separation between implementation and verification
- **Learning from process** - Delegation makes decision-making visible
- **Team coordination** - Multiple people working on related tasks

> [!TIP]
> Start with tech_lead delegation. Switch to build agent only when you have a specific reason. The delegation model provides better quality assurance for most tasks.

---

## Customizing Model Configuration

This configuration defaults to **GitHub Copilot** models. If you don't have Copilot access or want to use different providers (Anthropic, OpenAI, etc.), you can override the model configuration.

### Quick Override with Environment Variable

The fastest way to change models temporarily:

```bash
# Use Anthropic Claude Sonnet
OPENCODE_CONFIG_CONTENT='{"model": "anthropic/claude-sonnet-4-5"}' opencode

# Override both main and small models
OPENCODE_CONFIG_CONTENT='{
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5"
}' opencode

# Use OpenAI GPT-4
OPENCODE_CONFIG_CONTENT='{"model": "openai/gpt-4"}' opencode
```

> [!NOTE]
> `OPENCODE_CONFIG_CONTENT` has the highest precedence and overrides all other config sources. Perfect for testing different models or temporary changes.

### Project-Level Configuration

For persistent team settings, create a project config file:

**Option 1: `.opencode/opencode.json` (recommended for version control)**

```json
{
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

**Option 2: `opencode.json` in project root**

Same structure as above, but at project root instead of `.opencode/` directory.

> [!TIP]
> Use `{env:VAR_NAME}` substitution for API keys. Never commit API keys directly to version control.

### Configuration Precedence

OpenCode merges config from multiple sources. Higher priority overrides lower:

1. **OPENCODE_CONFIG_CONTENT** (highest) - Environment variable with inline JSON
2. **.opencode directories** - Project `.opencode/opencode.json`
3. **Project opencode.json** - Root `opencode.json`
4. **OPENCODE_CONFIG** - Environment variable pointing to config file path
5. **Global config** - `~/.config/opencode/opencode.json`
6. **Remote config** (lowest) - `.well-known/opencode` endpoints

### When to Use Each Approach

| Approach | Best For | Example Use Case |
|----------|----------|------------------|
| `OPENCODE_CONFIG_CONTENT` | Temporary overrides, testing, CI/CD | Try different models without changing files |
| Project config | Team settings, version-controlled | Standardize models across team members |
| Global config | Personal defaults | Your preferred model for all projects |

### Common Provider Examples

**Anthropic (recommended alternative to Copilot):**
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
OPENCODE_CONFIG_CONTENT='{
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5"
}' opencode
```

**OpenAI:**
```bash
export OPENAI_API_KEY="sk-..."
OPENCODE_CONFIG_CONTENT='{
  "model": "openai/gpt-4",
  "small_model": "openai/gpt-4o-mini"
}' opencode
```

**Custom provider with full config:**
```bash
OPENCODE_CONFIG_CONTENT='{
  "model": "custom/model-name",
  "provider": {
    "custom": {
      "baseURL": "https://api.example.com",
      "options": {
        "apiKey": "{env:CUSTOM_API_KEY}"
      }
    }
  }
}' opencode
```

> [!IMPORTANT]
> Always export your API key as an environment variable first, then reference it with `{env:VAR_NAME}` in config. This keeps credentials secure.

---

## Quick Reference

| Task | Request Pattern |
|------|-----------------|
| Add feature | `Add [feature]. Requirements: [specific details]` |
| Fix bug | `Fix [bug description]. Located in [file path]` |
| Refactor code | `/workflow-create-workflow refactor [file/component] into [target structure]` |
| Understand code | `Explain [component/pattern]. Context: [relevant files]` |
| Research topic | `Research [topic/library]. We need [specific info]` |
| Create diagram | `/workflow-generate-mermaid-diagram [description]` |
| New workflow | `/workflow-create-workflow [scenario description]` |
| New skill | `/workflow-create-agent-skill [skill description]` |
