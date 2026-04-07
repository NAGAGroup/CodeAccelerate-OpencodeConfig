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

## Tools

**next_step** — Advance to the next node. Call after completing required tools. Key params: `next` (branch ID, only needed at decision gates).

**recover_context** — Resume after context loss. Returns current node and remaining enforcement steps. Key params: none.

## Rules

- Load node Skills before doing any work
- Call Required Tools in the listed order — do not skip or reorder
- Call next_step after completing each node's required tools
- When enforcement engine returns an error, read it — it names the exact tool to call next
- Use recover_context when context is lost to find your position

> [ATTENTION] You **must** call the `skill` tool to load all `**Skills**` at the start of each node
