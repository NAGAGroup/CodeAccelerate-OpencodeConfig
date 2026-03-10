# OpenCode Configuration - Feature Set Baseline

**Purpose:** Maintained feature set baseline for future development and documentation

______________________________________________________________________

## Document Purpose

This document defines the **complete, intended feature set** of this OpenCode configuration. Use it as the source of truth when:

- Planning new features or changes
- Updating documentation after changes
- Onboarding new contributors
- Debugging unexpected behavior
- Verifying implementation completeness

> [!IMPORTANT]
> This document should be updated **immediately** when features are added, removed, or significantly modified. Keep it synchronized with implementation.

______________________________________________________________________

## Architecture Overview

This configuration implements a **guardrails-first multi-agent orchestration system** with the following design principles:

1. **Guardrails Enforce Behavior** - Hard constraints via plugins, not documentation
1. **Skills for Complex Patterns** - Only what can't be enforced through guardrails
1. **Agent Fumbling → Learning** - Let agents hit guardrails and learn from reflection prompts
1. **Separation of Concerns** - Each agent has precisely defined boundaries
1. **Externalized Guidance** - Reflection prompts in .md files, not hardcoded in plugins

______________________________________________________________________

### Feature Inventory

> [!NOTE]
> This table is the authoritative source for feature counts. All other documentation references this table.

| Component | Count | Location | Description |
|-----------|-------|----------|-------------|
| **Agents** | 5 | opencode/agent/ | tech_lead (coordinator), explore (discovery), junior_dev (implementation), librarian (research), test_runner (verification) |
| **Workflows** | 9 | opencode/commands/ | See [commands/README.md](opencode/commands/README.md) for complete list and specifications |
| **Skills** | 11 | opencode/skill/ | Infrastructure (3): skill-invocation-policy, unicode-usage, callout-boxes<br>Templates (4): explore-task, junior_dev-task, librarian-task, test_runner-task<br>Protocols (3): explore-execution-protocol, junior_dev-execution-protocol, librarian-research-protocol<br>Tech Lead (1): dcp-usage |
| **Guardrails** | 8 | opencode/plugins/agent-guardrails.ts | Enforced via guardrails plugin with reflection prompt injection |
| **Plugins** | 6 | opencode/plugins/ | delegate, agent-guardrails, skill-loader, todoplan, workflow-constraints, mermaid |
| **Reflection Prompts** | 12 | opencode/plugins/reflection-prompts/ | Externalized guidance loaded when guardrails trigger |

______________________________________________________________________

## Core Components

### 1. Agents (5 Total)

