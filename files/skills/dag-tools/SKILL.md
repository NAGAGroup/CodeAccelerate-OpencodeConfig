---
name: dag-tools
description: Teaches how to build, modify, review, and validate execution DAGs using DAG manipulation and design tools.
---

# DAG Tools

This skill teaches how to work with execution DAGs using tools for creation, modification, validation, and review. Load it when you need to design, build, modify, or validate a DAG structure.

## Tool Overview

**Use get_planning_components_catalogue to explore available components.** Call this tool with no parameters to retrieve the complete catalogue of component node types available for DAG construction. The catalogue lists all components with their descriptions and enforcement requirements. Use this at the start of DAG design to understand what components are available.

**Use get_dag_design_guide to understand DAG design principles.** Call this tool with no parameters to retrieve the design guide for DAG construction. The guide covers design patterns, component selection logic, ordering constraints, and verification principles. Use this when designing a DAG to ensure your design follows established patterns.

**Use init_dag to create a new DAG structure.** Call this tool with plan_name parameter to create a new execution DAG. The tool creates the session plan directory and initializes plan.jsonl with the execution-kickoff entry node. Use this once at the beginning of DAG design to set up the structure.

**Use add_node to add a component node to the DAG.** Call this tool with plan_name, parentId, nodeId, and component_name parameters. The tool looks up the component in the library, retrieves its enforcement array and prompt, adds the node to plan.jsonl, and updates the parent's children array. Use this to build the DAG node by node, selecting components that accomplish your design intent.

**Use modify_node to change a node's parent.** Call this tool with target (plan name or path), nodeId, and new_parent_id parameters to restructure the DAG by moving a node to a different parent. The node's existing children move with it. Use this for DAG restructuring without losing subtree content.

**Use delete_node to remove a node and its subtree.** Call this tool with target and nodeId parameters to delete a node and all its descendants from the DAG. Use this to remove branches that are no longer needed or to clean up after restructuring.

**Use show_dag to examine DAG structure.** Call this tool with target parameter (plan name) to view the complete JSONL content of the DAG. This shows node IDs, enforcement sequences, prompt file references, and structure. Use this to verify structure and understand node relationships.

**Use show_compact_dag to visualize DAG structure.** Call this tool with target parameter to display an ASCII Mermaid diagram of the DAG with sequential nodes collapsed into blocks. Only branching structure is shown. Use this for quick visual overview avoiding hangs on large DAGs.

**Use present_compact_dag_to_user for user-facing display.** Call this tool with plan_name parameter to display a compact DAG diagram to the user in a system message. Use this when you need to show users the DAG structure without technical detail.

**Use validate_dag to check DAG correctness.** Call this tool with plan_name parameter to validate the DAG structure. The tool checks schema validity, detects duplicate node IDs, and verifies prompt file discoverability. Use this after design or modification to catch structural problems before execution.

## DAG Design Workflow

**Pattern: Design → Build → Validate → Present**
1. Review planning findings and determine required work
2. Use get_planning_components_catalogue and get_dag_design_guide to understand available components and design principles
3. Call init_dag to create the base DAG structure
4. Call add_node repeatedly to build the DAG, selecting components that accomplish each phase of work
5. Use show_compact_dag to verify structure visually
6. Call validate_dag to check for errors
7. Use present_compact_dag_to_user to show the final DAG to users

**Pattern: Modification Workflow**
1. Use show_dag or show_compact_dag to understand current structure
2. Use add_node to insert new nodes
3. Use modify_node to restructure parent-child relationships if needed
4. Use delete_node to remove branches that are no longer needed
5. Call validate_dag after modifications to verify structural correctness

**Pattern: Component Selection**
1. Review the design guide to understand what phases of work are needed
2. Consult the catalogue to find components matching each phase
3. Select components based on: what work needs to happen, whether verification is required, whether user interaction is needed, what tool access is required
4. Arrange selected components in dependency order using add_node

## Rules

Always get the catalogue and design guide before designing a DAG. Use init_dag exactly once per DAG. Use add_node to construct the DAG node by node, selecting components deliberately. Component prompts are static — do not customize prompts per node; the DAG's shape expresses intent, not per-node prompt modifications. Use show_compact_dag for quick visual verification; use show_dag when you need to examine enforcement sequences and JSONL structure. Call validate_dag after design or modification to catch errors. When restructuring with modify_node, existing children move with the node. Use delete_node to remove entire subtrees. Present_compact_dag_to_user is for showing users the final DAG structure.

## Examples

**Good:** Start DAG design. Call get_planning_components_catalogue to see available components. Call get_dag_design_guide to understand design principles. Review findings and plan work phases. Call init_dag with plan_name="logging-auth". Call add_node to add work-item nodes for each phase. Call show_compact_dag to verify structure. Call validate_dag to check for errors. Call present_compact_dag_to_user to show final structure to user.

**Good:** Need to restructure a DAG. Call show_dag to see current structure. Identify a subtree to move. Call modify_node with the node ID and new_parent_id. The node and all its children move to the new location. Call validate_dag to confirm the new structure is valid.

**Good:** Design includes a verification node. Call get_planning_components_catalogue to find verification component types. Select appropriate component and add with add_node. The component's enforcement sequence ensures verification gates are checked.

**Bad — modifies component prompts:** Instead of selecting a component from the catalogue, you try to customize its prompt per-node. Component prompts are static. Use the DAG's shape to express your design intent, not per-node prompt changes.

**Bad — skips validation:** Design is complete but you never call validate_dag. Structural errors are discovered only during execution. Always validate before handing off the DAG.

**Bad — uses show_dag for user presentation:** Call show_dag which returns raw JSONL and hand it to users. Use present_compact_dag_to_user to show users a readable diagram instead.

**Bad — creates multiple DAGs instead of restructuring:** When you need to change the DAG structure, you try to create a new DAG instead of using modify_node to restructure. Use modify_node and delete_node for efficient restructuring.
