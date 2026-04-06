---
name: shell-operations
description: Teaches how to construct and execute safe bash commands with proper quoting, timeouts, and output handling.
---

# Shell Operations

This skill teaches how to use the bash tool to execute shell commands safely and effectively. Load it when you need to run commands, scripts, build operations, tests, or git commands.

## How to Call the Tool

**Use the bash tool to run shell commands.** Call bash with a command parameter (the shell command to execute), a description parameter (5-10 words explaining what the command does), and optionally a timeout parameter (milliseconds, max 120000). The command executes and returns output. If output exceeds 2000 lines or 51200 bytes, it is truncated and written to a file. Use the read tool to access truncated output by reading the file.

## Key Patterns for Reliable Commands

**Pattern: Use workdir instead of cd && commands**
Call bash with workdir parameter set to the directory you want to run in. This is safer and clearer than chaining commands with cd && because each call has a clean context. Example: workdir="/path/to/project", command="npm test". Do not use the pattern: command="cd /path/to/project && npm test".

**Pattern: Quote paths with spaces**
When a file path contains spaces, wrap it in double quotes. Example: command='rm "path with spaces/file.txt"' or command='cp "/home/user/My Documents/file.txt" /tmp/'. Unquoted paths with spaces cause command failures.

**Pattern: Chain dependent commands with &&**
When commands must run in sequence and success of one depends on the previous, use && to chain them: command="git add . && git commit -m \"message\" && git push". This ensures that if any step fails, the chain stops and reports the error.

**Pattern: Use ; for sequential independent commands**
When commands should run one after another but don't depend on each other's success, use semicolon: command="npm run build ; npm run test". Both run regardless of outcome.

**Pattern: Handle output that may be truncated**
If you expect large output (logs, test results), include handling for truncated files. When bash truncates output, it tells you a file was created. Read that file with the read tool to access the full output using offset and limit parameters.

## Rules

Always quote file paths containing spaces with double quotes. Use workdir parameter to change directories rather than cd && chains. Use && to chain dependent commands (build then test). Use ; for independent sequential commands. Consider timeout values — 120000ms (2 minutes) is the maximum; use smaller timeouts for commands that should complete quickly. Avoid destructive commands without explicit user approval — always verify intent before running rm, git reset --hard, or force pushes. Interpret exit codes: 0 means success, non-zero means failure. Commands that fail still return output — check both exit code and output content. Truncated output is saved to a file — use read tool to examine the full content.

## Exit Codes and Output Interpretation

**Exit code 0** means the command succeeded. Check the output for expected results.

**Non-zero exit code** means the command failed. The bash tool returns both the exit code and the error output. Read error messages carefully to understand what went wrong.

**Empty output** may indicate success (some commands produce no output) or failure. Check the exit code to determine outcome.

**Truncated output** is reported in the tool response. Use the read tool to access the file containing full output.

## Examples

**Good:** command='git add . && git commit -m "add feature" && git push', workdir="/home/user/project". This chains three dependent commands safely. If any fails, the chain stops and reports the error.

**Good:** command='ls "/path with spaces/directory"', description="List contents of directory with spaces". Quotes protect the path.

**Good:** command='npm test', workdir="/project", timeout=60000, description="Run test suite with 60 second timeout". Uses workdir cleanly and specifies timeout.

**Good:** command='git log --oneline', description="Show recent commits". If output is truncated, the tool reports a file. Use read to access full output.

**Bad — uses cd && pattern:** command="cd /home/user/project && npm test". Use workdir instead.

**Bad — unquoted path with spaces:** command='rm /path with spaces/file.txt'. This will fail because the path isn't quoted. Should be: command='rm "/path with spaces/file.txt"'.

**Bad — destructive without thought:** Running rm -rf without confirming intent first. Verify the scope before destructive operations.

**Bad — ignores truncated output:** Output was truncated but you ignore the file creation message. Use read to examine the full output for large results.

**Bad — conflates empty output with failure:** A command returns exit code 0 (success) but produces no output. This is normal for some commands. Check exit code, not just output.
