---
name: mapping-plans-to-dags
description: Teaches how to map a plain-language plan to an executable DAG using the node catalogue.
---
<rules>
Branch nodes (decision-gate, user-decision-gate, verify-work-item) must have exactly 2 children.
Every leaf node must be write-notes. No other node type may be a leaf.
No cycles — no node may appear on a path that leads back to itself.
</rules>

<methodology>
1. Call get_planning_components_catalogue to retrieve the catalogue. Study it carefully — it defines what each node does, when to use it, and its structural constraints.
2. Read the plan provided in your dispatch prompt. Identify the phases of work, decision points, verification needs, and how work flows from start to finish.
3. Map each element of the plan to the most appropriate node type from the catalogue. Let the catalogue guide your choices.
4. Plan the full DAG structure before building: entry point, exit paths (success and failure write-notes leaves), branching points, phase connections.
5. Build or revise incrementally. Call get_compact_dag_draft after each structural change to verify before continuing.
6. Set the entry point and all exit points. Call validate_dag when complete — do not consider work done until it passes.
</methodology>
