**Plan Name:** {{PLAN_NAME}}
**Required Skills:** planning-schema, planning-patterns
**Required Tools:** qdrant_qdrant-find
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Draft a complete phase-structured execution plan based on all investigation findings.
</goal>

<rules>
Always write the plan in markdown using the phase block format defined in the planning-schema skill — never JSON, never prose without the phase structure.
Never use agentic-decision-gate for user preference, creative choices, or undefined scope — use user-discussion.
Always precede every work phase with project-survey, then external-research (if external deps), then internal-research.
Always split decision branches directly from the gate — never deferred.
Always make every leaf a write-notes or early-exit phase.
</rules>

<instructions>
1. Load the planning-schema skill. Study the phase types and format.
2. Load the planning-patterns skill. Understand plan topologies.
3. Call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve the user's original goal.
4. To design the draft, reason through each essential question regarding plan aspects that often go missed:
    - What decisions need to be made and how do they branch into different exeuction pathways?
    - Do any work phases need to be split up into individual phases?
    - What's the complexity for each work phase? How many retries do they require?
    - Does every work phase have project-survey, external-research (when required), internal-research and project-commands (when required) phases directly preceding them (e.g. project-survey->external-research->internal-research->project-commands->work)? These phase types must be instanced multiple times, once for each work phase, and order matters. Running project commands to add dependencies is impossible without first doing external research on the dependencies and package management ecosystem first.
    - Are project-commands incorrectly being used to build and verify? This happens implicilty within the work phases via verification and retry attempts and should.
    - Are decision points immediately branching into separate execution paths? If they are not, this is wrong. Branch phases must always immediately branch, not store decisions for later branch points.
    - Is user discussion incorporated? If the user's goal explicitly states that they wanted to be included, then this is a hard requirement.
5. Ensure your draft plan matches the markdown schema from the planning-schema skill exactly. Do not modify capitalization, add fields, etc.
6. Explain your drafted plan to the user and why you chose what you did. Explicitly address each question from above.
7. Call next_step immediately after your explanation. Do not wait for user feedback.
</instructions>
