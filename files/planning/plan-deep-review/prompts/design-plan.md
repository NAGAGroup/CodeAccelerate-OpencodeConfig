# Design Plan: Structure the Review DAG

Your task is to **design the executable review project DAG** based on all planning decisions made.

## What You Have

From planning:
- Review target, purpose, and stakeholders
- Review criteria and quality standards (with standards alignment reasoning)
- In-scope/out-of-scope areas and coverage map
- Assessment steps with scope and success criteria
- Agent routing: reviewer types and model tiers
- Review output definition and report structure

## What to Design

You will structure the DAG in `.opencode/session-plans/{review-name}/plan.json`:

### DAG Structure
- **Typical shape for review:** 1A-linear (sequential assessment steps)
  - If risk-based: add gates between steps for conditional routing
  - If coverage-based: linear with different depth per step

### Nodes Definition
1. **session-overview** — Context for the reviewing agent
2. **{assessment-step-1}** through **{assessment-step-N}** — One node per review step
3. **finalize** — Terminal node (review complete, report ready)

### Node Details
For each node:
- **id:** Step identifier (e.g., "architecture-review", "security-audit", "performance-baseline")
- **type:** "agent" for review steps
- **prompt:** Path to prompt file (e.g., "planning/plan-deep-review/prompts/architecture-review.md")
- **next:** Next step (string for linear; object with branches if gates exist)
- **Terminal node (finalize):** No `next` field

## Plan.json Structure

```json
{
  "schema_version": "1.0",
  "id": "{review-name}",
  "session_type": "deep-review",
  "description": "Review DAG for {brief description}",
  "goal": "Systematic review of {target} against {criteria}",
  "entry": "session-overview",
  "nodes": {
    "session-overview": { ... },
    "step-1": { ... },
    "step-2": { ... },
    ...
    "finalize": { ... }
  }
}
```

## Output

Draft plan.json structure with:
- All nodes listed with ids, types, and next references
- Branching logic (if any gates/conditions)
- Node count and flow diagram (text format)
- Validation notes: all nodes referenced in `next` exist; no orphan nodes

Do NOT write the JSON yet; format as outline/text for preview.

Call `next_step()` when ready for preview.
