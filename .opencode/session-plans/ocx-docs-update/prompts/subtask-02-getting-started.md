<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02 — Rewrite docs/getting-started.md

## Objective

Replace the existing Install + Configure sections entirely with the OCX-based installation flow. The old instructions (git clone, symlink, copy) are gone. The new flow is: install OCX CLI → init global → add registry → choose and install a profile → launch with that profile. Update the API keys section to refer to the installed profile rather than a repo file.

## Scope

- **Edit:** `docs/getting-started.md`
- **No other files**

## Constraints

- The new install flow must match exactly (order matters):
  ```sh
  curl -fsSL https://ocx.kdco.dev/install.sh | sh
  ocx init --global
  ocx registry add https://ocx-registry.nagagroup.workers.dev --name naga-group --global
  ```
- Then profile install — show all three options so the user picks one:
  ```sh
  ocx profile add naga --global --source naga-group/ocx-default         # Anthropic
  ocx profile add naga-copilot --global --source naga-group/ocx-copilot # GitHub Copilot
  ocx profile add naga-free --global --source naga-group/ocx-free       # OpenCode Zen free-tier
  ```
- Then launch with the chosen profile:
  ```sh
  ocx oc -p naga         # or naga-copilot or naga-free
  ```
- Do NOT say "open-source" for naga-free — it uses OpenCode Zen free-tier models
- API keys section: update to say keys are needed for the model provider of the chosen profile; naga-free doesn't require API keys; naga-copilot requires a GitHub Copilot subscription; naga requires an Anthropic API key
- Keep the file short and scannable — this is a getting-started guide, not a reference

## Todolist

- [ ] Read current `docs/getting-started.md` to understand exact content before editing
- [ ] Rewrite Install section with OCX CLI install + init + registry add commands
- [ ] Rewrite Configure section as profile install (show all three options)
- [ ] Update Run section to use `ocx oc -p <profile-name>` instead of bare `opencode`
- [ ] Update API Keys section to describe what each profile requires
- [ ] Final read-through: confirm no git/symlink/copy references remain; all commands are correct

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `docs/getting-started.md`
- Goal: Full rewrite — OCX install flow replacing git clone/symlink/copy; three profile options; launch via `ocx oc -p <name>`; update API keys guidance per profile
- Constraints: Exact commands as specified; naga-free = OpenCode Zen free-tier (NOT open-source); naga-copilot = GitHub Copilot subscription; naga = Anthropic API key; keep it short and scannable
- Verify: No git/symlink/copy instructions remain; all three profile commands present; `ocx oc -p` launch shown; API keys section updated

## Advance

Call `next_step()` when this subtask is complete.
