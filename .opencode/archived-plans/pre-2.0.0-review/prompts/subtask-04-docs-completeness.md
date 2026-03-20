<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04 — Docs completeness pass

## Objective

During the audit, `docs/configuration.md` references a `compaction` agent in the model-tier table, but it's unclear whether `docs/agents.md` documents this agent. Verify coverage and scan for any other gaps between the config and the docs. Report findings; do not write anything — this is a read-only verification pass. HW will decide what (if any) follow-up edits are needed based on the report.

## Scope

- **Read:** `docs/agents.md`
- **Read:** `docs/configuration.md`
- **Excluded:** All other files

## Constraints

- Read-only — do not edit any files
- Report exactly what you find: whether `compaction` is documented, and any other agent/config entries that appear in one file but not the other
- Keep the report concise: a short table or bullet list is sufficient

## Todolist

- [ ] Read `docs/agents.md` — list all agents documented
- [ ] Read `docs/configuration.md` — list all agents mentioned in the tier table
- [ ] Cross-check: identify any agents in configuration.md not covered in agents.md (and vice versa)
- [ ] Report findings back to HW

## Delegation

**Agent:** @ContextScout | **Tier:** haiku | Read-only verification scan across 2 files.

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
