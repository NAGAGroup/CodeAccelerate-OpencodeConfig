---
name: shell-operations
description: Teaches how to construct and execute safe bash commands with proper quoting, timeouts, and output handling.
---

# Shell Operations

Use the bash tool to run shell commands safely and effectively.

## How to Call the Tool

**bash tool** — Call with command parameter (shell command), description parameter (5-10 words), and optional timeout (milliseconds, max 120000). Command executes and returns output. If output exceeds 2000 lines or 51200 bytes, it's truncated and written to a file. Use read tool to access truncated output by reading the file.

## Key Patterns

**workdir instead of cd** — Use workdir parameter to change directories rather than `cd && command`. Safer and clearer.

**Quote paths with spaces** — Wrap paths with spaces in double quotes: `command='rm "/path with spaces/file.txt"'`. Unquoted paths fail.

**Chain dependent commands** — Use `&&` to chain commands that depend on each other: `command="git add . && git commit -m \"msg\" && git push"`. Chain stops on first failure.

**Sequential independent commands** — Use `;` to run commands one after another regardless of success: `command="npm run build ; npm run test"`.

**Handle truncated output** — If output is truncated, bash reports a file. Use read tool to access the full output with offset and limit.

## Rules

Always quote file paths containing spaces. Use workdir instead of cd chains. Use && for dependent commands. Use ; for independent sequential commands. Set reasonable timeouts (120000ms max). Avoid destructive commands without explicit approval — verify rm, git reset, force pushes before executing. Exit code 0 = success, non-zero = failure. Check both exit code and output. Truncated output is saved to a file — read it to see full results.
