---
name: dag-reviewer
description: Teaches how to dispatch dag-reviewer to evaluate a prose plan for phase structure, research sufficiency, and design quality.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Pass the draft plan verbatim — do not summarize or paraphrase it.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

Draft plan:
[the full draft plan document, verbatim]"

description="[3-5 word description for the user]"
subagent_type="dag-reviewer"
</prompt template>
