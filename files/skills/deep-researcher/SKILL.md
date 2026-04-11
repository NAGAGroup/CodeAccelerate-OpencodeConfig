---
name: deep-researcher
description: Teaches how to dispatch deep-researcher for comprehensive investigation of novel or frontier topics.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Use deep-researcher for novel or frontier topics requiring multi-source synthesis. Use external-scout for routine research on established technologies.
</rules>

<prompt template>
prompt="Research goal: [what to investigate — novel technology, frontier practice, or topic requiring deep synthesis across multiple sources]

Why external-scout is insufficient: [brief explanation of why this requires comprehensive multi-source synthesis]

Specific questions:
[question 1]
[question 2]

Plan Name: [plan name or N/A]

Cross-reference sources. Synthesize contradictions. Tag findings as verified, inferred, or uncertain."

description="[3-5 word description for the user]"
subagent_type="deep-researcher"
</prompt template>
