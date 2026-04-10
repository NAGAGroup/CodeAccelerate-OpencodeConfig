---
name: autonomous-agent
description: Teaches how to dispatch autonomous-agent for fully autonomous execution of explicitly approved work.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Only dispatch when the user has explicitly approved autonomous work.
The goal must be complete and unambiguous — the agent will not ask for clarification.
</rules>

<prompt template>
prompt="Goal: [what to accomplish — complete and unambiguous]

Acceptance criteria: [what done looks like — specific, verifiable conditions]

Boundaries: [what the agent must not touch, modify, or do]

Constraints: [requirements the work must satisfy — patterns, interfaces, behaviors to preserve]

Plan Name: [plan name or N/A]

Report what was accomplished, what remains, and any blockers encountered."

description="[3-5 word description for the user]"
subagent_type="autonomous-agent"
</prompt template>
