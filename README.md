# OCX Registry Starter

A ready-to-deploy component registry for [OpenCode](https://opencode.ai).

## One-Click Deploy

Deploy your registry instantly to your preferred platform:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR_USERNAME/YOUR_REPO)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/YOUR_REPO)

> **After forking:** Update the deploy button URLs above to point to your repository.

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Build the Registry

```bash
bun run build
```

### 3. Local Development

```bash
bun run dev
```

This starts a local server at `http://localhost:8787`.

### 4. Deploy

```bash
bun run deploy
```

## Using Your Registry

Once deployed, users can add components from your registry:

```bash
# Add a component directly (using --from for ephemeral access)
ocx add hello-world --from https://your-registry.workers.dev

# Or add the registry permanently with a custom alias
ocx registry add https://your-registry.workers.dev --name myreg
ocx add myreg/hello-world

# Or install a profile
ocx profile add my-profile --source myreg/my-profile --from https://your-registry.workers.dev --global
```

## Project Structure

```
├── registry.jsonc         # Registry manifest
├── files/                  # Component source files
│   └── skills/
│       └── hello-world/
│           └── SKILL.md   # Example skill
├── dist/                   # Built output (generated)
├── wrangler.jsonc          # Cloudflare Workers config
├── vercel.json             # Vercel config
├── netlify.toml            # Netlify config
└── AGENTS.md               # AI assistant guidelines
```

## Adding Components

### 1. Create your component file

```bash
# Skill
mkdir -p files/skills/my-skill
echo "# My Skill\n\nInstructions..." > files/skills/my-skill/SKILL.md

# Plugin
touch files/plugins/my-plugin.ts

# Agent
touch files/agents/my-agent.md
```

### 2. Register it in `registry.jsonc`

```json
{
  "components": [
    {
      "name": "my-skill",
      "type": "skill",
      "description": "What it does",
      "files": ["skills/my-skill/SKILL.md"]
    }
  ]
}
```

### 3. Build and deploy

```bash
bun run build && bun run deploy
```

## Component Types

| Type | Purpose | Format |
|------|---------|--------|
| `skill` | AI behavior instructions | Markdown |
| `plugin` | OpenCode extensions | TypeScript |
| `agent` | Agent role definitions | Markdown |
| `command` | Custom TUI commands | Markdown |
| `tool` | Custom tool implementations | TypeScript |
| `bundle` | Component collections | JSON |
| `profile` | Shareable profile configuration | JSON |

See [AGENTS.md](./AGENTS.md) for detailed documentation on each type.

## Configuration

### Cloudflare Workers (default)

Edit `wrangler.jsonc` to customize your worker name and settings.

### Vercel

Edit `vercel.json`. Build command and output directory are pre-configured.

### Netlify

Edit `netlify.toml`. Build command and publish directory are pre-configured.

## Documentation

- [AGENTS.md](./AGENTS.md) - Complete guide including [best practices](./AGENTS.md#best-practices)
- [OCX CLI Documentation](https://ocx.kdco.dev/cli/commands)
- [OpenCode Reference](https://ocx.kdco.dev/reference/opencode)
- [Registry Protocol](https://ocx.kdco.dev/registries/protocol)

## License

MIT
