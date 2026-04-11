---
name: junior-dev
description: Teaches how to dispatch junior-dev for goal-oriented code implementation with investigation-driven approach.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Describe the goal, not the steps. Junior-dev figures out the how — describe the what and why.
Do not include shell operations — junior-dev cannot run commands.
</rules>

<prompt template>
prompt="Goal: [what needs to be implemented or changed — describe the desired outcome, not the steps]

Context: [relevant background — what already exists, what conventions to follow, what constraints apply]

Scope: [what is in scope and what must not be changed]

Plan Name: [plan name or N/A]"

description="[3-5 word description for the user]"
subagent_type="junior-dev"
</prompt template>
