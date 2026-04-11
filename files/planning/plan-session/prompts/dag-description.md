**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-description-author
**Required Tools:** get_compact_dag_draft, task
**Optional Tools:** qdrant_qdrant-find
**Questions Allowed?:** No

<goal>
Populate every work node in the execution DAG with a per-node context goal-oriented description that provides necessary context for an agent executing the DAG.
</goal>

<rules>
Every work node in the DAG must receive a description. No node may be skipped.
Descriptions must be specific to this plan's context — do not write generic descriptions that could apply to any plan using the same component type.
Descriptions must be goal-oriented. State what the node is trying to achieve, not how to achieve it. Do not prescribe specific files, tools, or implementation steps.
</rules>

<instructions>
1. Call get_compact_dag_draft with plan name {{PLAN_NAME}} to retrieve the current DAG draft and use it to inform your understanding of the plan's structure.
2. Call qdrant_qdrant-find with collection_name={{PLAN_NAME}} if you need any additional context you don't already have in order to write node descriptions. You may call this as many times as you need to fill in gaps in your understanding.
3. Load the dag-description-author skill. Use it to compose a dispatch prompt.
4. Dispatch dag-description-author, providing the plan name {{PLAN_NAME}} and a list of each DAG node with its associated context description. The descriptions should be goal-oriented, providing necessary context for an agent executing the DAG.
5. Call next_step.
</instructions>
