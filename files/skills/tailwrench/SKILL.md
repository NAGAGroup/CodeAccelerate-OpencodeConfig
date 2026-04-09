---
name: tailwrench
description: Teaches how to dispatch tailwrench for shell operations, verification checks, and git commands.
---
<overview>
tailwrench executes specific technical tasks — shell commands, builds, tests, verifications, git operations — and reports exact results. It is step-limited to 30 — prompts must be focused and specific. It does not investigate, troubleshoot, redesign, or make architectural decisions.
</overview>

<what-tailwrench-does>
Runs shell commands, builds, tests, and git operations.
Understands project state before executing — reads context first.
Reports exact output, exit codes, and error messages for every command.
</what-tailwrench-does>

<template name="delegation-prompt">
Task: what to do — verify, run, build, test, or commit

Commands or criteria: the specific commands to run in order, or the verification criteria to check and what a passing result looks like

Success looks like: what output or state confirms the task completed successfully

Plan Name: plan name to store results under, or N/A if not working within a plan session

Report exact output, exit codes, and error messages for every command. Report whether the task succeeded or failed and any blockers encountered.
</template>