> [!IMPORTANT]
> This section is the authoritative agent capability reference. See [Feature Inventory](#feature-inventory) table above for quick counts.

| Agent | Mode | Model | Temperature | Role | Key Constraint |
|-------|------|-------|-------------|------|----------------|
| **tech_lead** | primary | claude-sonnet-4.5 | 0.7 | Coordinator & strategist | Markdown-only editing, must delegate code changes |
| **explore** | subagent | claude-haiku-4.5 | default | Fast codebase discovery | Read-only, no delegation |
| **junior_dev** | subagent | claude-haiku-4.5 | 0.15 | Precise code execution | Spec-only, no improvisation, one attempt |
| **librarian** | subagent | claude-sonnet-4.5 | 0.6 | External research | No local files, Context7-first enforcement |
| **test_runner** | subagent | claude-haiku-4.5 | 0.3 | Verification only | Read-only, no file modification |

#### Comprehensive Permission Matrix

**tech_lead (Coordinator):**

- **Tools:** read, glob, grep, memory, question, todowrite, todoread, todoplan, task, skill, mermaid\_\*, distill, compress, prune
- **Edit/Write:** \*.md files only (markdown documentation)
- **Bash - Project Management:**
  - Git operations: `git *` (commit, push, pull, status, log, diff, etc.)
  - Package management: `pixi *`, `npm install/init/create`, `yarn add/install`, `pip install`, `cargo init/add`, `go mod init`, `go get`
  - GitHub CLI: `gh *` (pr, issue, repo commands)
  - HTTP requests: `curl *`
- **Bash - Forbidden:**
  - [X] Codebase exploration (find, cat, head, tail) - use built-in grep/glob/read instead
  - [X] Test/build commands - delegate to test_runner
  - [X] File operations (cp, mv, rm, ln) - delegate to junior_dev
- **Delegation:** Can delegate to explore, junior_dev, librarian, test_runner via task tool

**explore (Discovery):**

- **Tools:** read, glob, grep, lsp
- **Bash:** `git log`, `git diff`, `git show`, `git status` only (read-only git inspection)
- **Skills:** 4 infrastructure/protocol skills (skill-invocation-policy, unicode-usage, callout-boxes, explore-execution-protocol)
- **Forbidden:** [X] edit/write, [X] delegation, [X] memory access
- **Use case:** Fast codebase mapping, pattern discovery, file location

**junior_dev (Implementation):**

- **Tools:** read, glob, grep, edit, write, context7, webfetch
- **Edit/Write:** Any file type (\*.js, \*.ts, \*.py, \*.md, config files, etc.)
- **Bash - File Operations:** `cp`, `mv`, `rm`, `ln` (file management only)
- **Research:** context7, webfetch allowed for looking up implementation patterns
- **Forbidden:**
  - [X] bash: test/build/diagnostic commands - delegate to test_runner
  - [X] bash: package installation - tech_lead handles
  - [X] Improvisation - follows specs exactly, reports unclear requirements
- **Constraint:** One attempt only - if spec unclear, reports back instead of guessing

**librarian (Research):**

- **Tools:** context7, exa, webfetch, websearch
- **Bash:** `gh *`, `git log`, `cat`, `grep`, `curl`, `jq` (for API inspection)
- **Constraint:** Context7-first enforcement - must try context7 before websearch
- **Forbidden:**
  - [X] read/glob/grep (no local file access - external research only)
  - [X] edit/write (cannot modify files)
- **Use case:** Fetch external documentation, research APIs/libraries, best practices

**test_runner (Verification):**

- **Tools:** read, glob, grep
- **Bash - Test/Build/Diagnostics:** Project-specific test and build commands (configured per-project)
  - Examples: `npm test`, `npm run build`, `pytest`, `cargo test`, `make test`
  - Diagnostic commands for debugging test failures
- **Write:** /tmp directory only (for capturing large output)
- **Forbidden:**
  - [X] edit/write to project files (verification only, no modifications)
  - [X] bash: package installation (npm install, pip install, etc.)
  - [X] bash: git state modification (git commit, git push, etc.)
- **Use case:** Run tests, execute builds, verify changes, diagnose failures

______________________________________________________________________

### 2. Guardrails (8 Enforcements via agent-guardrails.ts)

#### Universal (All Agents)

1. **Mandatory Todolists** - ALL tools (except coordination tools: question, skill, todoplan, todoread, task, memory) require active todolist before execution
1. **Todolist Reset** - When all todos complete, todoplan requirement resets for new work
1. **Memory Tag Validation** - memory add operations require 4-6 technical tags
1. **Auto-Finalization** - When todos complete, triggers todolist-complete reflection prompt

#### Tech Lead Specific

5. **Todoplan Gate** - Must call todoplan() before todowrite/todoread
1. **Markdown-Only Editing** - Blocks edit/write to non-.md files, delegates to junior_dev
1. **Skill-Before-Delegation** - Must load [subagent_type]-task skill before using task tool

> [!NOTE]
> Memory tools (memory list/search/add) are available to tech_lead only. Other agents do not have memory access.

#### Librarian Specific

8. **Context7-First** - Must try Context7 tools before exa/websearch/webfetch

#### Implementation Details

- **Reflection Prompt Injection** - Uses synthetic: true + noReply: true for cleaner UX
- **State Tracking** - Per-session Maps for loadedSkills, sessionAgents, sessionTodolist, todoplanCalled, context7Used
- **Compaction Cleanup** - Automatically cleans up state when sessions compact
- **External Prompts** - All guardrail messages loaded from plugins/reflection-prompts/\*.md

______________________________________________________________________

### 3. Plugins (6 Total)

| Plugin | Purpose | Key Capabilities |
|--------|---------|------------------|
| **agent-guardrails.ts** | Universal + role-specific constraint enforcement | 8 guardrails, reflection prompt injection, session state tracking |
| **skill-loader.ts** | Auto-load required skills at session start | Injects skill calls for tech_lead, triggers after compaction |
| **delegate.ts** | Task delegation mechanics | Template loading (nunjucks), skill validation, session management |
| **todoplan.ts** | Todolist planning guidance | 4 planning criteria (delegation, parallelization, questions, agent reuse) |
| **workflow-constraints.ts** | Structured workflow enforcement | 5 mandatory steps, skip mechanisms, workflow state machine |
| **mermaid.ts** | Diagram rendering | 3 tools: list_themes, validate, render_svg |

#### Plugin Architecture Patterns

- **Single Source of Truth** - ALL guardrails in agent-guardrails.ts (delegate.ts is pure mechanics)
- **External Reflection Prompts** - 12 .md files in plugins/reflection-prompts/ with template variables
- **Repetition Over Pattern Matching** - Multi-layered instruction repetition at touchpoints
- **Guardrail State Tracking** - Per-session Maps with compaction cleanup
- **Workflow State Machine** - Sequential step completion, not parallel

______________________________________________________________________

### 4. Skills (11 Total)

#### Infrastructure Skills (3)

Required by all agents, enforced through guardrails:

1. **skill-invocation-policy** - Rule to load skills proactively (1% chance → load it)
1. **unicode-usage** - Prohibit emojis (use [OK]/[X]/[!]), allow arrows (→ ↓) and box-drawing (│ ├)
1. **callout-boxes** - Use GitHub-style callouts (> [!NOTE], > [!IMPORTANT], etc.)

#### Task Delegation Templates (4)

Loaded before delegation, define required template_data:

4. **explore-task** - goal, search_scope, questions
1. **junior_dev-task** - implementation_spec, success_criteria, files_to_modify
1. **librarian-task** - research_goal, sources, deliverables
1. **test_runner-task** - verification_goal, commands, success_criteria

#### Execution Protocols (3)

Agent-specific operational guidance:

8. **explore-execution-protocol** - Fast search patterns (glob → grep → read → lsp)
1. **junior_dev-execution-protocol** - Spec-only execution, no improvisation, one attempt
1. **librarian-research-protocol** - Research methodology, source citation, version compatibility

#### Tech Lead Specific (1)

11. **dcp-usage** - When and how to use DCP manual tools (distill, compress, prune) after large subagent responses or long failure loops

______________________________________________________________________

### 5. Reflection Prompts (12 External Files)

Located in `opencode/plugins/reflection-prompts/`, loaded dynamically by plugins:

| Prompt | Trigger | Template Variables | Used By |
|--------|---------|-------------------|---------|
| **todolist-required** | No todolist exists | None | agent-guardrails.ts |
| **todolist-complete** | All todos complete | None | agent-guardrails.ts |
| **todolist-required-new-work** | Todos complete, new work needed | {{previousWork}} | agent-guardrails.ts |
| **tech-lead-todoplan-required** | todowrite/todoread without todoplan | {{tool}} | agent-guardrails.ts |
| **tech-lead-cannot-edit-code** | Non-.md file edit/write | {{filePath}} | agent-guardrails.ts |
| **tech-lead-skill-required** | task without loaded skill | {{subagentType}}, {{requiredSkill}} | agent-guardrails.ts |
| **memory-tags-required** | Memory add without tags | None | agent-guardrails.ts |
| **librarian-context7-required** | Web tools before Context7 | None | agent-guardrails.ts |
| **implementation-delegation-banned** | junior_dev/test_runner during create workflow | None | workflow-constraints.ts |
| **workflow-required** | Tools during workflow | {{remaining}}, {{tool}}, {{workflowType}} | workflow-constraints.ts |
| **workflow-complete** | Workflow steps complete | None | workflow-constraints.ts |
| **todoplan-guidance** | todoplan() called | None | todoplan.ts |

#### Template Variable System

- **loadReflectionPrompt()** - Utility in lib/utils.ts for loading and rendering prompts
- **createReflectionPromptLoader()** - Cached loader for performance optimization
- **Template Syntax** - {{variableName}} replaced with runtime values
- **Fallback** - Returns generic error if prompt file missing

______________________________________________________________________

### 6. Workflows (9 Commands)

Located in `opencode/commands/workflow-*.md`:

| Workflow | Purpose | Enforcement |
|----------|---------|-------------|
| **workflow-create-session-goal** | Establish clear session goal via 5-step planning | **5 mandatory steps enforced** |
| **workflow-execute-session-goal** | Execute planned session goal | **5 mandatory steps enforced** |
| **workflow-audit-project-permissions** | Review and report permission configuration | None (reporting only) |
| **workflow-create-agent-skill** | Create new skill with boilerplate | None (creation only) |
| **workflow-create-workflow** | Define custom workflow commands | None (creation only) |
| **workflow-expand-tech-lead-permissions** | Add new tech_lead permissions | None (modification only) |
| **workflow-expand-test-runner-permissions** | Add new test_runner permissions | None (modification only) |
| **workflow-generate-mermaid-diagram** | Create ASCII/SVG diagrams | None (generation only) |
| **workflow-import-cross-project-memories** | Import memories from other projects | None (import only) |

#### Workflow Enforcement Pattern

Two workflows (create-session-goal, execute-session-goal) enforce 5 mandatory steps:

1. **Memory Search/List** - Understand historical context
1. **Initial Explore** - High-level codebase overview
1. **Librarian Research** - External docs/APIs/best practices (or skip_librarian)
1. **Specialized Explore** - Deep dives into specific areas (2+ parallel)
1. **Questions** - Clarify ambiguities with user (or skip_questions)

**Hard Block:** read/glob/grep/edit/write/bash blocked until all steps complete

**Skip Mechanisms:** skip_librarian(), skip_questions() tools with justification

______________________________________________________________________

### 7. Mermaid Diagram Support (3 Tools)

| Tool | Purpose | Parameters |
|------|---------|------------|
| **mermaid_list_themes** | List available built-in themes | None |
| **mermaid_validate** | Validate diagram syntax | diagram |
| **mermaid_render_svg** | Render diagram to SVG | diagram, theme/customTheme, outputPath, returnContent |

**Supported Diagram Types:** flowchart, sequence, class, state, ER

**Built-in Themes:** zinc-dark, tokyo-night, catppuccin-mocha/latte, nord, dracula, github-light/dark, solarized, one-dark

______________________________________________________________________

## Configuration Files

### opencode.json Structure

```
opencode.json
├── agent (5 agents)
│   ├── tech_lead (mode: primary)
│   ├── explore (mode: subagent)
│   ├── junior_dev (mode: subagent)
│   ├── librarian (mode: subagent)
│   └── test_runner (mode: subagent)
├── Each agent contains:
│   ├── model (e.g., "github-copilot/claude-sonnet-4.5")
│   ├── temperature (optional)
│   ├── permission (tool allow/deny rules)
│   └── required_skills (array of skill names)
```

### Permission Configuration Pattern

```json
{
  "permission": {
    "*": "deny",                    // Default deny all
    "read": { "*": "allow" },       // Allow read everything
    "bash": {                       // Selective bash permissions
      "git *": "allow",
      "*": "deny"
    }
  }
}
```

______________________________________________________________________

## Feature Interactions & Dependencies

### Guardrail → Reflection Prompt Flow

```
Tool Call (e.g., todowrite)
    ↓
agent-guardrails.ts: tool.execute.before hook
    ↓
Check: todoplan called?
    ↓ NO
loadPrompt("tech-lead-todoplan-required", {tool: "todowrite"})
    ↓
guideThenBlock(sessionID, prompt, agent)
    ↓
Inject synthetic reflection message
    ↓
Throw "Tool execution blocked by guardrail"
    ↓
Agent sees reflection → learns → retries correctly
```

### Skill Loading Flow

```
Session Start / Compaction
    ↓
skill-loader.ts: event handler
    ↓
Check: agent === "tech_lead"?
    ↓ YES
Inject instruction with skill() calls
    ↓
Agent loads required skills automatically
    ↓
Skills guide behavior for entire session
```

### Delegation Flow

```
tech_lead: task({subagent_type: "junior_dev", template_data: {...}})
    ↓
agent-guardrails.ts: Check skill loaded?
    ↓ NO → Block with tech-lead-skill-required prompt
    ↓ YES
delegate.ts: Load skill template
    ↓
Render template with nunjucks + template_data
    ↓
Launch subagent with rendered spec
    ↓
Subagent executes → returns result
    ↓
tech_lead synthesizes result
```

______________________________________________________________________

## Known Issues & Limitations

### Current Known Issues

1. **Reflection Prompt Caching** - createReflectionPromptLoader() caches with variable substitution, may cause stale data if same prompt with different variables

### Limitations by Design

1. **tech_lead Cannot Edit Code** - Must delegate to junior_dev (intentional separation)
1. **junior_dev One Attempt Only** - Cannot retry or debug (reports back to tech_lead)
1. **test_runner Read-Only** - Cannot fix issues, only report (separation of concerns)
1. **Workflow Steps Sequential** - Cannot parallelize within workflow state machine
1. **Skill Loading Manual** - Only auto-loaded at session start, not dynamically

______________________________________________________________________

## Maintenance Guidelines

### When to Update This Document

Update FEATURES.md **immediately** when:

- Adding/removing/modifying agents
- Adding/removing/modifying guardrails
- Adding/removing/modifying plugins
- Adding/removing/modifying skills
- Adding/removing/modifying workflows
- Changing agent permissions
- Adding/removing reflection prompts
- Discovering new feature interactions

### How to Update This Document

1. **Update Feature List** - Add/remove/modify entries in relevant sections
1. **Update Feature Interactions** - Document new dependencies or flows
1. **Update Testing Checklist** - Add new test scenarios
1. **Update Known Issues** - Document bugs or limitations
1. **Update Version** - Increment version number at top of document
1. **Commit with Description** - Clear commit message explaining what changed

### Cross-Reference Checklist

When updating features, also check:

- [ ] README.md - Update high-level feature list
- [ ] USAGE.md - Update usage examples if workflows/agents changed
- [ ] CONCEPTS.md - Update architecture description if patterns changed
- [ ] AGENTS.md - Update code style guidelines if agent responsibilities changed
- [ ] Agent role files (opencode/agent/\*.md) - Update if permissions or constraints changed

______________________________________________________________________

## Design Philosophy

This configuration implements a **guardrails-first** approach where:

- **Plugins enforce behavior** - Hard constraints via guardrails, not documentation
- **Skills for complex patterns** - Only what can't be enforced programmatically
- **Agents learn by doing** - Hit guardrails, read reflection prompts, retry correctly
- **Minimal required skills** - Focused skill set covering templates, protocols, and tech_lead tooling
- **External guidance** - Reflection prompts in .md files enable non-technical editing

This philosophy prioritizes learning through interaction over upfront documentation consumption.

______________________________________________________________________

## Additional Resources

- **[README.md](README.md)** - Quick start and overview
- **[USAGE.md](docs/USAGE.md)** - Detailed usage guide and examples
- **[CONCEPTS.md](docs/CONCEPTS.md)** - Architecture and design principles
- **[AGENTS.md](AGENTS.md)** - Code style and agent guidelines
- **[opencode.json](opencode/opencode.json)** - Agent configuration and permissions
- **[Agent roles](opencode/agent/)** - Individual agent role definitions
- **[Skills](opencode/skill/)** - Skill implementations
- **[Workflows](opencode/commands/)** - Workflow command definitions
- **[Plugins](opencode/plugins/)** - Plugin implementations
