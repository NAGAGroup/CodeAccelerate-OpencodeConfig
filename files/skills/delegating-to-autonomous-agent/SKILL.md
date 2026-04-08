---
name: delegating-to-autonomous-agent
description: Teaches how to dispatch autonomous-agent for fully autonomous execution of explicitly approved work.
---

# What does this skill teach?

In this skill, you learn how to delegate to autonomous-agent, a fully autonomous executor with full tool access that proceeds independently until the goal is complete or a blocker is reached.

# What does autonomous-agent do?

- Investigates, implements, runs commands, modifies configuration, and commits — full tool access
- Decomposes the goal, plans its own work, and proceeds without stopping for approval
- Stops and surfaces results if it encounters a blocker it cannot safely resolve
- Only dispatched when the user has explicitly approved autonomous work

# How to delegate to autonomous-agent

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Goal:** <what to accomplish — be complete and unambiguous, the agent will not ask for clarification>

**Acceptance criteria:** <what done looks like — specific, verifiable conditions>

**Boundaries:** <what the agent must not touch, modify, or do>

**Constraints:** <requirements the work must satisfy — patterns, interfaces, behaviors to preserve>

**Plan Name:** <plan name to store findings under, or N/A if not working within a plan session>

Report what was accomplished, what works, what remains, and any blockers encountered.
```

# Thinking through your delegation prompt

<|think|>
- Has the user explicitly approved autonomous work — this agent must never be dispatched without that approval?
- Is the goal complete and unambiguous — the agent will not ask follow-up questions, so gaps become assumptions?
- Are the acceptance criteria specific and verifiable, not vague or subjective?
- Have I listed boundaries clearly — what must not be touched, deleted, or modified?
- Is there any risk of irreversible actions that the agent should be warned about explicitly?
- Is the prompt fully self-contained — does the agent have everything it needs to work independently?
