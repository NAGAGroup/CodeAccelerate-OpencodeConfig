**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-designer
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: DAG Revision

## Goal
Revise the execution DAG to address the reviewer's critique in a single pass.

## Instructions

1. Use the `dag-designer` skill to compose a dispatch prompt — think through the reviewer's critique, which issues are most important, and how to communicate each clearly
2. Dispatch dag-designer using the `task` tool with plan name `{{PLAN_NAME}}`, the reviewer's critique verbatim or closely paraphrased, and clear instructions that this is one revision round to address every critique point
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I included the reviewer's critique verbatim or closely paraphrased — the designer needs the exact issues?
- Have I made clear this is a single revision round covering all critique points?
- Does the designer have all the context needed to revise correctly?
