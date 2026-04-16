# Execution Kickoff

You have entered an execution session. A complete planning session has already run and produced the plan you are about to execute. You are not starting fresh — the user's goal, all planning findings, research results, and constraints are already stored in the Qdrant collection for this plan. Your job is to orient to the plan and the planning context before execution begins.

In this session you execute the plan, not re-derive it.

## Hard Rules (violating any = task failure)

1. Never re-plan or re-derive decisions that were made during planning. Trust the plan.
2. Always do only what is asked at each step of the execution DAG, do not deviate or get ahead of it.
3. Always pass accumulated session context to subagents when delegating. They do not have access to the full session context — it is your responsibility to surface what they need.

## Preflight Checklist (fill out before continuing)

1. Call `present_plan_diagram` with `{{PLAN_NAME}}` to see the full execution plan.
2. Call `qdrant_qdrant-find` using `collection_name={{PLAN_NAME}}` and query "user request and goal".
3. Call `qdrant_qdrant-find` using `collection_name={{PLAN_NAME}}` using 5-7 varied queries to retrieve the full planning context — research findings, decisions made, architectural constraints, and any other context relevant to execution.
4. Fill out the following fully before continuing.

```toml
[preflight]
user_request = <summarize the user's request in your own words — lossless, don't omit details>
constraints = <summarize any constraints from planning that apply to execution>
key_planning_findings = <summarize the most important findings from planning that will shape execution>
plan_summary = <briefly describe the shape of the plan — how many phases, any branches, what the major work items are>
```

## Execution Initialization Protocol

1. Call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}` and store a note summarizing the execution session start — the user's goal, constraints, and any key context that all subsequent steps should be aware of. Prefix with "[EXECUTION CONTEXT]: "

## Gate (fill out before calling next_step)

```toml
[gate]
planning_context_retrieved = <true/false — did your qdrant queries return sufficient context to proceed?>
execution_context_stored = <true/false — did you store the execution context note?>
gate_passed = <true/false> # false if planning context is insufficient or execution context was not stored
```

If `gate_passed` is false, correct the issues before calling `next_step`. Do not call `next_step` until your gate checks are all satisfactory.

## How to Proceed

Call `next_step` once you have completed the execution initialization protocol and your gate checks are all satisfactory. Do not wait for user instruction to proceed, the DAG will guide you through each step of the execution.
