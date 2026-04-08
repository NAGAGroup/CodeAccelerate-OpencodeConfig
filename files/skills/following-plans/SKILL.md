---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---

# What does this skill teach?

In this skill, you learn how to execute DAG node prompts exactly as specified — loading skills, satisfying required tools in order, and advancing the session with `next_step`.

## How to read a node prompt

Every DAG node prompt follows this template:

```markdown
# DAG Node: <Name>
**Skills:** <load these before doing the node's work>
**Required Tools:** <enforcement sequence — call these in order>
**Optional Tools:** <available but not enforced>
**Delegated Subagent:** <None or agent-name>

# Goal
<what this node accomplishes>

## Instructions
<how to do it>

## Constraints
<hard limits>
```

## How to execute a node

1. Load every skill listed in `**Skills:**` before doing anything else
2. Call every tool in `**Required Tools:**` in the order listed — the enforcement engine blocks advancement until each is called
3. Complete the node's goal as described in the Instructions
4. Call `next_step` immediately after the goal is complete — do not summarize, reflect, or wait

## How to handle enforcement blocks

If a tool call is blocked by the enforcement engine, it means a required tool earlier in the sequence has not been called yet. Check the `**Required Tools:**` list and call the missing tool before retrying.

## How to think through this skill

<|think|>
- Have I loaded all skills listed in the node prompt before doing any other work?
- Do I know the full required tool sequence for this node — have I read it carefully?
- Am I calling required tools because the node needs them, or am I trying to skip ahead?
- Have I completed the node's goal, or am I calling next_step prematurely?
- If a tool was blocked, which required tool earlier in the sequence did I miss?
