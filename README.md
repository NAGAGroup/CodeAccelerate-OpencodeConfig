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

### 5 Specialized Agents

Each agent has a specific role and permission set:

- **tech_lead** - Orchestrates and delegates tasks, handles planning and decision-making, executes project management commands (git, package installation, CI/CD access via curl/jq)
- **junior_dev** - Implements code changes following specifications
- **test_runner** - Runs tests, builds, and verifies changes work correctly
- **explore** - Searches codebase for patterns, files, and implementations
- **librarian** - Fetches documentation and performs web research

### 3 Ready-to-Use Workflows

Pre-configured commands that handle multi-step tasks:

- **workflow-create-agent-skill** - Creates new agent skills with boilerplate and structure
- **workflow-create-workflow** - Defines custom workflows for your team's patterns
- **workflow-generate-mermaid-diagram** - Generates flowcharts and architecture diagrams

### Auto-Loaded Skills for Consistent Behavior

Each agent loads an agent-specific set of required skills before executing tasks:

- Consistent behavior across all interactions
- Built-in guardrails and best practices
- Task delegation templates that prevent mistakes
- Permission enforcement at every step

### Guardrails for Guaranteed Agent Behavior

Security and consistency through multiple enforcement layers:

- **Least-privilege security model** - Each agent only has permissions it needs
- **Role-specific capability boundaries** - Clear separation of concerns
- **Safe delegation patterns** - Agents can't overstep their roles
- **Enforced metareflection before tool calls** - Guidance injected at critical decision points
- **Audit-friendly** - Clear permissions enable traceability

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

   Or for project-local configuration (recommended):

   ```bash
   cp -r opencode .opencode/
   ```

   > [!NOTE]
   > Project-local config (.opencode/) takes precedence over global config (~/.config/opencode)

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

Use workflows to automate common patterns:

```
/workflow-generate-mermaid-diagram Create orchestration diagram for the tech_lead defined in @opencode config
```

This workflow generates a diagram showing how tech_lead orchestrates work across specialized agents, helping you visualize the coordination architecture.

> [!NOTE]
> For more workflow examples and complete command reference, see [Usage Guide](docs/USAGE.md)

## What's Next

### Learn More

Explore the documentation to deepen your understanding:

- **[Core Concepts](docs/CONCEPTS.md)** - Understand the orchestration architecture and design principles behind multi-agent coordination
- **[Usage Guide](docs/USAGE.md)** - Learn workflows, delegation patterns, and practical usage examples

### Common Starting Points

**If you want to...** → **Read this:**

- Understand how agents collaborate → [Core Concepts](docs/CONCEPTS.md)
- Learn how to use workflows and direct delegations → [Usage Guide](docs/USAGE.md)
- Solve a specific problem → [Usage Guide](docs/USAGE.md)

---

**Ready to get started?** Open your project and start chatting with tech_lead. It's designed to learn from your requests and improve its delegation decisions over time.
