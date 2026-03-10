# OpenCode Configuration

## What This Is

This is a production-ready OpenCode configuration that provides intelligent multi-agent coordination for AI-assisted development. The tech_lead agent orchestrates complex workflows, automatically delegating to specialized subagents.

### Why You Need This

Managing complex development tasks often requires switching between different tools and mental models. This configuration eliminates that cognitive load by providing a single coordination interface that:

- Understands when to delegate vs handle directly
- Breaks down complex tasks into specialized subtasks
- Automatically sequences work in the right order
- Synthesizes results from multiple agents

> [!TIP]
> Key benefits include 5 specialized agents, ready-to-use workflows with auto-loaded skills, and enforced best practices through permission-based guardrails.

### Target Audience

Developers using OpenCode for AI-assisted development who want structured task coordination and specialized agent capabilities. This is ideal for teams working on larger codebases where task isolation and clear responsibilities matter.

## Features

### Specialized Agents

Each agent has a specific role and permission set:

- **tech_lead** - Orchestrates and delegates tasks, handles planning and decision-making, executes project management commands (git, package installation, CI/CD access via curl/jq)
- **junior_dev** - Implements code changes following specifications
- **test_runner** - Runs tests, builds, and verifies changes work correctly
- **explore** - Searches codebase for patterns, files, and implementations
- **librarian** - Fetches documentation and performs web research

> [!TIP]
> See [FEATURES.md Section 1](FEATURES.md#1-agents-5-total) for the complete agent capability and permission matrix.

### Ready-to-Use Workflows

Pre-configured commands that handle multi-step tasks:

**Common Workflows:**
- **workflow-create-session-goal** - Establish clear session goals via structured 5-step planning
- **workflow-execute-session-goal** - Execute planned session goals with enforced research and exploration
- **workflow-generate-mermaid-diagram** - Generate flowcharts and architecture diagrams

**Development Workflows:**
- **workflow-create-agent-skill** - Create new agent skills with boilerplate and structure
- **workflow-create-workflow** - Define custom workflows for your team's patterns

**Configuration Workflows:**
- **workflow-audit-project-permissions** - Review and report permission configuration
- **workflow-expand-tech-lead-permissions** - Add new tech_lead permissions safely
- **workflow-expand-test-runner-permissions** - Add new test_runner permissions safely
- **workflow-import-cross-project-memories** - Import memories from other projects

> [!TIP]
> See [opencode/commands/](opencode/commands/) for the complete workflow reference with detailed specifications.

### Auto-Loaded Skills for Consistent Behavior

Each agent loads minimal required skills:

**Infrastructure Skills (3):**
- skill-invocation-policy, unicode-usage, callout-boxes

**Task Templates (4):**
- explore-task, junior_dev-task, librarian-task, test_runner-task

**Execution Protocols (3):**
- Agent-specific operational guidance for explore, junior_dev, librarian, test_runner

Benefits:
- Consistent behavior across all interactions
- Built-in guardrails via plugins (not just documentation)
- Task delegation templates with required parameters
- Permission enforcement at every step

> [!TIP]
> See [FEATURES.md Section 4](FEATURES.md#4-skills-10-total-after-44-reduction) for the complete skill inventory and detailed descriptions.

### Guardrails for Guaranteed Agent Behavior

Security and consistency through guardrails-first architecture:

- **Plugin-Enforced Guardrails** - Hard constraints via agent-guardrails.ts plugin
- **Least-Privilege Security Model** - Each agent only has permissions it needs
- **Role-Specific Capability Boundaries** - Clear separation of concerns
- **Safe Delegation Patterns** - Agents can't overstep their roles
- **Reflection Prompts on Violation** - Educational guidance when constraints hit
- **Externalized Guidance** - 12 reflection prompts in .md files for easy editing
- **Audit-Friendly** - Clear permissions enable traceability

> [!TIP]
> See [FEATURES.md Section 2](FEATURES.md#2-guardrails-8-enforcements-via-agent-guardrailsts) for the complete guardrail list and reflection prompt details.

> [!TIP]
> This configuration uses a guardrails-first approach: agents learn by hitting constraints and reading reflection prompts, rather than reading long skill documents upfront.

### Build Agent Fallback

When tech_lead delegation isn't the right fit for a task:

- **Available when needed** - Build agent with comprehensive permissions for end-to-end implementation
- **Use cases** - Rapid prototyping, tight integration across many files, or when delegation overhead doesn't fit
- **Default to delegation** - tech_lead coordination provides better quality assurance for most tasks

## Quick Start

### Installation

1. We use `pixi` for package management, so here's how to install `opencode` with it:

   ```bash
   pixi global install nodejs
   npm install -g opencode-ai

   # run with npx
   npx opencode auth login
   ```

2. **Copy this config to your OpenCode directory:**

   ```bash
   cp -r opencode ~/.config/opencode
   ```

3. **Start OpenCode in your project directory**

   ```bash
   opencode
   ```

   > [!NOTE]
   > tech_lead is the default agent - you can start chatting immediately without switching agents

### Your First Interaction

The tech_lead agent is intelligent about delegation. It automatically analyzes your requests, determines what specialist agents are needed, and orchestrates the workflow without requiring manual coordination.

**Example Request:**

```
Please do deep-review of this custom opencode configuration codebase. Make sure to check for alignment with best practices outlined in online docs and other sources.
```

**What Happens Behind the Scenes:**

1. tech_lead analyzes the request and determines it needs research and exploration
2. Delegates to librarian to fetch OpenCode best practices from documentation
3. Delegates to explore (possibly multiple in parallel) to analyze the config structure
4. Synthesizes findings from both agents
5. Reports back with alignment analysis and recommendations

> [!IMPORTANT]
> You always stay in control. tech_lead asks for confirmation before making major changes and reports all delegation decisions transparently.

### Try a Workflow

Workflows automate common multi-step tasks:

```
/workflow-generate-mermaid-diagram Create orchestration diagram for tech_lead coordination
```

> [!NOTE]
> For complete workflow documentation and examples, see [Usage Guide](docs/USAGE.md) and [opencode/commands/](opencode/commands/).

## What's Next

### Learn More

Explore the documentation to deepen your understanding:

- **[Features Baseline](FEATURES.md)** - Complete feature set with version history and maintenance guidelines
- **[Core Concepts](docs/CONCEPTS.md)** - Understand the orchestration architecture and design principles behind multi-agent coordination
- **[Usage Guide](docs/USAGE.md)** - Learn workflows, delegation patterns, and practical usage examples

### Common Starting Points

**If you want to...** → **Read this:**

- Understand complete feature set and version history → [Features Baseline](FEATURES.md)
- Understand how agents collaborate → [Core Concepts](docs/CONCEPTS.md)
- Learn how to use workflows and direct delegations → [Usage Guide](docs/USAGE.md)
- Solve a specific problem → [Usage Guide](docs/USAGE.md)

---

**Ready to get started?** Open your project and start chatting with tech_lead. It's designed to learn from your requests and improve its delegation decisions over time.
