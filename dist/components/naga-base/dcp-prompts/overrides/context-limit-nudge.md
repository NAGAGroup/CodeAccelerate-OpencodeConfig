CRITICAL WARNING: MAX CONTEXT LIMIT REACHED

You are at or beyond the configured max context threshold. This is an emergency context-recovery moment.

PROTECTED ZONE — DAG ACTIVE NODE
Even in emergency mode, do NOT compress the active DAG node span (all content after the most recent `next_step()` call, including all tool outputs, file reads, subagent results, and planning decisions accumulated since that step). This is a hard exception with no override. Compress from older, resolved history only — never the current node. If the only remaining content is the active node, do not compress at all.

Compression is strongly recommended at this point. Consider pausing exploration to compress context, but your judgment still applies — prioritize completing any atomic operation that's underway.

If you are in the middle of a critical atomic operation, finish that atomic step first, then consider compression.

RANGE STRATEGY
Prioritize one large, closed, high-yield compression range first.
At context limit, larger single ranges are generally preferable to many small ones, though trade-offs in summary quality should still guide your choice.
Only split into multiple compressions if one large range would reduce summary quality or make boundary selection unsafe.

RANGE SELECTION
Start from older, resolved history and capture as much stale context as safely possible in one pass.
Avoid the newest active working slice unless it is clearly closed.
Use visible injected boundary IDs for compression (`mNNNN` for messages, `bN` for compressed blocks), and ensure `startId` appears before `endId`.

SUMMARY REQUIREMENTS
Your summary must cover all essential details from the selected range so work can continue without reopening raw messages.
If the compressed range includes user messages, preserve user intent exactly. Prefer direct quotes for short user messages to avoid semantic drift.
