<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session: compaction-hook

## Goal

Add an `experimental.session.compacting` plugin hook to `PlanningEnforcementPlugin` so that when OpenCode fires auto-compaction, the current DAG node's prompt is injected into the compaction context, enabling HeadWrench to re-align after the lossy compaction event. Then document the behavior in HW's agent prompt.

## Context

OpenCode's compaction is triggered automatically when token usage hits ~80-85% of usable context. It is lossy — the compaction LLM summarizes conversation history, discarding most detail. The system prompt is emptied during compaction, so AGENTS.md/Claude.md are not visible to the compaction LLM. The only available plugin hook is `experimental.session.compacting`, which allows injecting strings into `output.context` and/or replacing `output.prompt`.

The strategy: when compaction fires, read the active dag-state file for the session, resolve the current node's prompt, and push it into `output.context` with a re-alignment prefix. This ensures the compaction LLM preserves the current task node's instructions in its summary, so HW surfaces from compaction with enough context to continue.

## Subtasks

1. **subtask-01 — Implement compaction hook** — Add `experimental.session.compacting` handler to `planning-enforcement.ts`
2. **subtask-02 — Document compaction behavior** — Add a short section to `opencode/agents/headwrench.md` explaining the hook and post-compaction recovery

## Gates & Loops

None — linear execution, no gates.

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
