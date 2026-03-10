# Subtask 02 — remove-subagent

## Delegation
**Agent:** @DocWriter
**Model:** fast (haiku) — mechanical deletions, no judgment needed

## Objective
Remove the now-superseded subagent definition and clean up its model config entry.

1. Delete `opencode/agents/subagents/agent-delegation-expert.md`
2. Remove the `"subagents/agent-delegation-expert"` key from the `agent` object in `opencode/opencode.json`

## Todolist
- [ ] Delete `opencode/agents/subagents/agent-delegation-expert.md`
- [ ] Remove `"subagents/agent-delegation-expert": { "model": "opencode/gemini-3-flash" }` entry from `opencode/opencode.json`
- [ ] Verify `opencode/opencode.json` is still valid JSON after removal

## Scope
**Delete:**
- `opencode/agents/subagents/agent-delegation-expert.md`

**Edit:**
- `opencode/opencode.json` — remove `subagents/agent-delegation-expert` model entry only

**Do not touch anything else.**

## Patterns & Constraints
- `opencode/opencode.json` — remove only the `subagents/agent-delegation-expert` key; leave all other agent entries untouched
- Verify JSON is valid after edit (no trailing commas, etc.)

---

## Checkpoint
After completing this subtask:
1. WIP commit: `git add -A && git commit -m "wip: subtask-02 — remove agent-delegation-expert subagent and opencode.json entry"`
2. Update `index.md` subtask table: mark 02 ✅ completed, mark 03 as next
3. Update `spec.json`: `currentSubtask` → 3, subtask 02 status → `completed`
4. Update session summary todo
5. Write notes if any issues encountered
6. No gate — proceed to subtask 03
