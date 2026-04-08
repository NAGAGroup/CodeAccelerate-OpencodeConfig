**Plan Name:** {{PLAN_NAME}}
**Required Skills:** following-plans, qdrant-notes
**Required Tools:** get_dag_draft_diagram, show_dag_jsonl, qdrant_qdrant-find, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Execution Kickoff

## Goal
Orient to the plan structure and retrieve planning context before execution begins.

## Instructions

1. Call `get_dag_draft_diagram` to understand the plan's phases and branching structure
2. Call `show_dag_jsonl` to read exact node IDs, component types, and dependencies
3. Call `qdrant_qdrant-find` with collection `{{PLAN_NAME}}` to retrieve planning context — what was discovered, what constraints were documented, what rationale informed the design
4. Call `qdrant_qdrant-store` with collection `{{PLAN_NAME}}` to store executor-framed orientation notes — restate the goal and execution strategy from your perspective
5. Call `next_step`

## Thinking through the instructions

<|think|>
- Do I understand the full plan shape — all phases, branches, and terminal paths?
- Have I retrieved enough planning context to understand why the plan is structured this way?
- Are my orientation notes useful to later nodes — do they capture the execution strategy clearly?
