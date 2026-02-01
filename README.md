# CodeAccelerate-OpencodeConfig

An intelligent OpenCode agent configuration featuring a tech lead orchestrator that delegates complex tasks to specialized AI agents.

## What Is This?

This is a sophisticated OpenCode configuration that gives you a **tech_lead agent** capable of breaking down complex development tasks and delegating them to specialized subagents:

- **explore** - Searches your codebase for patterns, files, and implementations
- **librarian** - Fetches documentation and performs web research
- **junior_dev** - Implements code changes following your specifications
- **test_runner** - Runs tests, builds, and verifies changes

The tech_lead orchestrates these agents to handle multi-step workflows that would be tedious to coordinate manually.

## Key Benefits

- **Intelligent task decomposition** - tech_lead breaks complex requests into manageable subtasks
- **Specialized expertise** - Each agent is optimized for specific types of work
- **Reduced cognitive load** - Let the tech_lead figure out the workflow while you focus on requirements
- **Secure by design** - Permission boundaries prevent agents from overstepping their roles
- **Extensible** - Add new agents as your needs evolve

## Quick Start

### Installation

1. **Clone and install this configuration:**
   ```bash
   # Clone the repository
   git clone https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig.git
   cd CodeAccelerate-OpencodeConfig
   
   # Backup existing config if it exists
   [ -d ~/.config/opencode ] && mv ~/.config/opencode ~/.config/opencode.backup.$(date +%Y%m%d-%H%M%S)
   
   # Copy configuration to OpenCode config directory
   cp -r opencode ~/.config/opencode
   ```

2. **Restart OpenCode** to load the new configuration

3. **Start using the tech_lead agent:**
   ```
   tech_lead is now your default agent - just start chatting!
   Or press Tab to switch between available agents
   ```

### Your First Task

Try asking tech_lead to help with a multi-step task:

```
Find all API endpoint definitions, update the rate limiting middleware, 
and verify the changes with tests
```

The tech_lead will:
1. Use **explore** to find API endpoints and middleware files
2. Use **junior_dev** to implement rate limiting updates
3. Use **test_runner** to verify the changes work

## Documentation

- **[Getting Started](docs/GETTING-STARTED.md)** - First steps, basic concepts, and examples
- **[Core Concepts](docs/CONCEPTS.md)** - Architecture, delegation patterns, and design philosophy
- **[Usage Guide](docs/GUIDE.md)** - Practical examples and common workflows
- **[Reference](docs/REFERENCE.md)** - Quick lookup for agents, permissions, and configuration
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## Configuration Files

This configuration is built on OpenCode's agent system. Key files:

- `opencode/opencode.json` - Agent definitions, permissions, and model assignments
- `opencode/agent/*.md` - Agent role prompts and capabilities (5 agents)
- `opencode/skill/*-task/SKILL.md` - Delegation task templates (5 skills)
- `opencode/commands/*.md` - Custom workflow commands (2 workflows)
- `opencode/plugins/*.ts` - Custom functionality extensions (6 plugins)

> **Note:** Instead of documenting every detail here, we reference the source files. They're the source of truth and won't get outdated.

## When to Use Build Agent

For **major refactors, full rebuilds, or cross-cutting changes**, tech_lead will recommend switching to OpenCode's built-in `build` agent via Tab. The build agent handles end-to-end workflows better than delegating to subagents.

**Quick fixes and targeted changes** work great with tech_lead's delegation workflow.

## Project Structure

```
.
├── opencode/
│   ├── opencode.json          # Main configuration
│   ├── agent/                 # Agent role definitions (5 agents)
│   ├── skill/                 # Task delegation templates (5 skills)
│   ├── commands/              # Custom workflow commands (2 workflows)
│   └── plugins/               # Custom plugins (6 plugins)
└── docs/                      # Documentation
```

## Contributing

Improvements welcome! This configuration demonstrates:
- Multi-agent orchestration patterns
- Secure permission boundaries
- Skill-based task delegation
- Progressive complexity handling

Feel free to adapt it for your own workflows.

## License

MIT License - See LICENSE file for details
