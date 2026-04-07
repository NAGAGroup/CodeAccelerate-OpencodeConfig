# DAG Node: Session Overview
**Skills:** following-plans
**Thinking Required:** No
**Questions Allowed:** No
**Required Tools:** choose_plan_name
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Establish plan identity by choosing a descriptive execution plan name that will be used as the Qdrant collection and execution plan identifier.

## Instructions
Use `choose_plan_name` to select a short, hyphenated, lowercase name that describes what the plan will accomplish — not what planning session it belongs to. The name populates all remaining node prompts and becomes the Qdrant collection identifier for this session.

## Constraints
- lowercase letters, numbers, hyphens only
- name describes the goal not the session
- call next_step immediately after choosing the name
- do not ask the user any questions
