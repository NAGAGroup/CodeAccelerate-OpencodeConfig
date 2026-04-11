---
name: autonomous-agent
description: Teaches how to dispatch autonomous-agent for fully autonomous execution of explicitly approved work.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Only dispatch autonomous-agent after all retry attempts in a fix→verify sequence have failed.
Provide complete context — the autonomous agent has no session history and must be able to operate from the prompt alone.
</rules>

<prompt template>
prompt="Goal: [what needs to be accomplished — be specific about what failed and what the expected outcome is]

Prior attempts: [what was tried, what failed, and any relevant error messages or findings]

Constraints: [anything the autonomous agent must not do or must preserve]"

description="[3-5 word description for the user]"
subagent_type="autonomous-agent"
</prompt template>
