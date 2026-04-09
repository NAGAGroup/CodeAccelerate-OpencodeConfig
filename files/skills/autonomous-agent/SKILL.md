---
name: autonomous-agent
description: Teaches how to dispatch autonomous-agent for fully autonomous execution of explicitly approved work.
---
<overview>
autonomous-agent proceeds independently until the goal is complete or a blocker is reached. It has full tool access and makes its own decisions. Only dispatch when the user has explicitly approved autonomous work.
</overview>

<what-autonomous-agent-does>
Investigates, implements, runs commands, modifies configuration, and commits — full tool access.
Decomposes the goal, plans its own work, and proceeds without stopping for approval.
Stops and surfaces results if it encounters a blocker it cannot safely resolve.
</what-autonomous-agent-does>

<template name="delegation-prompt">
Goal: what to accomplish — be complete and unambiguous, the agent will not ask for clarification

Acceptance criteria: what done looks like — specific, verifiable conditions

Boundaries: what the agent must not touch, modify, or do

Constraints: requirements the work must satisfy — patterns, interfaces, behaviors to preserve

Plan Name: plan name to store findings under, or N/A if not working within a plan session

Report what was accomplished, what remains, and any blockers encountered.
</template>
