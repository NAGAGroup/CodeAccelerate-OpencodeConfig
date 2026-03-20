Before suggesting compression, check if a DAG node is active. The active node span includes all content accumulated since the most recent `next_step()` (or `activate_plan`) call — prompt injection, tool outputs, subagent results, file reads, and planning decisions. Exclude that entire span from compression consideration. Only compress content that predates the most recent `next_step()` or `activate_plan` call.

You've been iterating for a while after the last user message.

If there is a closed portion that is unlikely to be referenced immediately (for example, finished research before implementation), use the compress tool on it now.

Prefer multiple short, closed ranges over one large range when several independent slices are ready.
