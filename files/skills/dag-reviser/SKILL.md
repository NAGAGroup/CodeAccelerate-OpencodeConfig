---
name: dag-reviser
description: Teaches how to dispatch dag-reviser to improve execution DAGs using the full component library and reviewer feedback.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Include the reviewer's critique verbatim or closely paraphrased — the reviser needs the exact findings.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

User's goal: [what the plan is supposed to accomplish]

Reviewer's critique: [the reviewer's full structured critique — verbatim or closely paraphrased]

Revision scope: This is a second-pass improvement. The DAG is structurally valid. Improve it based on the reviewer's critique — add specialist nodes, adjust retry counts, improve routing, and address every critique point. Use the full catalogue."

description="[3-5 word description for the user]"
subagent_type="dag-reviser"
</prompt template>
