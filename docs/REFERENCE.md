# Reference

Quick lookup guide for agents, permissions, skills, and configuration.

## Agent Quick Reference

### tech_lead
- **Model:** Claude Sonnet 4.5
- **Mode:** Primary (default agent)
- **Purpose:** Orchestration and delegation
- **Key Tools:** task, read, glob, grep, edit/write (*.md only), bash (ask), todowrite, skill
- **Source:** `opencode/agent/tech_lead.md`

### explore
- **Model:** Claude Haiku 4.5
- **Mode:** Subagent (called by tech_lead)
- **Purpose:** Code search and discovery
- **Key Tools:** read, glob, grep, lsp
- **Source:** `opencode/agent/explore.md`

### librarian
- **Model:** Claude Sonnet 4.5
- **Temperature:** 0.6 (higher creativity)
- **Mode:** Subagent (called by tech_lead)
- **Purpose:** Research and documentation lookup
- **Key Tools:** webfetch, context7
- **Source:** `opencode/agent/librarian.md`

### junior_dev
- **Model:** Claude Haiku 4.5
- **Temperature:** 0.15 (conservative)
- **Mode:** Subagent (called by tech_lead)
- **Purpose:** Code implementation and modification
- **Key Tools:** read, edit, write, glob, grep, lsp, todowrite
- **Source:** `opencode/agent/junior_dev.md`

### test_runner
- **Model:** Claude Haiku 4.5
- **Temperature:** 0.3 (balanced)
- **Mode:** Subagent (called by tech_lead)
- **Purpose:** Testing, building, and verification
- **Key Tools:** bash, read, glob, grep
- **Source:** `opencode/agent/test_runner.md`

## Permission Matrix

| Tool | tech_lead | explore | librarian | junior_dev | test_runner |
|------|-----------|---------|-----------|------------|-------------|
| read | ✅ (ask for .env) | ✅ | ❌ | ✅ | ✅ |
| edit | ⚠️ (*.md only) | ❌ | ❌ | ✅ | ❌ |
| write | ⚠️ (*.md only) | ❌ | ❌ | ✅ | ❌ |
| bash | ⚠️ (ask) | ❌ | ❌ | ❌ | ✅ |
| glob | ✅ | ✅ | ❌ | ✅ | ✅ |
| grep | ✅ | ✅ | ❌ | ✅ | ✅ |
| lsp | ✅ | ✅ | ❌ | ✅ | ❌ |
| webfetch | ❌ | ❌ | ✅ | ❌ | ❌ |
| context7 | ❌ | ❌ | ✅ | ❌ | ❌ |
| task | ✅ | ❌ | ❌ | ❌ | ❌ |
| skill | ✅ | ❌ | ❌ | ❌ | ❌ |
| todowrite | ✅ | ❌ | ❌ | ✅ | ❌ |
| mermaid_* | ✅ | ❌ | ❌ | ❌ | ❌ |

Legend:
- ✅ Full access
- ⚠️ Limited/conditional access
- ❌ No access

> **Source of Truth:** See `opencode/opencode.json` for complete permission definitions

## Skill Templates

### explore-task
- **Purpose:** Delegate code search tasks
- **Subagent:** explore
- **Use When:** Need to find files, patterns, or understand code structure
- **Source:** `opencode/skill/explore-task/SKILL.md`

### librarian-task
- **Purpose:** Delegate research tasks
- **Subagent:** librarian
- **Use When:** Need external documentation or best practices
- **Source:** `opencode/skill/librarian-task/SKILL.md`

### junior_dev-task
- **Purpose:** Delegate implementation tasks
- **Subagent:** junior_dev
- **Use When:** Need code changes, file modifications, or implementations
- **Source:** `opencode/skill/junior_dev-task/SKILL.md`

### test_runner-task
- **Purpose:** Delegate testing and verification
- **Subagent:** test_runner
- **Use When:** Need to run tests, builds, or verify changes
- **Source:** `opencode/skill/test_runner-task/SKILL.md`

### skill-invocation-policy
- **Purpose:** Core rules for using the skill system
- **Required By:** All agents
- **Source:** `opencode/skill/skill-invocation-policy/SKILL.md`

## Custom Workflows

### workflow-create-workflow
- **Purpose:** Create new custom workflow commands
- **Source:** `opencode/commands/workflow-create-workflow.md`

### workflow-generate-mermaid-diagram
- **Purpose:** Generate Mermaid diagrams for documentation
- **Source:** `opencode/commands/workflow-generate-mermaid-diagram.md`

## Custom Plugins

| Plugin | Purpose |
|--------|---------|
| delegate.ts | Core delegation mechanism for subagent invocation |
| skill-loader.ts | Loads skill templates for task delegation |
| mermaid-validate.ts | Validates Mermaid diagram syntax |
| mermaid-render-ascii.ts | Renders Mermaid diagrams as ASCII art |
| mermaid-render-svg.ts | Renders Mermaid diagrams as SVG files |
| mermaid-list-themes.ts | Lists available Mermaid themes |

> **Source:** See `opencode/plugins/` directory

## Configuration Structure

