<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 2: Create naga-haiku-pilot profile files

## Objective

Create the naga-haiku-pilot profile directory with both config files. All agents use `github-copilot/claude-haiku-4.5`.

## Scope

**Write:**
- `files/profiles/naga-haiku-pilot/ocx.jsonc`
- `files/profiles/naga-haiku-pilot/opencode.jsonc`

## Constraints

- Follow the exact same structure as `files/profiles/copilot/ocx.jsonc`
- Use `github-copilot/claude-haiku-4.5` for ALL agents in opencode.jsonc (including headwrench and context-insurgent)
- Model identifier format: `github-copilot/claude-haiku-4.5` (with dots, not dashes)

## Todolist

- [ ] Create `files/profiles/naga-haiku-pilot/` directory
- [ ] Write `ocx.jsonc` (copy structure from copilot profile)
- [ ] Write `opencode.jsonc` with all agents set to `github-copilot/claude-haiku-4.5`

## Delegation

**Agent:** HW (direct)
**Reason:** New file writes following clear existing pattern

## Advance

Call `next_step()` when this subtask is complete.
