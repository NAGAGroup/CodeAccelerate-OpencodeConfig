# Configuration

All configuration lives in `opencode.jsonc`. After installing a profile, this file is at `~/.config/opencode/profiles/<name>/opencode.jsonc` — where `<name>` is the profile you installed (`naga`, `naga-haiku`, `naga-copilot`, `naga-haiku-copilot`, or `naga-free`).

Edit this file directly to customize models, MCP servers, and agent behavior.

---

## Model Assignments

Each agent has a model assigned under the `agent.<name>.model` field. The defaults reflect the maintainer's personal provider choices — **they are examples, not requirements**. The system is provider-agnostic: any model supported by your OpenCode installation works.

```json
"agent": {
  "headwrench": {
    "model": "anthropic/claude-sonnet-4-6"
  },
  "context-scout": {
    "model": "anthropic/claude-haiku-4-5"
  }
}
```

To switch a model, replace the value with any provider string OpenCode recognizes (e.g. `openai/gpt-4o`, `google/gemini-2.5-pro`).

### Default assignments (for reference)

| Tier | Agents |
|---|---|
| Sonnet-tier | `headwrench`, `context-insurgent` |
| Haiku-tier | `context-scout`, `quick-doc`, `junior-dev`, `deep-researcher` |

Sonnet-tier agents handle orchestration and deep reasoning. Haiku-tier agents handle fast, scoped tasks. If you're on a tighter budget or prefer a different provider, reassign freely — the tier split is a suggestion, not a constraint.

> **Note:** `compaction` is an OpenCode-internal agent, not part of the CodeAccelerate roster. Profiles configure its model assignment as a system requirement.

---

## MCP Servers

Four MCP servers are configured by default. Each has an `enabled` flag you can toggle without removing the server entry.

```json
"mcp": {
  "exa": {
    "type": "remote",
    "url": "https://mcp.exa.ai/mcp?exaApiKey=${EXA_API_KEY}",
    "enabled": true
  }
}
```

### Configured servers

| Server | Type | Purpose |
|---|---|---|
| `context7` | local (npx) | Documentation lookup for libraries and frameworks |
| `sequential-thinking` | local (npx) | Step-by-step structured reasoning |
| `exa` | remote | Web search — requires `EXA_API_KEY` |
| `memory` | local (npx) | Cross-session knowledge graph |

### Enabling and disabling

Set `"enabled": false` to disable a server without deleting its config. Set it back to `true` to re-enable.

The `exa` server is the only one with an external dependency. If you don't have an `EXA_API_KEY`, disable it to avoid errors on startup.

---

## Enabling and Disabling Agents

Some agents are disabled by default because they duplicate roles handled by the custom agents in this config:

| Agent | Disabled | Reason |
|---|---|---|
| `plan` | yes | Replaced by HeadWrench planning modes |
| `general` | yes | Replaced by HeadWrench as default agent |
| `explore` | yes | Replaced by ContextScout/ContextInsurgent |

To disable an agent:

```json
"agent": {
  "some-agent": {
    "disable": true
  }
}
```

To re-enable one of the disabled defaults, set `"disable": false` or remove the `disable` field entirely.
