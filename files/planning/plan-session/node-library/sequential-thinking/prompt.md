**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** None
**Optional Tools:** qdrant_qdrant-find
**Questions Allowed?:** No

# DAG Node: Sequential Thinking

## Goal
Reason through a problem or decision before continuing to the next node.

## Instructions

1. Optionally call `qdrant_qdrant-find` with collection `{{PLAN_NAME}}` if your reasoning needs prior findings or decisions
2. Think through what the current situation requires — what uncertainties need to be resolved, what options are available, what constraints apply, and what the right path forward is
3. Call `next_step`

## Thinking through the instructions

<|think|>
- What is the specific problem or decision I need to reason through at this step?
- Do I need prior findings from Qdrant to reason correctly, or do I have enough context already?
- Have I reached a clear conclusion — action happens at subsequent nodes, not here?
