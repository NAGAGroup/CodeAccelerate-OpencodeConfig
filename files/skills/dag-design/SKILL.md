---
name: dag-design
description: Dispatch a DAG design agent
---

# Dispatching the DAG Design Agent

## How to Call the task Tool

Call the `task` tool with exactly these three fields:

- `subagent_type`: always the string `"headwrench"`
- `description`: a short 3–5 word label (for logging only, not seen by the agent)
- `prompt`: your full delegation prompt as a single string

Example call:

```
task(
  subagent_type="headwrench",
  description="Design execution DAG",
  prompt="Design an execution DAG for the following goal: [goal]. Scope: [boundaries]. Planning notes are at [path]. Call get_planning_components_catalogue and get_dag_design_guide before designing. Write the DAG to [plan path] and the rationale to [rationale path]."
)
```

Do not include `task_id`. Omit it entirely.

## What the DAG Design Agent Does

The DAG design agent is a full HeadWrench instance. It reads the planning context, designs an execution DAG from the component library, writes it as a plan.jsonl file, and produces a rationale document.

The design agent has access to `get_planning_components_catalogue` and `get_dag_design_guide`. It must call both before designing.

## How to Write a Good Delegation Prompt

Your prompt should:
1. State the user's goal and any scope boundaries.
2. Provide the planning notes path so the agent can read accumulated findings.
3. Tell it the output path for plan.jsonl (under `.opencode/session-plans/`).
4. Tell it to call `get_planning_components_catalogue` and `get_dag_design_guide` before designing.
5. Tell it to produce: the plan.jsonl DAG and a rationale document at `{{SESSION_PATH}}/notes/rationale.md`.

## What the Design Agent Returns

- Confirmation that plan.jsonl was written and its path.
- Confirmation that rationale.md was written and its path.
- A brief summary of the DAG structure it designed.

## Examples

Good — complete context provided:
> "Design an execution DAG for the following goal: [goal]. Scope: [boundaries]. Planning notes are at [path]. Write the DAG to [plan path] and the rationale to [rationale path]. Call get_planning_components_catalogue and get_dag_design_guide before designing."

Bad — no planning context:
> "Design a DAG for [goal]." — the agent needs accumulated findings, not just the goal.

Bad — no output paths:
> "Design a DAG." — always specify where to write the output.
