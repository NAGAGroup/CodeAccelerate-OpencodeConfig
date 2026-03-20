# Subtask 05 — slash-commands

## Delegation
**Agent:** @session-local-implementer (config-implementer)  
**Reason:** Creating 4 new command files and adding a section to headwrench.md.

## Objective
Create 4 checkpoint primitive slash command files (/save, /restore, /resume, /status) in `~/.config/opencode/commands/` and add a ## Slash Commands section to headwrench.md documenting their behavior and the v0.6.4 model field bug.

## Todolist
- Read the existing commands in `~/.config/opencode/commands/` (glob to see what's there, read a few for format reference)
- Read the relevant sections of `~/.config/opencode/agents/headwrench.md` to understand where to add the new section
- Write `~/.config/opencode/commands/save.md`
- Write `~/.config/opencode/commands/restore.md`
- Write `~/.config/opencode/commands/resume.md`
- Write `~/.config/opencode/commands/status.md`
- Edit `~/.config/opencode/agents/headwrench.md` to add ## Slash Commands section

## Scope
**Write:**
- `~/.config/opencode/commands/save.md` (new)
- `~/.config/opencode/commands/restore.md` (new)
- `~/.config/opencode/commands/resume.md` (new)
- `~/.config/opencode/commands/status.md` (new)

**Edit:**
- `~/.config/opencode/agents/headwrench.md` (add ## Slash Commands section only)

**Excluded:** All other files. Do not modify any existing command files. Do not touch protocols, skills, or session files.

## Patterns
- Command file YAML frontmatter structure (follow existing command files as reference):
  ```yaml
  ---
  description: "One-sentence description of what this command does"
  ---
  ```
  Note: `model:` field is intentionally OMITTED from frontmatter — it is bugged in v0.6.4 (silently ignored). Specify model instructions in command body if needed.

- /save command behavior:
  - Accept optional label argument (default: "checkpoint")
  - Instruct HW to: `git add -A && git commit -m "checkpoint: {label}"`
  - Then write checkpoint entry to spec.json last_checkpoint field
  - Confirm to user with commit hash

- /restore command behavior:
  - Accept required label or commit hash argument
  - Instruct HW to: confirm with user ("This will reset working state to checkpoint {label}. Confirm?")
  - On confirmation: `git checkout {commit-hash} -- .` (soft restore, not full reset)
  - Warn user that unstaged changes will be overwritten

- /resume command behavior:
  - No arguments
  - Instruct HW to: read spec.json from active session, determine currentSubtask, load that subtask file, rebuild todo stack, and continue from where work left off
  - If no active session found, surface error and list available sessions

- /status command behavior:
  - No arguments
  - Instruct HW to display:
    - Active session name and goal
    - Current subtask (number + description)
    - Circuit breaker state (CLOSED / OPEN / HALF-OPEN) and consecutive failure count
    - Last checkpoint timestamp (from spec.json last_checkpoint)
    - Next pending subtask

- headwrench.md ## Slash Commands section:
  - Place after the "What You Don't Do" section (near end of agent file)
  - Document the 4 commands: /save, /restore, /resume, /status
  - Include v0.6.4 model field bug note: "The `model:` field in slash command YAML frontmatter is ignored in OpenCode v0.6.4. To route a command to a specific model, specify model instructions in the command body text."
  - Keep section concise (reference the command files for full behavior; don't duplicate everything)

## Constraints
- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT modify any existing command files — only create new ones.
- Do NOT restructure headwrench.md; only add the new ## Slash Commands section.
- Command bodies should be written as clear instructions to HeadWrench (first person: "Read spec.json...", "Run git add -A...")
- /restore must include a user confirmation step — it is a destructive operation.

## Success Criteria
- Four new command files exist in `~/.config/opencode/commands/`: save.md, restore.md, resume.md, status.md
- Each has valid YAML frontmatter with description field (no model field)
- Each command body clearly instructs HeadWrench on the exact steps to take
- headwrench.md contains a ## Slash Commands section documenting all 4 commands and the v0.6.4 model field bug

## Context Files
- `~/.config/opencode/commands/` — read existing files for format reference
- `~/.config/opencode/agents/headwrench.md` — add section to this file

---
*Checkpoint: WIP commit after this subtask completes. Circuit breaker threshold: 3.*
