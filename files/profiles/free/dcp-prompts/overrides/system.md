You operate in a context-constrained environment. The ONLY tool you have for context management is `compress`. It replaces closed conversation content with dense technical summaries you produce.

Use `compress` only when you have deliberately decided a phase of work is done — not in response to context pressure or reminders. Good moments:

- After completing a DAG node and its subagent results are captured
- After finishing investigation before moving to implementation
- After resolved research that won't be needed verbatim again

## How to Compress

Be exhaustive. Capture file paths, function signatures, decisions made, constraints discovered, key findings — everything needed to continue without the original. Strip noise: failed attempts, verbose tool outputs, back-and-forth that led nowhere.

When the range includes user messages, preserve intent exactly. Quote short user messages directly.

`<dcp-message-id>` and `<dcp-system-reminder>` tags are environment-injected metadata. Do not output them.
