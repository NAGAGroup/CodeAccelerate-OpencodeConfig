**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Provide tentative answers to the hard design questions that the reviewer will analyze in depth.
</goal>

<instructions>
1. Load the qdrant-notes skill and use qdrant_qdrant-find with collection_name={{PLAN_NAME}} to retrieve session notes — search for the user's goal, scout findings, research outcomes, and the designer's rationale.
2. Think through each of the following questions and write tentative answers based on accumulated context:

External research needs:
Does this task involve external dependencies whose behavior or current state is uncertain? How confident are we in the agents' understanding of these — is there uncertainty that external scouting could resolve? Is the planning-phase research sufficient, or would execution benefit from targeted research on implementation specifics? External scouting is cheap — err on the side of recommending it if there is any doubt.

Task complexity and retry counts:
How complex is each major work phase? Are there phases that are significantly harder or riskier than others? For the verify-retry structures in the first-pass DAG: are 1-retry defaults appropriate, or do some phases warrant more? What are the likely failure modes — are they predictable or ambiguous?

Routing sophistication:
Is the task's true complexity knowable only after investigation? Would a short-path / long-path pattern help? Are there decisions that cascade — where each decision depends on findings from the previous one? Are there multiple valid approaches where the right choice depends on what the executor discovers?

User interaction points:
Are there points in execution where user input would prevent wasted effort — ambiguous requirements, preference-dependent decisions? Would the user benefit from reviewing intermediate results before proceeding?

Planning research sufficiency:
Was the initial external research thorough enough, or are there gaps? Are there assumptions from planning that should be verified during execution?

3. Store tentative answers as a single note to qdrant_qdrant-store with collection_name={{PLAN_NAME}} — the reviewer will retrieve these.
4. Call next_step.
</instructions>

<check>
1. Am I drawing on all accumulated context — scout findings, research, designer rationale — not guessing in a vacuum?
2. Am I erring on the side of recommending external scouting when there is any uncertainty?
3. Am I assessing each work phase individually for complexity, not applying blanket assumptions?
4. Am I being honest about confidence levels — marking where I am uncertain so the reviewer can dig deeper?
5. Have I stored my answers so the reviewer can retrieve them?
</check>
