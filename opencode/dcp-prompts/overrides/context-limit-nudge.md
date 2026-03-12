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
- Proceed with the standard large-range strategy below.

RANGE STRATEGY (MANDATORY)
Prioritize one large, closed, high-yield compression range first.
This overrides the normal preference for many small compressions.
Only split into multiple compressions if one large range would reduce summary quality or make boundary selection unsafe.

RANGE SELECTION
Start from older, resolved history and capture as much stale context as safely possible in one pass.
Avoid the newest active working slice unless it is clearly closed.
Use visible injected boundary IDs for compression (`mNNNN` for messages, `bN` for compressed blocks), and ensure `startId` appears before `endId`.

SUMMARY REQUIREMENTS
Your summary must cover all essential details from the selected range so work can continue without reopening raw messages.
If the compressed range includes user messages, preserve user intent exactly. Prefer direct quotes for short user messages to avoid semantic drift.
If the compressed range includes a completed subtask file read, include its ## Scope, ## Constraints, and ## Objective sections verbatim.
