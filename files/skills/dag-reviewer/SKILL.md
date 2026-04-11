---
name: dag-reviewer
description: Teaches how to dispatch dag-reviewer to evaluate execution DAGs through structural validation and deep analysis of specialist node needs.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

Draft plan document:
[the full draft plan document, verbatim]

Review dimensions: [which aspects to focus on, or all dimensions for a full review]

Known concerns: [specific issues or doubts about the design the reviewer should pay close attention to]"

description="[3-5 word description for the user]"
subagent_type="dag-reviewer"
</prompt template>
