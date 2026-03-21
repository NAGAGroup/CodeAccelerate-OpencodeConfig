# Finalize: Add Haiku Profiles

## What Was Accomplished

Two new OpenCode profiles have been added to the Naga Group OCX registry:

- **`ocx-haiku`** — Anthropic provider, all 7 agents on `anthropic/claude-haiku-4-5`
- **`ocx-haiku-copilot`** — GitHub Copilot provider, all 7 agents on `github-copilot/claude-haiku-4.5`

Both profiles are identical to their source profiles (`ocx-default` and `ocx-copilot`) in every way except model selection: headwrench and context-insurgent now use haiku instead of sonnet.

## Memory Update

Persist to memory:

```
Entity: Naga Group OCX Registry
Add observation: "Added ocx-haiku (Anthropic all-haiku) and ocx-haiku-copilot (GitHub Copilot all-haiku) profiles on 2026-03-21. Both mirror default/copilot profiles with headwrench and context-insurgent downgraded from sonnet to haiku."
```

## Close

Call `close_session()`.
