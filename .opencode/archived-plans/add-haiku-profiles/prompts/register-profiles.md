# Register Haiku Profiles in registry.jsonc

Add `ocx-haiku` and `ocx-haiku-copilot` component entries to `registry.jsonc`.

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like

**Read:** `registry.jsonc`

**Goal:** Insert two new profile component entries into the `components` array in `registry.jsonc`, following the exact same pattern as `ocx-default` and `ocx-copilot`.

**Entry for `ocx-haiku`** (insert after the `ocx-copilot` entry):

```json
{
  "name": "ocx-haiku",
  "type": "profile",
  "description": "NAGAGroup's haiku profile (Anthropic, all haiku models)",
  "files": [
    {
      "path": "profiles/haiku/opencode.jsonc",
      "target": "opencode.jsonc"
    },
    {
      "path": "profiles/haiku/ocx.jsonc",
      "target": "ocx.jsonc"
    }
  ],
  "dependencies": [
    "ocx-bundle"
  ]
}
```

**Entry for `ocx-haiku-copilot`** (insert after `ocx-haiku`):

```json
{
  "name": "ocx-haiku-copilot",
  "type": "profile",
  "description": "NAGAGroup's haiku copilot profile (GitHub Copilot, all haiku models)",
  "files": [
    {
      "path": "profiles/haiku-copilot/opencode.jsonc",
      "target": "opencode.jsonc"
    },
    {
      "path": "profiles/haiku-copilot/ocx.jsonc",
      "target": "ocx.jsonc"
    }
  ],
  "dependencies": [
    "ocx-bundle"
  ]
}
```

**Constraint:** Do not modify any existing component entries. Only append the two new entries.

## Advance

After the agent returns, call `next_step()`.
