# DCP Prompt Defaults

This directory stores the DCP prompts.
Each prompt file here should contain plain text only (no XML wrappers).

## Creating Overrides

1. Copy a prompt file from this directory into an overrides directory using the same filename.
2. Edit the copied file using plain text.
3. Restart OpenCode.

To reset an override, delete the matching file from your overrides directory.

Do not edit the default prompt files directly, they are just for reference, only files in the overrides directory are used.

Override precedence (highest first):
1. `.opencode/dcp-prompts/overrides/` (project)
2. `$OPENCODE_CONFIG_DIR/dcp-prompts/overrides/` (config dir)
3. `~/.config/opencode/dcp-prompts/overrides/` (global)

## Prompt Files

- `system.md`
  - Purpose: Core system-level DCP instruction block.
  - Runtime use: Injected into the model system prompt on every request.
- `compress.md`
  - Purpose: compress tool instructions and summary constraints.
  - Runtime use: Registered as the compress tool description.
- `context-limit-nudge.md`
  - Purpose: High-priority nudge when context is over max threshold.
  - Runtime use: Injected when context usage is beyond configured max limits.
- `turn-nudge.md`
  - Purpose: Nudge to compress closed ranges at turn boundaries.
  - Runtime use: Injected when context is between min and max limits at a new user turn.
- `iteration-nudge.md`
  - Purpose: Nudge after many iterations without user input.
  - Runtime use: Injected when iteration threshold is crossed.
