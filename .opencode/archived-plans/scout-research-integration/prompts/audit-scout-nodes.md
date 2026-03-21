# Subtask 1: Audit Scout Nodes

**Agent:** @ContextScout

## Goal

Understand the current implementation of scout nodes across all planning DAGs. Identify which DAGs have scout nodes, what they currently do, and where gaps exist for external research integration.

## What to Do

Read and analyze the planning DAG structure:

1. **Location:** `files/planning/` contains five planning DAG templates (plan-generic, plan-debug, plan-collaborative, plan-deep-research, plan-deep-review)
2. **For each template, find and read:**
   - `{template}/plan.json` — DAG node definitions
   - `{template}/prompts/scout.md` (if exists) — Current scout node instructions
3. **Document findings:**
   - Which DAGs have scout nodes?
   - What does each scout node currently do (what instructions does it give)?
   - How many nodes does each scout node have in its loop (if any)?
   - Are any scout nodes already aware of external resources or research tools?
   - Which scout nodes would benefit from external research capability?

## Acceptance Criteria

Return findings in this format:

```markdown
# Audit Findings: Planning DAG Scout Nodes

## Summary
- Total planning DAGs: X
- DAGs with scout nodes: X
- DAGs that mention external resources: X

## Per-DAG Findings

### plan-generic
- **Scout node exists:** Yes/No
- **Current purpose:** [summary of what scout.md says]
- **Mentions external resources:** Yes/No
- **Should have research integration:** Yes/No (why)

### plan-debug
[same structure]

### plan-collaborative
[same structure]

### plan-deep-research
[same structure]

### plan-deep-review
[same structure]

## Gaps Identified

1. [Gap 1: e.g., "plan-generic scout only covers codebase exploration, mentions nothing about external APIs"]
2. [Gap 2: ...]

## Recommendation

Which DAGs should receive research integration:
- Primary: [list]
- Optional: [list]
```

Do NOT read the entire prompt files—focus on structure and key patterns. Extract the essential current purpose of each scout node.

Call `next_step()` when your findings are ready.
