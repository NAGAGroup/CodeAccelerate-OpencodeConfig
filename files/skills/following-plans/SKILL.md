---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---

# Following Plans

Execute DAG nodes exactly as their prompts specify.

## Node Prompt Structure

Every DAG node prompt follows this template:

```markdown
# DAG Node: <Name>
**Skills:** <load these before doing the node's work>
**Thinking Required:** Yes/No
**Questions Allowed:** Yes/No
**Required Tools:** <enforcement sequence — call these in order>
**Optional Tools:** <available but not enforced>
**Delegated Subagent:** <None or @agent-name>

# Goal
<what this node accomplishes>

## Instructions
<how to do it>

## Constraints
<hard limits>
```

## Rules

- Always load skills, this is non-negotiable.
- Always call required tools, this is non-negotiable.
- Always call `next_step` immediately after completing the goal, this is non-negotiable.

> [ATTENTION] You **must** call the `skill` tool to load all `**Skills**` at the start of each node. Always ask yourself: "Are there skills I need to load for this DAG Node?". This is non-negotiable. If you don't load the required skills, you won't be able to complete the node's goal, and you'll likely encounter errors when trying to call required tools. Always check the node prompt for the `**Skills**` section and load them before doing anything else.
