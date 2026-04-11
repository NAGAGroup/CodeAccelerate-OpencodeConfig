---
name: dag-designer
description: Teaches how to dispatch dag-designer to build a first-pass MVP execution DAG from the core component library.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Map the plan exactly as described — do not add phases or structure that are not in the plan, and do not omit anything that is.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

Draft plan document:
[the full draft plan document, verbatim]

First-pass guidance: This is a first-pass MVP build. The DAG has already been initialized — start directly with add_nodes_to_dag. Use only the core catalogue (variant=core). Focus on phases, verification, and convergence. Default to 1 retry per verify chain. A reviewer and reviser will add specialist nodes in subsequent passes."

description="[3-5 word description for the user]"
subagent_type="dag-designer"
</prompt template>
