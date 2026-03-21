<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 3: Register profiles in registry.jsonc

## Objective

Add both new profiles as components in the registry manifest.

## Scope

**Edit:**
- `registry.jsonc`

## Constraints

- Read the existing profile entries (ocx-default, ocx-copilot, ocx-free) to understand the exact format
- Add `ocx-naga-haiku` component with files mapping to `profiles/naga-haiku/opencode.jsonc` -> `opencode.jsonc` and `profiles/naga-haiku/ocx.jsonc` -> `ocx.jsonc`
- Add `ocx-naga-haiku-pilot` component with files mapping to `profiles/naga-haiku-pilot/opencode.jsonc` -> `opencode.jsonc` and `profiles/naga-haiku-pilot/ocx.jsonc` -> `ocx.jsonc`
- Include `ocx-bundle` as a dependency for both

## Todolist

- [ ] Read `registry.jsonc` to understand existing profile registration format
- [ ] Add `ocx-naga-haiku` component entry
- [ ] Add `ocx-naga-haiku-pilot` component entry

## Delegation

**Agent:** HW (direct)
**Reason:** Edit to existing registry manifest file requiring read + append

## Advance

Call `next_step()` when this subtask is complete.
