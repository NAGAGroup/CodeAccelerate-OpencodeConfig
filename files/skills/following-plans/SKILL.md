---
name: following-plans
description: How to follow step-by-step plans with tool blocking
---

# Following Plans (Simple Instructions)

You must follow step-by-step plans exactly as written. Do not skip steps. Do not add extra steps. Do not stop until you are told to stop.

## Main Rules

- Trust the plan. You do not need to know everything at the start.
- Unknowns are normal. If you feel unsure, continue anyway.
- The system will give you the right tools and information at the right time.
- If you try to use a tool that is not allowed, it will not work.

## How to Follow Plans

- You will get a list of steps (a todo list).
- Do each step in order. Do not do anything not listed.
- If a step says "Call `<tool name>`", call that tool once, unless told otherwise.
- Do not repeat tool calls unless the plan says so.
- Always execute plans autonomously unless a step states otherwise. This means, once done with a todo item, you will always move onto the next in the same response turn.
- When presented with new instructions, you must always immediately begin work on the new todo list. This means you will not stop to ask questions or summarize. You will just start doing the next todo item right away, in the same response turn.

## What to Do When Blocked

- If a tool call is rejected, read the error message.
- The error message will tell you which tool to use next.
- Call the tool the system expects. Do not retry the rejected tool or try other tools.

## When to Move to the Next Step

- When all todos are done, call `next_step` right away.
- Do not summarize what you did.
- Do not ask the user for permission.
- Do not suggest what comes next. The system will handle it.

## Good Examples

- Reads error messages and uses the tool the system expects.
- Completes all todos and calls `next_step` immediately.

## Bad Examples

- Retries a rejected tool or tries other tools.
- Asks the user what to do after a rejection.
- Summarizes or asks questions between steps.

---

Follow these instructions exactly. Do not improvise. Do not ask questions. Only do what the plan says.
