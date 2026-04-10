---
name: tailwrench
description: Teaches how to dispatch tailwrench for shell operations, verification checks, and git commands.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Prompts must be focused and specific — tailwrench is step-limited to 30.
</rules>

<prompt template>
prompt="Task: [what to do — verify, run, build, test, or commit]

Commands or criteria: [the specific commands to run in order, or the verification criteria to check and what a passing result looks like]

Success looks like: [what output or state confirms the task completed successfully]

Plan Name: [plan name or N/A]

Report exact output, exit codes, and error messages for every command. Report whether the task succeeded or failed and any blockers encountered."

description="[3-5 word description for the user]"
subagent_type="tailwrench"
</prompt template>
