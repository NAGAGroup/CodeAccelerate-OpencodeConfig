# DAG Node: DAG Design
**Skills:** dag-design, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** init_dag, sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @dag-designer

# Goal
Initialize the execution DAG and dispatch @dag-designer to build it node by node from the component library.

## Instructions
Call `init_dag` first with the plan name `{{PLAN_NAME}}`. Use sequential-thinking to reason through what the DAG should accomplish structurally — what phases of work are needed, what decision points exist, what could fail and need a retry path. Dispatch @dag-designer with the plan name, all accumulated planning context, and a description of what the DAG should accomplish in terms of phases and decision gates — not specific files or commands. The designer adds nodes immediately using `add_node` and must not call `init_dag` again.

## Constraints
- call init_dag before dispatching
- provide plan name `{{PLAN_NAME}}` explicitly in dispatch prompt
- describe work as phases and decision points not implementation steps
- executor discovers specifics from planning notes at runtime
