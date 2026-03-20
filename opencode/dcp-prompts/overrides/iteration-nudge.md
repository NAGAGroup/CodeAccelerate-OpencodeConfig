Before suggesting compression, check if a DAG node is active (content exists after the most recent `next_step()` call). If so, exclude that span entirely from compression consideration. Only compress content that predates the most recent `next_step()` call.

You've been iterating for a while after the last user message.

If there is a closed portion that is unlikely to be referenced immediately (for example, finished research before implementation), use the compress tool on it now.

Prefer multiple short, closed ranges over one large range when several independent slices are ready.
