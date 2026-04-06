---
name: following-plans
description: How to follow step-by-step plans exactly
---

# Following Plans

## Main Rules

- Follow the todo list exactly as written.
- Do each step in order.
- Do not skip steps.
- Do not add extra steps.
- Do not stop until the plan tells you to stop.

## How to Follow Plans

- If a step says "Call `<tool name>`", call that tool once, unless told otherwise.
- Do not repeat tool calls unless the plan says so.
- Execute steps autonomously. When one step is done, start the next in the same response.
- When given new instructions, start the first step immediately. Do not pause to ask questions or summarize first.

## When a Tool Call Fails

- Read the error message.
- The error message will tell you which tool to use next.
- Call the tool the system expects. Do not retry the rejected tool.

## When a Tool Call Is Blocked by DAG Enforcement

When the enforcement engine blocks a tool call, the error message says "[DAG BLOCKED]" and tells you exactly which tool to call next. Read the error message carefully. Call the tool it expects. Do not retry the blocked tool. Do not ask for help. The enforcement engine controls the sequence — follow it.

## When All Steps Are Done

- Call `next_step` immediately.
- Do not summarize what you did.
- Do not ask for permission.
- Do not suggest what comes next.
