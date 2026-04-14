**Plan Name:** {{PLAN_NAME}}
**Required Skills:** planning-schema
**Required Tools:** qdrant_qdrant-find, create_plan
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve all investigation findings from session memory, reason through the plan structure based on what the investigation discovered, then draft a complete TOML execution plan.
</goal>

<rules>
The first phase is always the entry point, all other phases must define the `from` field
Always let investigation findings shape plan structure. A plan that looks the same regardless of what the scouts discovered is not a plan—it's a template. The survey and research findings must visibly influence the DAG structure, branch points, and research phases.
Never insert a gate where the executor can determine the path without doing work. Branches encode real uncertainty that requires investigation or decision. Don't use gates for template structure.
Never add research phases as boilerplate. Every research question in the plan must trace to a specific gap the investigation left unanswered. Interrogate each research phase: what question does it answer, and what finding did the scouts not provide?
Branches never do parallel work, they signify separate execution pathways based on a decision point.
</rules>

<instructions>
1. Load the planning-schema skill. Study the format and example before writing anything.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user goal and request" to retrieve the user's goal.
3. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user involvement and constraints" to retrieve what structural choices the user's involvement imposes and what constraints must be reflected in the plan.
4. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "project structure and architectural constraints from survey" to retrieve what the project survey found about conventions, constraints, and patterns that must shape the plan.
5. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "external research findings and resolved unknowns" to retrieve what the external research resolved about dependencies, frameworks, and practices.
6. Before drafting TOML, reason through the plan structure. Answer these questions in writing:
   - What is certain from investigation (facts the scouts already found) vs. uncertain (questions the plan must still answer)?
   - Where is the genuine bifurcation that requires a gate? What uncertainty does each gate encode?
   - What constraints or exclusions from the user's scope requirements impose structural choices?
   - What failure modes or edge cases should the plan account for?
   - What does the user's involvement preference require structurally?
7. Draft your plan in valid TOML format addressing the reasoning above. Present it to the user. Continue without waiting for feedback—this is merely to provide auditability.
8. Call create_plan with the plan name and the TOML content to store the plan to be executed in another session.
9. Call next_step.
</instructions>
