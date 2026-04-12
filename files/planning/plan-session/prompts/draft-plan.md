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
4. To design the draft, reason through each question:
   - What does the user need to decide or approve? Make a mental note of your answer.
   - What research is needed before each phase can succeed? Make a mental note of your answer.
   - What can be executed and decided autonomously? Make a mental note of your answer.
5. Ensure your plan has correct headings, valid phase types, lowercase field names, `from:` as JSON array on every non-first phase, descriptive phase IDs, every branching phase has ≥2 direct children.
6. Call next_step.
</instructions>
