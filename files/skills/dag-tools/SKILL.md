---
name: dag-tools
description: Teaches how to build, modify, review, and validate execution DAGs using DAG manipulation and design tools.
---

# DAG Tools

Use DAG tools to create, modify, validate, and visualize execution DAGs.

## Tool Overview

**get_planning_components_catalogue** — Call with no parameters to retrieve the component library. Shows all available component types with descriptions and enforcement requirements. Use before starting DAG design.

**get_dag_design_guide** — Call with no parameters to retrieve design principles. Covers patterns, component selection, ordering, and verification. Use during DAG design.

**init_dag** — Call with plan_name to create a new DAG. Creates the session plan directory and initializes plan.jsonl with the execution-kickoff entry node. Use once at the start of DAG design.

**add_node** — Call with plan_name, parentId, nodeId, and component_name. Adds a component node to the DAG and updates parent's children array. Use to build the DAG node by node.

**modify_node** — Call with target, nodeId, and new_parent_id to move a node to a different parent. Existing children move with the node. Use for DAG restructuring.

**delete_node** — Call with target and nodeId to remove a node and its entire subtree. Use to remove unneeded branches.

**show_dag** — Call with target to view the complete JSONL content. Shows node IDs, enforcement sequences, and structure. Use for detailed structure verification.

**show_compact_dag** — Call with target to display an ASCII Mermaid diagram with sequential nodes collapsed. Only branching shown. Use for quick visual overview.

**present_compact_dag_to_user** — Call with plan_name to display a compact diagram to users. Use for user-facing presentation.

**validate_dag** — Call with plan_name to validate structure. Checks schema, detects duplicate node IDs, verifies prompt file discoverability. Use after design or modification.

## Rules

Always get the catalogue and design guide before designing. Use init_dag exactly once per DAG. Select components deliberately based on design intent. Component prompts are static — never customize prompts per node; use DAG shape to express intent. Use show_compact_dag for quick verification; use show_dag for enforcement sequence details. Always validate after design or modification. When restructuring with modify_node, children move with the node. Use delete_node to remove entire subtrees. Use present_compact_dag_to_user for user-facing displays.
