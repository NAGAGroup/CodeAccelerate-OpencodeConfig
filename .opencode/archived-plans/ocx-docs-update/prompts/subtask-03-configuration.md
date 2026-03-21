<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03 — Update docs/configuration.md

## Objective

Update the file path references throughout the doc to reflect the OCX profile installation path. The old path (`~/.config/opencode/opencode.json`) is stale. The correct path post-install is `~/.config/opencode/profiles/<name>/opencode.jsonc` (where `<name>` is the profile the user installed: `naga`, `naga-copilot`, or `naga-free`). Update the opening description to reflect that customization means editing the installed profile files directly.

## Scope

- **Edit:** `docs/configuration.md`
- **No other files**

## Constraints

- Old path: `~/.config/opencode/opencode.json` → New path: `~/.config/opencode/profiles/<name>/opencode.jsonc`
- The file extension changes too: `.json` → `.jsonc`
- The opening paragraph currently says "If you followed the setup guide, this file is at `~/.config/opencode/opencode.json` — which is the `opencode/opencode.json` file from this repository." This needs to be rewritten: users no longer interact with the repository file. They edit the installed profile file directly at the path above.
- The model assignments, MCP servers, and agent enable/disable sections are still accurate in content — only path references and the opening framing need updating
- Keep the same structure (Model Assignments, MCP Servers, Enabling and Disabling Agents sections)
- Keep the JSON/JSONC code examples — they remain accurate; only prose path references change

## Todolist

- [ ] Read current `docs/configuration.md` to identify all stale path references
- [ ] Rewrite the opening paragraph to describe post-install direct editing of `~/.config/opencode/profiles/<name>/opencode.jsonc`
- [ ] Update any inline path references from `~/.config/opencode/opencode.json` to `~/.config/opencode/profiles/<name>/opencode.jsonc`
- [ ] Check for any references to "this repository" or "the repo" and update them
- [ ] Verify code block examples are still accurate (they should be — just prose paths change)
- [ ] Final read-through: confirm all path references are correct and the doc is coherent

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `docs/configuration.md`
- Goal: Update opening paragraph and all path references; old path `~/.config/opencode/opencode.json` → new path `~/.config/opencode/profiles/<name>/opencode.jsonc`; update framing to "edit installed profile files directly"
- Constraints: Keep structure and code examples intact; only prose paths and opening description change; extension also changes from .json to .jsonc
- Verify: No references to `opencode.json` (without the `c`) remain; opening paragraph accurately describes post-install customization; no "this repository" references

## Advance

Call `next_step()` when this subtask is complete.
