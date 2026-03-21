Before evaluating compression candidates, check if a DAG node is active (content exists after the most recent `next_step()` or `activate_plan()` call). The active node span includes all accumulated tool outputs, subagent results, file reads, and planning decisions since that call. Exclude that entire span from compression consideration. Only compress content that predates the most recent `next_step()` or `activate_plan()` call.

Evaluate the conversation for compressible ranges.

If any range is cleanly closed and unlikely to be needed again, use the compress tool on it.
If direction has shifted, compress earlier ranges that are now less relevant.

Prefer small, closed-range compressions over one broad compression.
The goal is to filter noise and distill key information so context accumulation stays under control.
Keep active context uncompressed.
