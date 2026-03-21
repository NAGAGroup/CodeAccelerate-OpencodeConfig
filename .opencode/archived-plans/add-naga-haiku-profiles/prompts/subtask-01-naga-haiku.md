<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 1: Create naga-haiku profile files

## Objective

Create the naga-haiku profile directory with both config files. All agents use `anthropic/claude-haiku-4-5`.

## Scope

**Write:**
- `files/profiles/naga-haiku/ocx.jsonc`
- `files/profiles/naga-haiku/opencode.jsonc`

## Constraints

- Follow the exact same structure as `files/profiles/default/ocx.jsonc`
- Use `anthropic/claude-haiku-4-5` for ALL agents in opencode.jsonc (including headwrench and context-insurgent)
- Model identifier format: `anthropic/claude-haiku-4-5` (with dashes, not dots)

## Todolist

- [ ] Create `files/profiles/naga-haiku/` directory
- [ ] Write `ocx.jsonc` (copy structure from default profile)
- [ ] Write `opencode.jsonc` with all agents set to `anthropic/claude-haiku-4-5`

## Delegation

**Agent:** HW (direct)
**Reason:** New file writes following clear existing pattern

## Advance

Call `next_step()` when this subtask is complete.
