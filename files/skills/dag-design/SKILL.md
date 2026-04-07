---
name: dag-design
description: Teaches how to dispatch @dag-designer to build execution DAGs from the component library.
---

# Delegating to @dag-designer

Dispatch @dag-designer to design execution DAGs from the component library.

## How to Dispatch

Call task tool with: `subagent_type="dag-designer"`, description (3-5 words), goal-based prompt with plan name, planning findings, scope boundaries, and DAG objectives.

## What @dag-designer Does

- Selects appropriate component nodes from library
- Arranges nodes to accomplish goal
- Validates structure, checks dependencies, ensures correct ordering

## Rules
- Include plan_name explicitly (required for all add_node calls)
- Provide all accumulated planning findings
- State scope boundaries clearly
- Prompt must be self-contained
- Describe problems and work phases, not specific files or commands
- Branches are exclusive paths chosen at decision gates, not parallel work
- Sequential nodes for work that both must happen
