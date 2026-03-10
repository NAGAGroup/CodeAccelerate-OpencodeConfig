# Usage Guide

## Example Screencast -- Modifying Nvim Config



https://github.com/user-attachments/assets/2ec06157-fe57-49e8-8d36-9283b92c356b



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

> [!TIP]
> For the complete workflow reference table, see [opencode/commands/](../opencode/commands/)

### Planning & Goal Setting Workflows

#### /workflow-create-session-goal

**Establish clear session goals through structured 5-step planning.**

This workflow enforces a rigorous planning process before you start work:

1. Memory search/list - Understand historical context
2. Initial explore - High-level codebase overview
3. Librarian research - External docs/APIs/best practices (or skip)
4. Specialized explore - Deep dives into specific areas (2+ parallel)
5. Questions - Clarify ambiguities (or skip)

Example usage:
```
/workflow-create-session-goal I want to add OAuth2 authentication to the API
```

**Why it matters:** Prevents jumping to implementation without understanding context, external best practices, or codebase structure.

---

#### /workflow-execute-session-goal

**Execute planned session goals with the same 5-step enforcement.**

Same 5 mandatory steps as create-session-goal but for execution phase.

Example usage:
```
/workflow-execute-session-goal Implement the OAuth2 flow we planned
```

> [!IMPORTANT]
> Both planning workflows use hard constraints - read/glob/grep/edit/write/bash are blocked until all 5 steps complete. Use skip_librarian() or skip_questions() tools if steps aren't relevant.

---

### Diagram & Visualization Workflows

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

### Development Workflows

#### /workflow-create-workflow

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
5. Saves command file to project or global config

> [!IMPORTANT]
> Good workflows are bounded and repeatable. Bad workflows are open-ended or one-off.
>
> [OK] Bounded, multi-step, deterministic, repeatable
> [X] Open-ended exploration, single-step, too general, one-off

[Full workflow details](../opencode/commands/workflow-create-workflow.md)

---

#### /workflow-create-agent-skill

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

### Configuration & Maintenance Workflows

#### /workflow-audit-project-permissions

**Review and report on permission configuration for all agents.**

Example usage:
```
/workflow-audit-project-permissions
```

**Process:**
1. Reads opencode.json configuration
2. Analyzes permission rules for each agent
3. Reports what each agent can/cannot do
4. Identifies potential security concerns or misconfigurations

Useful for understanding your current setup or before making permission changes.

---

#### /workflow-expand-tech-lead-permissions

**Safely add new permissions to tech_lead agent.**

Example usage:
```
/workflow-expand-tech-lead-permissions Allow tech_lead to run docker commands
```

**Process:**
1. Clarifies exactly what permissions to add
2. Shows current permission configuration
3. Proposes changes with security implications
4. Updates opencode.json if approved

> [!WARNING]
> Expanding permissions reduces separation of concerns. Only add permissions when delegation truly doesn't work for your use case.

---

#### /workflow-expand-test-runner-permissions

**Safely add new permissions to test_runner agent.**

Example usage:
```
/workflow-expand-test-runner-permissions Allow test_runner to run performance benchmarks
```

Same process as expand-tech-lead-permissions but for test_runner.

---

#### /workflow-import-cross-project-memories

**Import memories from other OpenCode projects.**

Example usage:
```
/workflow-import-cross-project-memories Import memories from ~/other-project
```

**Process:**
1. Connects to source project's memory database
2. Lists available memories with similarity scores
3. Allows selective import based on relevance
4. Stores imported memories with source attribution

Useful when starting new projects that can benefit from past learnings.

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
| tech_lead | Coordinate, read code, run project commands | [X] Cannot edit code directly |
| explore | Read/search code | [X] Cannot modify files |
| librarian | Research external sources | [X] Cannot write code |
| junior_dev | Write/edit code, file operations | [X] Cannot run tests or install packages |
| test_runner | Run tests/builds/diagnostics | [X] Cannot edit code or install packages |

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
| Establish session goal | `/workflow-create-session-goal [description]` |
| Execute session goal | `/workflow-execute-session-goal [description]` |
| Add feature | `Add [feature]. Requirements: [specific details]` |
| Fix bug | `Fix [bug description]. Located in [file path]` |
| Refactor code | `/workflow-create-workflow refactor [file/component] into [target structure]` |
| Understand code | `Explain [component/pattern]. Context: [relevant files]` |
| Research topic | `Research [topic/library]. We need [specific info]` |
| Create diagram | `/workflow-generate-mermaid-diagram [description]` |
| New workflow | `/workflow-create-workflow [scenario description]` |
| New skill | `/workflow-create-agent-skill [skill description]` |
| Audit permissions | `/workflow-audit-project-permissions` |
| Import memories | `/workflow-import-cross-project-memories [source path]` |

> [!NOTE]
> For detailed workflow specifications, see [opencode/commands/](../opencode/commands/)

> [!TIP]
> For complete workflow documentation, see [FEATURES.md](../FEATURES.md) section 6 (Workflows).
