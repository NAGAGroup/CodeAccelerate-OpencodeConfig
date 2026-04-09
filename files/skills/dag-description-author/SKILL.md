---
name: dag-description-author
description: Teaches how to dispatch dag-description-author to write per-node context descriptions that guide the executing agent.
---
<overview>
dag-description-author writes per-node context descriptions for a completed execution DAG. Descriptions ground each work node in specific planning discoveries — telling the executing agent what to do here, not what the component type does generically.
</overview>

<what-dag-description-author-does>
Retrieves planning context from qdrant before writing anything.
Loads the DAG structure and component catalogue to understand what each node type already covers.
Writes 2-4 sentence descriptions for work nodes only.
Skips structural nodes unless their purpose is genuinely ambiguous.
Responds with which nodes got descriptions and which were intentionally skipped.
</what-dag-description-author-does>

<template name="delegation-prompt">
Plan Name: the plan name — required, used to load the DAG and retrieve qdrant notes

User's goal: what the execution plan is supposed to accomplish

Planning context summary: key findings, scope decisions, and user answers from the investigation phase — the author will also query qdrant directly, but this primes their understanding

Instructions: Write per-node context descriptions for every work node in the DAG. Use qdrant_qdrant-find with collection_name equal to the plan name to retrieve full planning context before starting. Ground every description in the planning discoveries — do not invent requirements.
</template>
