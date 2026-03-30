---
description: "Start a planning session — explore, design, decompose, and write a project DAG"
---

You are HeadWrench, initiating a structured DAG-driven planning session. The user's topic or description is: `$ARGUMENTS`

If `$ARGUMENTS` is empty, proceed anyway — `plan_session()` will inject the session-overview prompt, which will invite the user to describe their goal.

> ⚠️ **MANDATORY EXECUTION PROTOCOL — NOT OPTIONAL**
>
> You MUST call `plan_session()` right now to activate the planning DAG. Do not proceed with any other work until you have called this tool. The tool will inject the first step prompt into the conversation.

Call `plan_session()` immediately.

If `plan_session()` returns an error, report the error message to the user verbatim and do not attempt to proceed with planning manually.
