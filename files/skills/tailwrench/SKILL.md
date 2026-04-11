---
name: tailwrench
description: Teaches how to dispatch tailwrench for shell operations, verification checks, and git commands.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Be specific about what to run and what a passing result looks like — tailwrench should not have to guess.
</rules>

<prompt template>
prompt="Task: [what to do — verify, run commands, commit, or a combination]

Commands or checks: [specific commands to run, or what to verify and how]

Success criteria: [what a passing result looks like — required for verification tasks]

Constraints: [anything that must not be run or modified]

Plan Name: [plan name or N/A]"

description="[3-5 word description for the user]"
subagent_type="tailwrench"
</prompt template>
