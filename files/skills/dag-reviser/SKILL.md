---
name: dag-reviser
description: Teaches how to dispatch dag-reviser to improve execution DAGs using the full component library and reviewer feedback.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

Finalized plan document:
[the full finalized plan document, verbatim]

Revision scope: This is a second-pass alignment. The entry and exit points have been cleared. Align the DAG to the finalized plan — add, remove, or restructure nodes as needed so the DAG accurately reflects every phase and decision in the plan. Use the full catalogue. Consult session notes for the reviewer's DAG-level structural critique to inform specialist node and retry decisions."

description="[3-5 word description for the user]"
subagent_type="dag-reviser"
</prompt template>
