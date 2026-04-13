**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Review your drafted plan according to strict criteria.
</goal>

<rules>
Always include the required pre-work phase sequences in your plan, even if it seems excessive. Overplanning is always better than underplanning.
Always adhere to the markdown schema format in your revised plan. If this is wrong, then the next planning step will fail.
Always reason through each essential question regarding plan aspects that often go missed:
    - What is the exact markdown schema? How are branches handled in the schema? Are you following it?
    - What is the user involvement? If there is user involvement required, then use [user-discussion], not [agentic-decision-gate] for those decisions. Are you following this rule?
    - Are write-notes phases used consistently throughout the plan? These are helpful in capturing core findings and changes made as the plan progresses. Notes are the primary means for subagents to get session context that only the orchestrator has direct access to.
    - Do any work phases need to be split up into individual phases?
    - What's the complexity for each work phase? How many retries do they require?
    - Does each phase of type [work] have a project-survey->external-research->internal-research->project-setup phase sequence directly preceding it? This is non-negotiable, early research phases do not count, this phase sequence must always precede each and every phase of type [work]. The only exceptions are external-research and project-commands, they are not required when there are no external dependencies or project commands necessary to do the work.
    - Do all branches only branch from [user-discussion] or [agentic-decision-gate]? If not, this is wrong. Only those two types allow branches.
Always keep branching choices from the previous step. Add more if necessary. Remember, phase types can be added many times, in branches and sequential work. Don't limit yourself.
Overplanning is always better than underplanning.
Always continue to the next planning step. This is not the final planning step.
</rules>

<instructions>
1. Think through the rules above and how it applies to your drafted plan. Be critical and honest with yourself.
2. Revise your plan as needed to meet the rules above. Use qdrant_qdrant-store with {{PLAN_NAME}} as the collection to write the revised plan verbatim. If the plan is not stored verbatim, the next step in the planning process that builds an executable DAG will fail.
3. Explain to the user how each revision addresses each rule or question.
4. Call next_step immediately after storing the revised plan. Do not wait for user feedback. You are not done with planning.
</instructions>
