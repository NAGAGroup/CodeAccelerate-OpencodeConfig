**Plan Name:** {{PLAN_NAME}}
**Required Skills:** mapping-plans-to-dags
**Required Tools:** get_planning_components_catalogue, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Synthesize all investigation findings into a draft plan document that captures the scope, approach, phases, key decisions, risks, and constraints for the user's request. This is a draft — it will be refined in subsequent steps.
</goal>

<rules>
Write in plain, human-readable language. No agentic terminology — no references to agents, subagents, dispatching, or delegation. The plan must read as something any developer could pick up and execute.
The plan must be goal-oriented. Work should not be decomposed into specific tasks. Those executing the plan are experts in their domain, let them solve task decomposition, you solve goal-driven plan decomposition.
This is a draft. There will be refinement steps, but it should still be a complete and detailed draft.
You must use the planning components, by concept not node types, in your drafted plan.
Your plan must include all external research required for each phase if the work requires external dependencies (e.g. how are dependencies added, accessing external docs for informing implementation steps, etc.)
Never asssume research during planning was enough, it is not.
Let the nature of the request determine the plan's structure. Organize into whatever logical sections suit the work (e.g. scope, approach, phases, decisions, risks, constraints, open questions).
Store the entire plan as a single qdrant_qdrant-store call — do not split it into multiple notes.
</rules>

<instructions>
1. Analyze the user's request to identify an explicit overall goal for the plan and what type of work the plan defines.
2. Call get_planning_components_catalogue to review the core planning concepts available to you. Write down planning requirements before continuing. Do not forget external research requirements in your plan document. External research is not limited to the first phase of the plan. It should be used throughout, just like exploring the project itself.
3. Load the mapping-plans-to-dags skill to understand how your plan will get converted into an executable DAG at later steps. This is to ensure your plan document does not violate DAG rules, making it unmappable.
4. Decompose the plan into phases and for each phase write down: internal project reserach, external research (e.g. how to add dependencies to the project, scouting info for making architectural decisions, external documentation on dependencies required for work-items, etc. Do not assume the research during the planning phase was enough, it's always safer to include excessive research steps than none at all), decision/verification gates, work items and project commands.
5. Synthesize all findings available in the session — the user's goal, project structure, research outcomes, constraints, and unresolved unknowns — into a coherent draft plan document.
6. Store the complete plan document as a single note using qdrant_qdrant-store in the {{PLAN_NAME}} collection.
7. Call next_step.
</instructions>
