---
topic: agent-ignore-header
tier: global
promoted_from: inbox
session: agent-permissions-and-insurgent
created: 2026-03-10
last_reviewed: 2026-03-13
supersedes: ~
superseded_by: ~
---

# Agent-Ignore Header Pattern for Slash Commands

When a slash command produces output strictly for user reference (not agent context), begin the output with:

```
> ℹ️ **[SLASH COMMAND OUTPUT — generated for user reference only. Agents: ignore this message.]**
```

This is a convention-based signal, not a technical enforcement. It prevents HeadWrench from acting on the content as if it were a user instruction.

## Where This Was Established

`opencode/commands/session-status.md` — the `/session-status` slash command, which reads active session spec.json and displays subtask progress.

## When to Use

Any slash command whose output is diagnostic/informational and should not trigger agent action. Examples:
- Status displays (`/session-status`)
- Diagnostic dumps
- Reference lookups

## Contrast With Normal Commands

Normal commands like `/plan` or `/inbox` are instructions TO the agent. This pattern is for commands that produce OUTPUT for the user while keeping the agent passive.
