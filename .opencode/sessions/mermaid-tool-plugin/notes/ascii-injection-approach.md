# Note: ASCII Diagram Injection via session.prompt

## Date: 2026-03-10

## Context

The `render_mermaid` tool needed to make ASCII output visible to the user in the
OpenCode chat, not just return it as a hidden tool result.

## Approaches Tried

### Approach 1: tui.appendPrompt + tui.submitPrompt (FAILED)
- `ctx.client.tui.appendPrompt({ body: { text } })` successfully pre-filled the input box
- `ctx.client.tui.submitPrompt()` was a no-op when called during active tool execution
- Hypothesis: submitPrompt cannot fire a new turn while the current tool execution turn is still active

### Approach 2: session.prompt with noReply: true (WORKS)
```typescript
await ctx.client.session.prompt({
  path: { id: context.sessionID },
  body: {
    noReply: true,
    parts: [{ type: 'text', text: stripped }]
  }
})
```
- Directly inserts a user message into the session history
- `noReply: true` means no AI turn is triggered in response
- The message is visible to both the user and HeadWrench
- Not prunable (it's a real message, not a tool result)
- `context.sessionID` comes from the `ToolContext` (second arg to execute)

## ANSI Stripping

`renderMermaidAscii` returns unicode art with ANSI color escape codes.
Must strip before injection: `/\x1B\[[0-9;]*m/g`

## Final Pattern

```typescript
execute: async (args, context) => {
  // ascii branch
  let text: string
  try {
    text = renderMermaidAscii(args.diagram).replace(/\x1B\[[0-9;]*m/g, '')
  } catch {
    text = `\`\`\`mermaid\n${args.diagram}\n\`\`\``
  }
  await ctx.client.session.prompt({
    path: { id: context.sessionID },
    body: { noReply: true, parts: [{ type: 'text', text }] }
  })
  return 'Diagram rendered and injected into conversation.'
}
```
