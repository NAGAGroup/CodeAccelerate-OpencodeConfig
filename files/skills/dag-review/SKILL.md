---
name: dag-review
description: Dispatch a DAG review agent
---

# Dispatching the DAG Review Agent

## How to Call the task Tool

Call the `task` tool with exactly these three fields:

- `subagent_type`: always the string `"headwrench"`
- `description`: a short 3–5 word label (for logging only, not seen by the agent)
- `prompt`: your full delegation prompt as a single string

Example call:

```
task(
  subagent_type="headwrench",
  description="Review execution DAG",
  prompt="Review the DAG at [plan path]. The rationale is at [rationale path]. The user's goal is [goal]. Call get_dag_design_guide and get_planning_components_catalogue before reviewing. Return a structured critique: what is good, what is missing, and what should change with specific reasons."
)
```

Do not include `task_id`. Omit it entirely.

## What the DAG Review Agent Does

The DAG review agent is a full HeadWrench instance. It reads the plan.jsonl and the rationale document, checks the DAG against the design guide, and returns a structured critique.

The reviewer does not revise the DAG. It critiques only. One review round.

## How to Write a Good Delegation Prompt

Your prompt should:
1. Provide the plan.jsonl path.
2. Provide the rationale document path.
3. State the user's goal so the reviewer can assess fit.
4. Tell it to call `get_dag_design_guide` and `get_planning_components_catalogue` before reviewing.
5. Ask for a structured critique: what is good, what is missing, what should change, and why.

## What the Review Agent Returns

A structured critique covering:
- What the DAG does well.
- What is missing or insufficient.
- What should change and why.
- Any component types used incorrectly.

The critique should be specific and actionable. Vague praise or criticism is not useful.

## Examples

Good — complete context provided:
> "Review the DAG at [plan path]. The rationale is at [rationale path]. The user's goal is [goal]. Call get_dag_design_guide and get_planning_components_catalogue before reviewing. Return a structured critique: what is good, what is missing, and what should change."

Bad — no rationale path:
> "Review the DAG at [path]." — the reviewer needs the rationale to understand designer intent.

Bad — asks for revision:
> "Review the DAG and fix any problems you find." — the reviewer critiques only. Revision is a separate step.
