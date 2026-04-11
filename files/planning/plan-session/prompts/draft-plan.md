**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Synthesize all investigation findings into a draft plan document that captures the scope, approach, phases, key decisions, risks, and constraints for the user's request. This is a draft — it will be refined in subsequent steps.
</goal>

<rules>
Write in plain, human-readable language. No agentic terminology — no references to agents, subagents, dispatching, or delegation. The plan must read as something any developer could pick up and execute.
The plan must be goal-oriented. Work should not be decomposed into specific tasks. Those executing the plan are experts in their domain, let them solve task decomposition, you solve goal-driven plan decomposition.
This is a draft. Completeness and polish are not required. Gaps and uncertainties are acceptable — they will be addressed in refinement steps.
Let the nature of the request determine the plan's structure. Organize into whatever logical sections suit the work (e.g. scope, approach, phases, decisions, risks, constraints, open questions).
Store the entire plan as a single qdrant_qdrant-store call — do not split it into multiple notes.
</rules>

<instructions>
1. Analyze the user's request to identify an explicit overall goal for the plan and what type of work the plan defines.
2. Synthesize all findings available in the session — the user's goal, project structure, research outcomes, constraints, and unresolved unknowns — into a coherent draft plan document.
3. Organize the plan into logical sections appropriate to the work. Let the content determine the structure.
4. Store the complete plan document as a single note using qdrant_qdrant-store in the {{PLAN_NAME}} collection.
5. Call next_step.
</instructions>
