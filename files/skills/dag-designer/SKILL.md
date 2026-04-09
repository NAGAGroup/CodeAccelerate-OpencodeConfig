---
name: dag-designer
description: Teaches how to dispatch dag-designer to build a first-pass MVP execution DAG from the core component library.
---
<overview>
dag-designer builds first-pass MVP execution DAGs from the core component catalogue. It produces a structurally valid skeleton — a reviewer and reviser improve it in subsequent passes.
</overview>

<what-dag-designer-does>
Loads the core catalogue (variant="core") before designing — never the full catalogue.
Builds phase clusters independently then wires them together.
Defaults to 1 retry per verify-retry structure.
Validates structure throughout and at completion.
Responds with plan name, phase structure rationale, and key structural decisions.
</what-dag-designer-does>

<template name="delegation-prompt">
Plan Name: the plan name — required, used for all add_node calls

Goal: what the execution plan needs to accomplish — describe in terms of work phases and decision points, not specific files or commands

Planning findings: summary of what was discovered during planning — the problem, constraints, risks, and relevant context

Scope boundaries: what is in scope for this plan and what must be excluded

DAG objectives: the phases of work, where decisions need to happen, what could fail and need a retry path, and what success looks like

First-pass guidance: This is a first-pass MVP build. Use only the core catalogue (variant="core"). Focus on phases, verification, and convergence. Default to 1 retry per verify chain. A reviewer and reviser will add specialist nodes in subsequent passes.
</template>
