**Plan Name:** {{PLAN_NAME}}
**Required Skills:** planning-schema
**Required Tools:** qdrant_qdrant-find
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Draft a complete phase-structured execution plan based on all investigation findings.
</goal>

<rules>
Always create a plan that follows the markdown schema exactly. If you do this incorrectly, future planning steps will fail.
Never use agentic-decision-gate for user preference, creative choices, or undefined scope — use user-discussion.
Always split decision branches directly from the gate — never deferred.
Always make every leaf a write-notes or early-exit phase.
Always reason through each essential question regarding plan aspects that often go missed:
    - What is the exact markdown schema? How are branches handled in the schema? Are you following it?
    - What decisions need to be made and how do they branch into different exeuction pathways? Are these user-driven decisions or agentic decisions? If they are user-driven decisions, then [user-discussion] phases are a hard requirement.
    - Are decision points immediately branching into separate execution paths? If they are not, this is wrong. Branch phases must always immediately branch, not store decisions for later branch points.
    - Are branch naming conventions being followed? Branches are indicated by a lowercase letter subscript. For example, <phase a start>a-<phase a end>a is branch "a". Phases don't need to merge back and can early-exit, have varying lenghts before merging to handle unknown complexities at planning, etc. They are completely separate execution pathways.
    - Is there a work phase for scaffolding before any implementation work takes place? This includes things like integrating dependencies via package management and build system configuration files, any other project configuration changes, etc.
Always continue to the next planning step immediately without waiting for user feedback. This is not the final planning step.
</rules>

<instructions>
1. Load the planning-schema skill. Study the phase types and format.
2. Draft your plan, pay special attention to the questions above. Present it to the user verbatim.
3. Call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve the user's original goal and desired involvement. Do they want to make architectural decisions? Do they want to be involved in ideation and brainstorming? These are the types of questions that, if yes, you must include [user-discussion] phases for. If they want to be involved in decision-making, then you must use [user-discussion] phases to capture their input at the appropriate points in the plan.
4. Ensure your draft plan matches the markdown schema from the planning-schema skill exactly. Do not modify capitalization, add fields, etc.
5. Call next_step immediately. You are not done with planning, do not begin executing the plan.
</instructions>
