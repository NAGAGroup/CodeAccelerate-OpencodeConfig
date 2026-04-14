**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** create_plan
**Optional Tools:** qdrant_qdrant-find
**Questions Allowed?:** No

<goal>
Critically review the drafted plan, revise it, and formalize it via the create_plan tool. Do not try to activate the plan. This will be decided after calling next_step by the user, you do not get to decide on plan activation at this step.
</goal>

<rules>
The plan must have a single entry point, which is a phase without `from` defined. Otherwise, every other phase must have the `from` field defined.
Always overplan rather than underplan — excess phases are recoverable, missing phases are not.
Always ensure every work phase has project-survey-topics and internal-research-questions. Add external-research-questions for any work touching external dependencies.
Always check that write-notes phases are distributed throughout — they ensure context is durable across session boundaries, so key decisions survive into later nodes where subagents can retrieve them.
Always check that every branching gate branches immediately with at least 2 distinct child phases.
Always check that user involvement uses user-discussion (no branching) or user-decision-gate (branch point from decision), not agentic-decision-gate.
Never treat branches as parallel work. Branches are decisions only, a choice between one of multiple independent execution pathways.
</rules>

<instructions>
1. Review your drafted plan against each rule above. Be honest about what is missing or wrong.
2. Explain all of the rules for plan design. Continue without waiting for feedback—this is merely to provide auditability.
3. Optionally call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "constraints and limitations from investigation" to retrieve constraints the scouts found, then verify the plan accounts for them.
4. Revise the plan. Present the revised version to the user. Continue without waiting for feedback—this is merely to provide auditability.
5. Call create_plan with plan name {{PLAN_NAME}} and the revised plan in TOML. The TOML must be syntactically valid — create_plan will fail on any syntax error.
6. If the create_plan tool returns an error, read and understand what it's saying went wrong and correct your plan. Call the create_plan tool until it succeeds, this is non-negotiable.
7. Call next_step.
</instructions>
