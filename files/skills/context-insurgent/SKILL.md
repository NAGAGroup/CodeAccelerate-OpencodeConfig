---
name: context-insurgent
description: Teaches how to dispatch context-insurgent for deep, narrow analysis of specific code mechanisms and logic flows.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Use context-insurgent for specific, targeted questions — not for broad orientation. Use context-scout for broad orientation.
Frame the question precisely — vague questions produce vague analysis.
</rules>

<prompt template>
prompt="Goal: [the specific mechanism, flow, or question to investigate]

Focus areas: [specific symbols, files, or patterns to investigate if known — leave blank if unknown]

Why this matters: [what decision or action depends on the findings]

Plan Name: [plan name or N/A]

Return findings as precise analysis. Include an explicit unknowns section for anything that couldn't be determined."

description="[3-5 word description for the user]"
subagent_type="context-insurgent"
</prompt template>
