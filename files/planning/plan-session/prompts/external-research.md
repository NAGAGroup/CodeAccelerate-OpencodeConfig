**Plan Name:** {{PLAN_NAME}}
**Required Skills:** delegating-to-external-scout
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: External Research

## Goal
Research external public information that the project depends on or that scout findings raised questions about.

## Instructions

1. Use the `delegating-to-external-scout` skill to compose a dispatch prompt — identify specific research areas from the scout findings: frameworks, libraries, APIs, domain knowledge, or assumptions to verify
2. Dispatch external-scout using the `task` tool with plan name `{{PLAN_NAME}}`
3. Call `next_step`

## Thinking through the instructions

<|think|>
- What specific questions from the scout findings require external research?
- Have I used only public, general terms — no internal names or proprietary details?
- Have I asked for confidence tagging (verified, inferred, uncertain) and an unknowns section?
- Is the research question scoped narrowly enough to produce focused findings?
