---
name: dag-builder
description: Teaches how to dispatch dag-builder to compile a finalized prose plan into a phase-based execution DAG.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Pass the finalized plan verbatim — do not summarize, paraphrase, or interpret it.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

Finalized plan:
[the full finalized plan document, verbatim]"

description="[3-5 word description for the user]"
subagent_type="dag-builder"
</prompt template>
