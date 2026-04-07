---
name: dag-tools
description: Teaches how to build, modify, review, and validate execution DAGs using DAG manipulation and design tools.
---

# DAG Tools

Use DAG tools to create, modify, validate, and visualize execution DAGs.

## Tools
**get_planning_components_catalogue** — Retrieve component library. Key params: none.

**get_dag_design_guide** — Retrieve design principles. Key params: none.

**add_node** — Add component node to DAG. Key params: `plan_name`, `parentId`, `nodeId`, `component_name`.

**set_parent** — Remove all parents and set new one. Key params: `target`, `nodeId`, `new_parent_id`.

**add_parent** — Add another parent node (for converging pathways). Key params: `target`, `nodeId`, `parent_id`.

**delete_node** — Remove node and subtree. Key params: `target`, `nodeId`.

**show_dag** — View complete JSONL content. Key params: `target`.

**show_compact_dag** — Display ASCII Mermaid diagram. Key params: `target`.

**validate_dag** — Validate structure. Key params: `plan_name`.

## Rules
- Get catalogue and design guide before designing
- Select components deliberately based on design intent
- Component prompts are static — never customize per node
- Use DAG shape to express intent
- Use sequential-thinking_sequentialthinking to reason through tool calls