```
opencode/
├── opencode.json              # Main configuration file
│   ├── $schema               # OpenCode config schema
│   ├── small_model           # Model for simple operations
│   ├── default_agent         # Agent loaded by default (tech_lead)
│   ├── mcp                   # MCP server configuration
│   └── agent                 # Agent definitions
│       ├── [agent_name]      # Per-agent configuration
│       │   ├── mode          # primary|subagent
│       │   ├── model         # LLM model to use
│       │   ├── temperature   # Optional temperature override
│       │   ├── permission    # Permission rules
│       │   └── required_skills  # Skills this agent must load
│
├── agent/                    # Agent role definitions (markdown)
│   ├── tech_lead.md
│   ├── explore.md
│   ├── librarian.md
│   ├── junior_dev.md
│   └── test_runner.md
│
├── skill/                    # Skill templates for delegation
│   ├── explore-task/
│   │   └── SKILL.md
│   ├── librarian-task/
│   │   └── SKILL.md
│   ├── junior_dev-task/
│   │   └── SKILL.md
│   ├── test_runner-task/
│   │   └── SKILL.md
│   └── skill-invocation-policy/
│       └── SKILL.md
│
├── commands/                 # Custom workflow commands
│   ├── workflow-create-workflow.md
│   └── workflow-generate-mermaid-diagram.md
│
└── plugins/                  # Custom TypeScript plugins
    ├── delegate.ts
    ├── skill-loader.ts
    └── mermaid-*.ts
```

## Model Assignments

| Model | Used By | Rationale |
|-------|---------|-----------|
| Claude Sonnet 4.5 | tech_lead, librarian, build | High reasoning capability for orchestration and research |
| Claude Haiku 4.5 | explore, junior_dev, test_runner | Fast and efficient for focused tasks |
| GPT-4o Mini | small_model | Quick operations |

> **Source:** See `opencode/opencode.json` for model configuration

## Environment & MCP

### MCP Servers

**context7:**
- **Type:** Local
- **Command:** `npx -y @upstash/context7-mcp`
- **Used By:** librarian agent
- **Purpose:** Enhanced documentation lookup and research

> **Source:** See `opencode/opencode.json` under "mcp" section

## File Paths

All paths relative to: `~/.config/CodeAccelerate-OpencodeConfig/`

### Configuration
- `opencode/opencode.json` - Main config

### Agent Definitions
- `opencode/agent/tech_lead.md`
- `opencode/agent/explore.md`
- `opencode/agent/librarian.md`
- `opencode/agent/junior_dev.md`
- `opencode/agent/test_runner.md`

### Skills
- `opencode/skill/explore-task/SKILL.md`
- `opencode/skill/librarian-task/SKILL.md`
- `opencode/skill/junior_dev-task/SKILL.md`
- `opencode/skill/test_runner-task/SKILL.md`
- `opencode/skill/skill-invocation-policy/SKILL.md`

### Commands
- `opencode/commands/workflow-create-workflow.md`
- `opencode/commands/workflow-generate-mermaid-diagram.md`

### Plugins
- `opencode/plugins/*.ts` (6 plugins)

### Documentation
- `README.md`
- `docs/GETTING-STARTED.md`
- `docs/CONCEPTS.md`
- `docs/GUIDE.md`
- `docs/REFERENCE.md` (this file)
- `docs/TROUBLESHOOTING.md`
- `docs/diagrams/*.svg` (architectural diagrams)

## Common Tasks Cheatsheet

### Finding the Current Configuration

```bash
# Main config file
cat ~/.config/CodeAccelerate-OpencodeConfig/opencode/opencode.json

# Agent definition
cat ~/.config/CodeAccelerate-OpencodeConfig/opencode/agent/tech_lead.md

# Skill template
cat ~/.config/CodeAccelerate-OpencodeConfig/opencode/skill/explore-task/SKILL.md
```

### Checking Agent Permissions

```bash
# View permissions for specific agent
jq '.agent.tech_lead.permission' opencode/opencode.json
jq '.agent.junior_dev.permission' opencode/opencode.json
```

### Listing Available Skills

```bash
ls -1 opencode/skill/
```

### Finding Plugin Capabilities

```bash
ls -1 opencode/plugins/*.ts
```

## Disabled Agents

These OpenCode built-in agents are disabled in this configuration:

- `plan` - Disabled (tech_lead provides orchestration)
- `general` - Disabled (tech_lead is the primary interface)

Use tech_lead as your main agent. Switch to `build` agent via Tab for major refactors.

## Quick Answers

**Q: Which agent should I talk to?**
A: Always start with tech_lead (it's the default). It will delegate as needed.

**Q: Can I call subagents directly?**
A: Technically yes, but they're optimized for being called by tech_lead with specific context.

**Q: Where are permissions defined?**
A: `opencode/opencode.json` under each agent's "permission" section

**Q: How do I add a new agent?**
A: Create `opencode/agent/new_agent.md` and add config to `opencode/opencode.json`

**Q: Where can I see what each agent can do?**
A: Read `opencode/agent/*.md` files for complete role definitions

**Q: How do I modify delegation behavior?**
A: Edit `opencode/agent/tech_lead.md` and/or skill templates in `opencode/skill/`

**Q: Can I use different models?**
A: Yes, edit model assignments in `opencode/opencode.json`

## Related Documentation

- **[Getting Started](GETTING-STARTED.md)** - First steps and basic usage
- **[Core Concepts](CONCEPTS.md)** - Architecture and design philosophy
- **[Usage Guide](GUIDE.md)** - Practical examples and workflows
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions

## Version Information

This configuration is designed for OpenCode v0.8+

Check your OpenCode version:
```bash
opencode --version
```

> **Note:** Some features may require specific OpenCode versions. Check the OpenCode documentation for compatibility.
