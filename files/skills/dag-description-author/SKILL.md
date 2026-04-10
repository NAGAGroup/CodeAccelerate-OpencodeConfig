---
name: dag-description-author
description: Teaches how to dispatch dag-description-author to write per-node context descriptions that guide the executing agent.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Include planning context in the prompt — the author also queries qdrant directly, but priming with context improves description quality.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

User's goal: [what the execution plan is supposed to accomplish]

Planning context summary: [key findings, scope decisions, and user answers from the investigation phase]

Instructions: Write per-node context descriptions for every work node in the DAG. Ground every description in the planning discoveries — do not invent requirements."

description="[3-5 word description for the user]"
subagent_type="dag-description-author"
</prompt template>
