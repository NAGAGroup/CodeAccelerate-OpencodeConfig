---
name: dag-reviser
description: Teaches how to dispatch dag-reviser to improve execution DAGs using the full component library and reviewer feedback.
---
<overview>
dag-reviser takes a structurally valid first-pass DAG and substantially improves it using the full component catalogue and the reviewer's critique.
</overview>

<what-dag-reviser-does>
Loads the current DAG structure and full component catalogue before making changes.
Retrieves session notes including the reviewer's critique via qdrant.
Plans all revisions before executing — writes the target adjacency list first.
Adds specialist nodes where the reviewer recommended them.
Adjusts retry counts, routing patterns, and structure as needed.
Validates the final DAG after all changes.
Responds with changes made per critique point, additional improvements, and final DAG state.
</what-dag-reviser-does>

<template name="delegation-prompt">
Plan Name: the plan name — required, the DAG already exists under this name

User's goal: what the plan is supposed to accomplish

Reviewer's critique: the reviewer's full structured critique — include verbatim or closely paraphrased

Revision scope: This is a second-pass improvement. The DAG is structurally valid. Improve it based on the reviewer's critique — add specialist nodes, adjust retry counts, improve routing, and address every critique point. Use the full catalogue. Use qdrant_qdrant-find with collection_name equal to the plan name to access session notes.
</template>
