---
topic: exa-mcp-must-be-enabled
tier: local
promoted_from: inbox
session: opencode-config-audit
created: 2026-03-13
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
---

# exa MCP Must Be Enabled

The exa MCP in `opencode/opencode.json` must be set to `"enabled": true`. DeepResearcher depends on exa tools and cannot function without them.

**Note**: exa requires an `EXA_API_KEY` environment variable. This is a user-setup prerequisite, not a reason to disable the MCP by default in the config. If the key is missing, the MCP will fail gracefully; disabling it in config entirely breaks DeepResearcher by design.
