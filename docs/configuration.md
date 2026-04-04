# Configuration

All configuration lives in `opencode.jsonc`. After installing a profile, this file is at `~/.config/opencode/profiles/<name>/opencode.jsonc` — where `<name>` is the profile you installed (`naga`, `naga-haiku`, `naga-copilot`, `naga-haiku-copilot`, `naga-free`, or `naga-ollama`).

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

> **Ollama profile:** The `ocx-ollama` profile routes all agent calls to a fixed model alias called `opencode-model`. Before launching, copy your chosen model under that alias:
>
> ```sh
> ollama cp devstral-small-2 opencode-model
> # replace devstral-small-2 with your actual model name
> ```
>
> Ollama must be running locally at `http://localhost:11434`.
>
> **For parallel requests (strongly recommended):** The CodeAccelerate agent system frequently dispatches multiple agents concurrently. Configure Ollama to handle parallel requests via systemctl:
>
> ```sh
> sudo systemctl edit ollama.service
> ```
>
> Add the following under `[Service]`:
>
> ```ini
> [Service]
> Environment="OLLAMA_NUM_PARALLEL=3"
> Environment="OLLAMA_FLASH_ATTENTION=1"
> Environment="OLLAMA_KV_CACHE_TYPE=q8_0"
> ```
>
> Then reload and restart:
>
> ```sh
> sudo systemctl daemon-reload
> sudo systemctl restart ollama
> ```

### Default assignments (for reference)

| Tier | Agents |
|---|---|
| Sonnet-tier | `headwrench`, `context-insurgent`, `tailwrench`, `autonomous-agent` |
| Haiku-tier | `context-scout`, `documentation-expert`, `junior-dev`, `external-scout` |

Sonnet-tier agents handle orchestration, deep reasoning, and autonomous execution. Haiku-tier agents handle fast, scoped tasks. If you're on a tighter budget or prefer a different provider, reassign freely — the tier split is a suggestion, not a constraint.

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

| Server | Profiles | Type | Purpose |
|---|---|---|---|
| `context7` | all | remote | Documentation lookup for libraries and frameworks |
| `sequential-thinking` | all | local (npx) | Step-by-step structured reasoning |
| `probe` | all | local (npx) | Semantic code search — no setup required |
| `qdrant` | all | local (uvx) | Semantic session memory — see setup below |
| `searxng` | ollama only | local (npx) | Local web search — see setup below |

### Enabling and disabling

Set `"enabled": false` to disable a server without deleting its config. Set it back to `true` to re-enable.

### Qdrant setup

Qdrant provides semantic memory for planning sessions. It runs locally and stores data in `.opencode/qdrant` inside your project directory.

**Requirements:** Python with `uv` installed (`pip install uv` or see [uv docs](https://docs.astral.sh/uv/)).

No other setup is needed. On first use, `uvx mcp-server-qdrant` will download and cache the server and the embedding model (`sentence-transformers/all-MiniLM-L6-v2`, ~90MB). This takes 30–60 seconds. Subsequent starts are instant.

> **Timeout note:** The profile sets `"timeout": 30000` (30 seconds) on the qdrant MCP entry. This covers the first-run model download. Do not reduce this value.

### SearXNG setup (ollama profile only)

The `ocx-ollama` profile includes a local SearXNG web search server. SearXNG is a self-hosted metasearch engine — no API key required.

**1. Install and start SearXNG with Docker:**

```bash
mkdir ~/searxng && cd ~/searxng
curl -o docker-compose.yml https://raw.githubusercontent.com/searxng/searxng-docker/master/docker-compose.yaml
sudo docker compose up -d
```

**2. Enable JSON output format:**

SearXNG disables JSON output by default. Enable it by editing the settings inside the running container:

```bash
sudo docker exec searxng-core sed -i '/^  formats:/a\    - json' /etc/searxng/settings.yml
sudo docker compose restart core
```

To persist across container rebuilds, also edit the host-side config:

```bash
# Find the line number of "    - html" under "formats:" (usually line 86)
grep -n "formats:" ~/searxng/core-config/settings.yml
sudo sed -i '86a\    - json' ~/searxng/core-config/settings.yml
```

**3. Disable the bot limiter (required for local API access):**

```bash
mkdir -p ~/searxng/core-config
cat > ~/searxng/core-config/limiter.toml << 'EOF'
[botdetection.ip_lists]
pass_ip = ['127.0.0.0/8', '::1']
EOF
sudo docker compose restart core
```

**4. Set the URL in your profile:**

The profile config uses `{env:SEARXNG_URL}`. Set it in your shell environment:

```bash
export SEARXNG_URL=http://localhost:8080
```

Or hardcode it directly in `opencode.jsonc`:

```jsonc
"searxng": {
  "type": "local",
  "command": ["npx", "-y", "mcp-searxng"],
  "environment": {
    "SEARXNG_URL": "http://localhost:8080"
  },
  "enabled": true
}
```

**5. Test:**

```bash
curl -s "http://localhost:8080/search?q=test&format=json" | head -c 200
```

Should return JSON. If you get 403, the JSON format is not enabled (step 2). If you get connection refused, the container is not running.

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
