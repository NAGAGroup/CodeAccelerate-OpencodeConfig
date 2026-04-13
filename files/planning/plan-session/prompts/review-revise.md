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
Always store a compressed summary of the plan using qdrant_qdrant-store with {{PLAN_NAME}} for the collection directly before calling next_step.
Always continue to the next planning step. This is not the final planning step.
Always reason through each essential question regarding plan aspects that often go missed:
    - What is the exact markdown schema? How are branches handled in the schema? Are you following it?
    - Are write-notes phases used consistently throughout the plan? These are helpful in capturing core findings and changes made as the plan progresses. Notes are the primary means for subagents to get session context that only the orchestrator has direct access to.
    - Do any work phases need to be split up into individual phases?
    - What's the complexity for each work phase? How many retries do they require?
    - Does each phase of type [work] have a project-survey->external-research->internal-research->project-commands phase sequence directly preceding it? This is non-negotiable, early research phases do not count, this phase sequence must always precede each and every phase of type [work]. The only exceptions are external-research and project-commands. Use the dag-review-critieria skill to inform your decision on these two optional phases.
Always keep branching choices from the previous step. Add more if necessary. Remember, phase types can be added many times, in branches and sequential work. Don't limit yourself.
Overplanning is always better than underplanning.
Always include external-research before each and every phase of type [work] if the plan involves external dependencies. Never assume initial external research is enough nor rely on prior knowledge. Each external-research preceding [work] phases inform the approach of the specific work being done that earlier research couldn't capture due to being more generic and wide in scope or because it was specific to an earlier [work] phase.
Always include project-commands before each and every phase of type [work] if the plan involves any project configuration changes, dependency integrations, or build system changes. This is essential to ensure that the project is in the right state for the work phase to succeed. Never assume initial project-commands are enough nor rely on prior setup. Each project-commands preceding [work] phases inform the approach of the specific work being done that earlier commands couldn't capture due to being more generic and wide in scope or because it was specific to an earlier [work] phase.
</rules>

<instructions>
1. Think through the rules above and how it applies to your drafted plan. Be critical and honest with yourself.
2. Revise your plan as needed to meet the rules above. Present the revised plan in full.
3. Explain to the user how each revision addresses each rule or question.
4. Store a compressed summary of your revised plan using qdrant_qdrant-store with {{PLAN_NAME}} for the collection. This will be used during plan execution were the executing agent might not have all the same context you do. Make it count.
5. Call next_step immediately after storing the revised plan. Do not wait for user feedback. You are not done with planning.
</instructions>
