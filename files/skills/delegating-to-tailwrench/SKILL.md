---
name: delegating-to-tailwrench
description: Teaches how to dispatch tailwrench for shell operations, verification checks, and git commands.
---

# What does this skill teach?

In this skill, you learn how to delegate to tailwrench, a shell and verification operator that executes specific technical tasks and reports exact results.

# What does tailwrench do?

- Runs shell commands, builds, tests, verifications, and git operations
- Understands project state before executing — reads context first
- Follows instructions precisely and reports exact output, exit codes, and errors
- Step-limited to 30 — prompts must be focused and specific
- Does not investigate, troubleshoot, redesign, or make architectural decisions

# How to delegate to tailwrench

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Task:** <what to do — verify, run, build, test, or commit>

**Commands or criteria:** <the specific commands to run in order, or the verification criteria to check and what a passing result looks like>

**Success looks like:** <what output or state confirms the task completed successfully>

**Plan Name:** <plan name to store results under, or N/A if not working within a plan session>

Report exact output, exit codes, and error messages for every command. Report whether the task succeeded or failed and any blockers encountered.
```

# Thinking through your delegation prompt

<|think|>
- Have I described a single focused task — tailwrench is step-limited and works best with a clear, bounded scope?
- For verification tasks, have I described what to check and what a passing result looks like?
- For commit tasks, have I described what changed and what the commit message should convey?
- Have I specified success criteria explicitly so tailwrench knows when it's done?
- Is the prompt specific enough that tailwrench can execute without needing to make judgment calls?
