---
name: dag-tools
description: Teaches how to build, modify, review, and validate execution DAGs using DAG manipulation and design tools.
---

# DAG Tools

Use DAG tools to create, modify, validate, and visualize execution DAGs.

## Tools
**get_planning_components_catalogue** — Retrieve component library. Key params: none.

**get_dag_design_guide** — Retrieve design principles. Key params: none.

**add_node** — Create a new node (no wiring). Key params: `plan_name`, `nodeId`, `component_name`.

**add_child** — Wire an edge from parent to child. Works whether child is new or already exists (e.g. shared `plan-fail`). Key params: `plan_name`, `parentId`, `childId`.

**delete_child** — Remove an edge between parent and child without deleting either node. Key params: `plan_name`, `parentId`, `childId`.

**delete_node** — Remove a node and all its edges. Key params: `plan_name`, `nodeId`.

**show_dag** — View complete JSONL content. Key params: `target`.

**show_compact_dag** — Display ASCII Mermaid diagram. Key params: `target`.

**validate_dag** — Validate structure. Key params: `plan_name`.

## Rules
- Get catalogue and design guide before designing
- Create all nodes with add_node first, then wire them with add_child
- Component prompts are static — never customize per node
- Use DAG shape to express intent
- Use sequential-thinking_sequentialthinking to reason through tool calls
