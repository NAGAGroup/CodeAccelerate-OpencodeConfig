---
name: dag-designer
description: Teaches how to dispatch dag-designer to build a first-pass MVP execution DAG from the core component library.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Describe work as phases and decision points — not specific files or commands.
</rules>

<prompt template>
prompt="Plan Name: [the plan name]

Goal: [what the execution plan needs to accomplish — describe in terms of work phases and decision points, not specific files or commands]

Planning findings: [summary of what was discovered during planning — the problem, constraints, risks, and relevant context]

Scope boundaries: [what is in scope and what must be excluded]

DAG objectives: [the phases of work, where decisions need to happen, what could fail and need a retry path, and what success looks like]

First-pass guidance: This is a first-pass MVP build. The DAG has already been initialized — start directly with add_nodes_to_dag. Use only the core catalogue (variant=core). Focus on phases, verification, and convergence. Default to 1 retry per verify chain. A reviewer and reviser will add specialist nodes in subsequent passes."

description="[3-5 word description for the user]"
subagent_type="dag-designer"
</prompt template>
