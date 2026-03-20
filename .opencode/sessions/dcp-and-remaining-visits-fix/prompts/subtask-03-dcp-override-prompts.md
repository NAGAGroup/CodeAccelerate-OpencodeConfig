<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03 — Fix DCP Override Prompts

## Objective

The four DCP override prompt files in `opencode/dcp-prompts/overrides/` currently protect content after the most recent `next_step()` call, but the `context-limit-nudge.md` has coercive "MANDATORY — compress now" framing that was overriding judgment and causing mid-operation compression. Additionally, the protection rule needs to cover all tool outputs accumulated during the active node, not just the injected node prompt text. Update all four files to strengthen the protection rule and remove the coercive framing.

## Scope

- **Edit:** `opencode/dcp-prompts/overrides/system.md`
- **Edit:** `opencode/dcp-prompts/overrides/turn-nudge.md`
- **Edit:** `opencode/dcp-prompts/overrides/iteration-nudge.md`
- **Edit:** `opencode/dcp-prompts/overrides/context-limit-nudge.md`
- **Excluded:** `opencode/dcp-prompts/defaults/` (reference only, do not touch)

## Constraints

- The DAG protection rule in all files must now read: content generated **between** the two most recent `next_step()` (or `activate_plan`) calls is the active node span and is off-limits for compression.
- `context-limit-nudge.md`: Remove or substantially soften the "MANDATORY — you MUST use the compress tool now" framing. Replace with guidance that compression should be considered but the DAG active node span is still a hard exception. Do not instruct the model to compress before completing atomic operations.
- `system.md`: Add explicit examples of what is off-limits during an active node: file reads, scout results, planning decisions, tool outputs accumulated since the last `next_step()` call.
- `turn-nudge.md` and `iteration-nudge.md`: Ensure the DAG guard check mentions tool outputs, not just the node prompt injection.
- Preserve the core compression philosophy in all files — this is about tightening the protection boundary, not disabling compression.

## Todolist

- [ ] Read all four current override files
- [ ] Update `system.md` — strengthen active-node protection to cover all tool outputs since last `next_step()`
- [ ] Update `turn-nudge.md` — update DAG guard to mention tool outputs
- [ ] Update `iteration-nudge.md` — same as turn-nudge
- [ ] Update `context-limit-nudge.md` — remove/soften MANDATORY framing; preserve hard DAG exception

## Delegation

**Agent:** @QuickDoc ×4 (parallel)
**Model:** haiku-like
**Prompt structure:**
- Read each file before editing
- Goal: Strengthen DAG active-node protection; remove coercive MANDATORY framing from context-limit-nudge
- Constraints: Preserve compression philosophy; only tighten the protection boundary
- Verify: All four files updated; no MANDATORY language in context-limit-nudge

## Advance

Call `next_step()` when this subtask is complete.
