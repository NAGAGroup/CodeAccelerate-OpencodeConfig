**Plan Name:** {{PLAN_NAME}}
**Required Skills:** delegating-to-context-scout
**Required Tools:** task
**Optional Tools:** qdrant_qdrant-find
**Questions Allowed?:** No

# DAG Node: Project Search and Analysis

## Goal
Investigate the project to answer specific questions needed to continue execution.

## Instructions

1. Optionally call `qdrant_qdrant-find` with collection `{{PLAN_NAME}}` to check what has already been discovered before dispatching
2. Use the `delegating-to-context-scout` skill to compose a dispatch prompt — think through what specific questions the scout should answer and what context it needs
3. Dispatch context-scout using the `task` tool with plan name `{{PLAN_NAME}}`
4. Call `next_step`

## Thinking through the instructions

<|think|>
- What specific questions do I need answered to continue — am I asking for investigation, not changes?
- Have I checked prior findings so I'm not re-investigating what's already known?
- Is my dispatch prompt goal-oriented — describing what to understand, not which files to read?
