---
description: C++ debugging session — stateful investigation of failures, crashes, and regressions
---

# /cpp-debug

Start or continue a stateful debugging session with `cpp-debugger`.

## Usage

```
/cpp-debug [description of the failure]
/cpp-debug [paste error/crash/log]
/cpp-debug continue                    # Resume prior investigation
```

## What to Provide

The more context you provide upfront, the faster the investigation. Useful inputs:

- **Crash**: stack trace, core dump path, last known good commit
- **Wrong output**: input that triggers the bug, expected vs actual output
- **Performance regression**: profile output or benchmark numbers, last known good commit
- **CI failure**: full build/test log, environment info, git diff from last green
- **Race condition**: TSan report, reproduction steps, shared state description

## Investigation Phases

`cpp-debugger` follows a structured process:
1. **Triage** — classify failure type, assess reproducibility
2. **Evidence collection** — identify what data is needed and where to find it
3. **Hypotheses** — ranked list, each falsifiable
4. **Root cause + fix** — minimal fix, invariant analysis

## Re-entrance

`/cpp-debug continue` or `/cpp-debug [new evidence]` resumes the investigation session.
The debugger will recap prior findings, eliminate hypotheses based on new evidence, and proceed.

## Context Loaded

ContextScout discovers and loads context files. If `.opencode/context/cpp-systems/` exists, only local context is used. If it doesn't exist, global `~/.config/opencode/context/cpp-systems/` is the fallback. Use `/context migrate` to bring global domain context into the project permanently.
