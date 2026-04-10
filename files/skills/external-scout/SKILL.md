---
name: external-scout
description: Teaches how to dispatch external-scout for external research on public information and documentation.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Use only public general terms — no internal names, proprietary identifiers, or confidential context.
Use external-scout for routine research. Use deep-researcher for novel or frontier topics requiring multi-source synthesis.
</rules>

<prompt template>
prompt="Research goal: [what to find out — general public terms only]

Background: [what is already known so the scout focuses on new information]

Specific questions:
[question 1]
[question 2]

Plan Name: [plan name or N/A]

Tag every finding as verified, inferred, or uncertain. Include an explicit unknowns section covering what could not be confirmed, contradictions between sources, and gaps."

description="[3-5 word description for the user]"
subagent_type="external-scout"
</prompt template>
