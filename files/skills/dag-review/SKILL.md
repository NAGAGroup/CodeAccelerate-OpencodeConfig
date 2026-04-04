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
  prompt="Review the DAG at [plan path]. The rationale is at [rationale path]. The user's goal is [goal]. Call get_dag_design_guide and get_planning_components_catalogue before reviewing. Address each of the 7 items in the Review Checklist explicitly."
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
5. Ask the reviewer to address each item in the Review Checklist explicitly.

## Review Checklist

Address each item explicitly in your review:

1. **Completeness** — Does the DAG cover all work required to achieve the stated goal? Are any necessary steps missing?
2. **Dependency correctness** — Are node dependencies in the right order? Does each node have the inputs it needs from prior nodes?
3. **Component fit** — Does each node use the right component type for its purpose? Are work nodes, verify nodes, and decision nodes used appropriately?
4. **Verification coverage** — Does every work node have a corresponding verify node? Are changes confirmed before the next step proceeds?
5. **Scope creep** — Does the DAG stay within the stated scope? Are there nodes that address work not requested?
6. **Failure handling** — Are there appropriate paths for failure cases? Does the DAG handle build failures, user disapproval, or other error conditions?
7. **Efficiency** — Is the DAG as lean as possible? Are there redundant nodes or steps that could be combined without losing coverage?

## Examples

Good — complete context provided:
> "Review the DAG at [plan path]. The rationale is at [rationale path]. The user's goal is [goal]. Call get_dag_design_guide and get_planning_components_catalogue before reviewing. Address each of the 7 items in the Review Checklist explicitly."

Bad — no rationale path:
> "Review the DAG at [path]." — the reviewer needs the rationale to understand designer intent.

Bad — asks for revision:
> "Review the DAG and fix any problems you find." — the reviewer critiques only. Revision is a separate step.
