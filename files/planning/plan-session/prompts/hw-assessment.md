**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Plan Assessment

## Goal
Provide tentative answers to the hard design questions that the reviewer will analyze in depth. You have all accumulated planning context — scout findings, research outcomes, the designer's rationale — so you can make educated guesses that guide the reviewer's analysis.

## Instructions

1. Load the `qdrant-notes` skill and use `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` to retrieve session notes — search for the user's goal, scout findings, research outcomes, and the designer's rationale
2. Think through each of the following questions and write tentative answers based on your accumulated context:

   **External research needs:**
   - Does this task involve external APIs, frameworks, libraries, or dependencies?
   - How confident are we in the agents' understanding of these external tools — is there any uncertainty that external scouting could resolve?
   - Is the planning-phase research sufficient, or would execution benefit from targeted research on implementation specifics?
   - External scouting is cheap. Err on the side of recommending it if there is any doubt.

   **Task complexity and retry counts:**
   - How complex is each major work phase? Are there phases that are significantly harder or riskier than others?
   - For the verify-retry structures in the first-pass DAG: are 1-retry defaults appropriate, or do some phases warrant more?
   - What are the likely failure modes — are they predictable (clear error messages) or ambiguous (could require multiple approaches)?

   **Routing sophistication:**
   - Is the task's true complexity knowable only after investigation? Would a short-path / long-path pattern help — where initial exploration determines whether the task is simpler or harder than expected?
   - Are there decisions that cascade — where each decision depends on findings from the previous one?
   - Are there multiple valid implementation approaches where the right choice depends on what the executor discovers?

   **User interaction points:**
   - Are there points in execution where user input would prevent wasted effort — ambiguous requirements, aesthetic choices, preference-dependent decisions?
   - Would the user benefit from reviewing intermediate results before proceeding?

   **Planning research sufficiency:**
   - Was the initial external research thorough enough, or are there gaps?
   - Are there assumptions from planning that should be verified during execution?

3. Store your tentative answers as a single note to `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}` — the reviewer will retrieve these
4. Call `next_step`

## Thinking through the instructions

<|think|>
- Am I drawing on all accumulated context — scout findings, research, designer rationale — not guessing in a vacuum?
- Am I erring on the side of recommending external scouting when there's any uncertainty about external dependencies?
- Am I assessing each work phase individually for complexity, not applying blanket assumptions?
- Am I being honest about confidence levels — marking where I'm uncertain so the reviewer can dig deeper?
- Have I stored my answers so the reviewer can retrieve them?
