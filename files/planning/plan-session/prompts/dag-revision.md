**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-reviser
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: DAG Revision (Second Pass)

## Goal
Substantially improve the execution DAG using the full component library and the reviewer's critique.

## Instructions

1. Use the `dag-reviser` skill to compose a dispatch prompt — think through the reviewer's critique, your tentative assessment, and how they inform the improvements needed
2. Make sure you instruct the reviser to use `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` so that it has access to the reviewer's notes and planning context
3. Dispatch dag-reviser using the `task` tool with plan name `{{PLAN_NAME}}`, the reviewer's critique verbatim or closely paraphrased, your tentative assessment, and clear instructions that this is a second-pass improvement to address every critique point and elevate the DAG
4. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I included the reviewer's critique verbatim or closely paraphrased — the reviser needs the exact findings?
- Have I included my tentative assessment to provide additional context?
- Have I made clear this is a second-pass improvement, not just a fix pass — the reviser should substantially improve the DAG?
- Does the reviser know to use the full catalogue (no variant restriction)?
- Does the reviser have all the context needed to make good improvement decisions?
