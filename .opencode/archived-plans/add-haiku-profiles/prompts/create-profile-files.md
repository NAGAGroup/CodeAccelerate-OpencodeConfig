# Create Haiku Profile Files

Create the `opencode.jsonc` and `ocx.jsonc` files for both new haiku profiles.

## Delegation

**Agent:** @JuniorDev (parallel × 2)
**Model:** haiku-like

Dispatch both agents simultaneously in a single response. Wait for both to return before calling `next_step()`.

---

## Agent 1: Create `files/profiles/haiku/`

**Read:** `files/profiles/default/opencode.jsonc`, `files/profiles/default/ocx.jsonc`

**Goal:** Create `files/profiles/haiku/opencode.jsonc` and `files/profiles/haiku/ocx.jsonc`.

**`opencode.jsonc`:** Copy `files/profiles/default/opencode.jsonc` exactly, but change **every** agent `model` value to `anthropic/claude-haiku-4-5`. This means:
- `headwrench`: `anthropic/claude-sonnet-4-6` → `anthropic/claude-haiku-4-5`
- `context-insurgent`: `anthropic/claude-sonnet-4-6` → `anthropic/claude-haiku-4-5`
- All other agents (`context-scout`, `quick-doc`, `junior-dev`, `deep-researcher`, `compaction`) are already on haiku — keep them unchanged

**`ocx.jsonc`:** Identical copy of `files/profiles/default/ocx.jsonc` — no changes.

**Constraint:** Do not create an `AGENTS.md` or any other file in this directory. Only `opencode.jsonc` and `ocx.jsonc`.

---

## Agent 2: Create `files/profiles/haiku-copilot/`

**Read:** `files/profiles/copilot/opencode.jsonc`, `files/profiles/copilot/ocx.jsonc`

**Goal:** Create `files/profiles/haiku-copilot/opencode.jsonc` and `files/profiles/haiku-copilot/ocx.jsonc`.

**`opencode.jsonc`:** Copy `files/profiles/copilot/opencode.jsonc` exactly, but change **every** agent `model` value to `github-copilot/claude-haiku-4.5`. This means:
- `headwrench`: `github-copilot/claude-sonnet-4.6` → `github-copilot/claude-haiku-4.5`
- `context-insurgent`: `github-copilot/claude-sonnet-4.6` → `github-copilot/claude-haiku-4.5`
- All other agents (`context-scout`, `quick-doc`, `junior-dev`, `deep-researcher`, `compaction`) are already on haiku — keep them unchanged

**`ocx.jsonc`:** Identical copy of `files/profiles/copilot/ocx.jsonc` — no changes.

**Constraint:** Do not create an `AGENTS.md` or any other file in this directory. Only `opencode.jsonc` and `ocx.jsonc`.

---

## Advance

After both agents return and all 4 files exist, call `next_step()`.
