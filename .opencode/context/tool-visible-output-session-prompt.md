---
topic: tool-visible-output
tier: 3
promoted_from: inbox
session: mermaid-tool-plugin
created: 2026-03-10
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
active: true
---

# Pattern: Inject visible output from a tool using session.prompt noReply

When a tool needs to display output visibly to the user (not just as a hidden tool result):

```typescript
await ctx.client.session.prompt({
  path: { id: context.sessionID },
  body: {
    noReply: true,
    parts: [{ type: 'text', text: outputString }]
  }
})
```

- `context.sessionID` is the second arg (`ToolContext`) to `execute`
- `noReply: true` inserts the message without triggering a new AI turn
- The message is permanently in session history (not prunable)
- `tui.submitPrompt()` does NOT work during active tool execution (it's a no-op)

Source: mermaid-tool-plugin session, 2026-03-10
