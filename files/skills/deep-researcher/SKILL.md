---
name: deep-researcher
description: Teaches how to dispatch deep-researcher for comprehensive investigation of novel or frontier topics.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Use only public general terms — no internal names or proprietary details.
Only use deep-researcher when the topic is genuinely novel or frontier. Use external-scout for routine research.
</rules>

<prompt template>
prompt="Research domain: [the area to investigate — general public terms only]

Background: [what is already known so the researcher focuses on new ground]

Angles to investigate:
[angle 1]
[angle 2]
[angle 3]

Key questions:
[question 1]
[question 2]

Plan Name: [plan name or N/A]

Tag every finding as verified, inferred, or uncertain. Cross-reference findings between sources. Include an explicit unknowns section covering contradictions, gaps, and what could not be confirmed."

description="[3-5 word description for the user]"
subagent_type="deep-researcher"
</prompt template>
