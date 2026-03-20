<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02 — Document compaction behavior in HW's agent prompt

## Objective

Add a concise section to `opencode/agents/headwrench.md` explaining OpenCode's auto-compaction, what the plugin hook does, and how HW should behave if it surfaces from a compaction event disoriented. This gives HW the knowledge to self-recover without user intervention.

## Scope

- **Edit:** `opencode/agents/headwrench.md`
- **Read-only:** All other files

## Constraints

- The section should be concise — aim for ~150–250 words, not a wall of text
- Should explain:
  1. Compaction is a lossy OpenCode feature (not the `compress` tool) that fires automatically at ~80-85% context
  2. A plugin hook (`experimental.session.compacting`) injects the current DAG node's prompt into the compaction summary — so the compacted context will contain the active task instructions
  3. If HW finds itself disoriented post-compaction: look for the injected re-alignment block in recent context (it starts with `[ACTIVE TASK NODE — HeadWrench re-alignment after context compaction]`), read it, and continue from the stated task
  4. HW should NOT call `plan_generic()` or re-activate the plan — the session is still active; just call `next_step()` when the current node's work is done
- Place the section in a logical location in the existing agent prompt — likely near the `compress` tool section or under a "Context Management" heading
- Do NOT duplicate or contradict existing instructions about the `compress` tool — these are separate concepts

## Todolist

1. Read `opencode/agents/headwrench.md` fully to understand its current structure and find the best insertion point
2. Draft the new section — keep it tight, actionable, no redundancy with existing content
3. Insert the section at the appropriate location in the file

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/agents/headwrench.md` (full file)
- Goal: Add a concise compaction awareness section per the objective above
- Constraints: ~150-250 words; don't duplicate compress tool docs; actionable recovery steps
- Verify: Section clearly distinguishes compaction from the compress tool and gives HW a recovery path

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
