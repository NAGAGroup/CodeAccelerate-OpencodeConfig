---
name: shell-operations
description: Teaches how to construct and execute safe bash commands with proper quoting, timeouts, and output handling.
---

# Shell Operations

Use the bash tool to run shell commands safely and effectively.

## Tools
**bash** — Execute shell command. Key params: `command` (shell command), `description` (5-10 words), `timeout` (milliseconds, max 120000), `workdir` (working directory).

## Patterns
**workdir instead of cd:** Use workdir parameter to change directories rather than `cd && command`.

**Quote paths with spaces:** Wrap paths with spaces in double quotes: `command='rm "/path with spaces/file.txt"'`.

**Chain dependent commands:** Use `&&` for commands that depend on each other; chain stops on first failure.

**Sequential independent commands:** Use `;` to run commands one after another regardless of success.

**Handle truncated output:** If output exceeds 2000 lines or 51200 bytes, it's written to a file; use read tool to access it.

## Rules
- Always quote file paths containing spaces
- Use workdir instead of cd chains
- Use && for dependent commands, ; for independent sequential commands
- Set reasonable timeouts (120000ms max)
- Avoid destructive commands without explicit approval
- Exit code 0 = success, non-zero = failure
- Check both exit code and output
- Truncated output is saved to a file — read it to see full results
