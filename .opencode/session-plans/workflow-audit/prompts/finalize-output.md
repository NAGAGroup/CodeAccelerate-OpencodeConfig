<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Node: finalize-output

Write the agreed output in the format determined collaboratively during the session.

## Delegation

**Agent:** @QuickDoc (haiku-like)
**Reason:** Single-file document write with well-structured input from the synthesize step.
**Task:** Write the improvement proposals artifact — a flat list of concrete proposed changes organized by workflow (Generic, Debug, Collaborative, Deep Research) — to `.opencode/session-plans/workflow-audit/proposals.md`. Input is the **Findings** section of `spec.md`.

HeadWrench handles all shell, build, and git steps.

## Advance

Call `close_session()` when output is complete.
