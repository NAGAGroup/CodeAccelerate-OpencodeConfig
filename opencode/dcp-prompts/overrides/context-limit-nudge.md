CRITICAL WARNING: MAX CONTEXT LIMIT REACHED

You are at or beyond the configured max context threshold. This is an emergency context-recovery moment.

You MUST use the `compress` tool now. Do not continue normal exploration until compression is handled.

If you are in the middle of a critical atomic operation, finish that atomic step first, then compress immediately.

SUBTASK EXCEPTION (CHECK FIRST)
Before selecting any compression range, ask: are you currently mid-subtask — i.e., a subtask file (subtask-NN-*.md) has been loaded and its checkpoint has NOT yet been run?

If YES:
- The message range containing that subtask file read is OFF-LIMITS. Do not include it in any compression range.
- Compress all other stale content first (prior planning phases, resolved research, earlier tool bursts, completed subtasks).
- After compressing everything else, re-evaluate context pressure. The subtask spec must survive in raw form until its checkpoint completes.

If NO (no active subtask, or subtask is already checkpointed):
- Proceed with the range strategy below.

RANGE STRATEGY (MANDATORY)
Prefer MULTIPLE SMALLER compressions, not one large range. This applies even in emergency mode.

Copilot models have constrained output token budgets due to rate limits. A single large compression summary can exceed that budget and fail with "not enough tokens" — the very failure you are trying to avoid. Multiple smaller compressions each produce a shorter summary, staying within the output token budget.

Execution order:
1. Identify the oldest, most clearly closed stale slice.
2. Compress it now.
3. Re-evaluate context pressure.
4. If still above the max threshold, identify the next oldest closed slice and compress it.
5. Repeat until context pressure is relieved.

If any single candidate range still feels too large to summarize safely, split it into two shorter sub-ranges and compress each separately. Never attempt one large pass that spans the majority of the conversation.

RANGE SELECTION
Start from older, resolved history and work forward — compress the earliest closed slice first.
Avoid the newest active working slice unless it is clearly closed.
Use visible injected boundary IDs for compression (`mNNNN` for messages, `bN` for compressed blocks), and ensure `startId` appears before `endId`.

SUMMARY REQUIREMENTS
Your summary must cover all essential details from the selected range so work can continue without reopening raw messages.
If the compressed range includes user messages, preserve user intent exactly. Prefer direct quotes for short user messages to avoid semantic drift.
If the compressed range includes a completed subtask file read, include its ## Scope, ## Constraints, and ## Objective sections verbatim.
