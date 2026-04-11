---
name: dag-description-author
description: Teaches how to dispatch dag-description-author to apply per-node context descriptions to an execution DAG.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

Node descriptions:
[list each node ID and its description, one per line:
- [node-id]: [description]
- [node-id]: [description]]

Instructions: Apply each description exactly as provided using add_description_to_node. Do not skip any nodes."

description="[3-5 word description for the user]"
subagent_type="dag-description-author"
</prompt template>
