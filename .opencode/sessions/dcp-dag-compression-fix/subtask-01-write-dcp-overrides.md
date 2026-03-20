# Subtask 01 — Write DCP Prompt Override Files

## Objective

Create `opencode/dcp-prompts/overrides/` and write 4 override files that add DAG-node compression protection to the DCP prompt system. The core rule: `next_step()` calls are compression boundary markers. Content generated after the most recent `next_step()` call is the active node and is off-limits for compression until `next_step()` is called again. Content before the most recent `next_step()` call is eligible for compression as usual.

This replaces the pattern-matching approach (looking for `# Node:` headings) with a simpler, more robust boundary rule based on tool calls.

## Scope

**Write (new files):**
- `opencode/dcp-prompts/overrides/system.md`
- `opencode/dcp-prompts/overrides/turn-nudge.md`
- `opencode/dcp-prompts/overrides/iteration-nudge.md`
- `opencode/dcp-prompts/overrides/context-limit-nudge.md`

**Read (reference for content):**
- `opencode/dcp-prompts/defaults/system.md`
- `opencode/dcp-prompts/defaults/turn-nudge.md`
- `opencode/dcp-prompts/defaults/iteration-nudge.md`
- `opencode/dcp-prompts/defaults/context-limit-nudge.md`

**Excluded:** `dcp.jsonc`, any files outside `opencode/dcp-prompts/`

## Constraints

- Each override file must preserve all existing behavior from the corresponding default — only ADD the DAG boundary rule, do not remove or weaken existing instructions
- The DAG boundary rule must be stated clearly and placed prominently (near the top of each file, before the "evaluate for compression" directive)
- The rule: "Do not compress any content that occurred after the most recent `next_step()` call. That span is the active DAG node. Wait until the next `next_step()` or `close_session()` call before treating any of that content as eligible for compression."
- For `context-limit-nudge.md` specifically: the DAG boundary rule must be stated as a hard exception even under emergency conditions — the active node span must never be compressed even when context is at limit
- Do NOT create a `README.md` or any documentation file in the overrides directory

## Todolist

- [ ] Read all 4 default prompt files to understand exact current wording
- [ ] Create `opencode/dcp-prompts/overrides/` directory
- [ ] Write `overrides/system.md` — add DAG boundary rule to the DO NOT COMPRESS section
- [ ] Write `overrides/turn-nudge.md` — add DAG guard check before "evaluate for compressible ranges"
- [ ] Write `overrides/iteration-nudge.md` — add DAG guard check before compression suggestion
- [ ] Write `overrides/context-limit-nudge.md` — add DAG boundary as hard exception in emergency mode
- [ ] Verify all 4 files are written and paths match the override precedence documented in `defaults/README.md`

## Delegation

**Agent:** @QuickDoc (parallel × 4)
**Model:** haiku-like
**Prompt structure (per agent):**

Agent A — `overrides/system.md`:
- Read: `opencode/dcp-prompts/defaults/system.md`
- Goal: Write `opencode/dcp-prompts/overrides/system.md` that preserves all default content and adds a DAG boundary rule to the DO NOT COMPRESS section: "Do not compress any content after the most recent `next_step()` call — that span is the active DAG node. Wait for `next_step()` or `close_session()` before treating it as eligible."
- Constraints: Do not remove or weaken any existing rules. Add the DAG rule as an additional bullet in the DO NOT COMPRESS block.
- Verify: File exists, contains the DAG rule, preserves all original content.

Agent B — `overrides/turn-nudge.md`:
- Read: `opencode/dcp-prompts/defaults/turn-nudge.md`
- Goal: Write `opencode/dcp-prompts/overrides/turn-nudge.md` that adds a guard at the top: "Before evaluating compression candidates, check if a DAG node is active (content exists after the most recent `next_step()` call). If so, exclude that span entirely from compression consideration."
- Constraints: Preserve all original content below the guard. Keep the guard brief and unambiguous.
- Verify: File exists, guard appears before the main nudge body.

Agent C — `overrides/iteration-nudge.md`:
- Read: `opencode/dcp-prompts/defaults/iteration-nudge.md`
- Goal: Write `opencode/dcp-prompts/overrides/iteration-nudge.md` with the same DAG guard as turn-nudge: active node span is off-limits for compression.
- Constraints: Same as turn-nudge — preserve original body, add guard at top.
- Verify: File exists, guard appears before the main nudge body.

Agent D — `overrides/context-limit-nudge.md`:
- Read: `opencode/dcp-prompts/defaults/context-limit-nudge.md`
- Goal: Write `opencode/dcp-prompts/overrides/context-limit-nudge.md` that adds a hard exception: "Even in emergency mode, do NOT compress the active DAG node span (content after the most recent `next_step()` call). Compress from older, resolved history only — never the current node."
- Constraints: This is the most critical override. The exception must be stated clearly and placed at or near the top, before the "compress immediately" directive. Do not soften the emergency urgency — just carve out the active node as a protected zone.
- Verify: File exists, exception is clearly stated before the main emergency directive.
