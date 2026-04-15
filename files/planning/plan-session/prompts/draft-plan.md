# Creating the Plan

Craft a plan as an executable DAG of a modular set of phase types. The plan will be locked in by calling `create_plan`.

Do not activate the plan, this step is only for locking in the plan as a finalized DAG. It is up to the user when and where activation happens. They will be made aware of how to activate automatically via the planning DAG, do not suggest they activate it either.

## Hard Rules (violating any = task failure)

1. All plans have only a single entry point. This is the first phase and is marked by leaving the `from` field empty.
2. All phases, except the entry point, must have the `from` field defined. It is always a list of parent phases indicating the order of execution, even if a phase only has one parent.
3. Branches in plans never indicate parallel work, this is unsupported. Branches define decision points on one of multiple possible execution pathways. Leverage branches for handling unknowns during planning that, once resolved during execution, resolve to different execution requirements (e.g. differences in scope/complexity, the type of work being done, etc)
4. Only decision phase types can branch (e.g. multiple phases share the same phase in their `from` list). These are `agentic-decision-gate` and `user-decision-gate`. If a decision does *not* result in different execution requirements (e.g. framework decisions that affect APIs but not implementation steps), decision gates should not be used. Instead, keep execution linear and instead use something like a `write-notes` phase to lock in decisions.
5. If the user's request indicated collaborative work, then your plan *must* include at least one `user-discussion` and/or `user-decision-gate`. If the nature of the collaboration was ongoing collaboration throughout (e.g. not just a single initial collaborative phase at the beginning), then these two phase types should be dispersed throughout the entire plan. If you are unsure use the `question` tool *now* to resolve any uncertainties regarding collaborative effort.
6. Always define `external-research-questions` in `work` phases if the user's request depends on any external resources. *Every* work phase must have this field defined if there are external dependencies at *any* point in the plan. Never assume earlier phases covering external research to be enough. We as planners operate on the philosophy that it's better safe than sorry, as we *must* remember that once a plan is activated, it can not be modified during execution. We want executors to have more than enough built-in to the plan to maximize success probability.
7. Always keep each `work` phase tightly scoped, this improves odds of success. It's better to have many sequential `work` phases than a single monolithic one.

## Key Concepts

The rules capture what is required or explicitly not allowed. However, they don't capture nuanced patterns that are allowed but not required.

1. Merge points are allowed. Unlike branch points, any phase type can be a merge point. Merge points are phases that have >1 parent phases defined in their `from` field.
2. Branches need not merge. Any leaf phase is a valid exit point, although it is highly recommended to always use `write-notes` or `early-exit` phase types. The latter of those types also highlights a common pattern: branch points allowing early exit pathways. Some examples of where this might be used are:

    - Resolving unknowns during execution that reveal it's better to just create a new plan, rather than continue with a plan that is less than ideal to handle the resolved unknown or unknowns
    - A user decision gate where the user ends up deciding they want to pivot to something radically different than what was planned for
    - Giving an exit pathway for early completion of the user's request. It's always better to overplan than underplan, however overplanning without early exit points can lead to execution of many unnecessary phases just to finish the plan. Instead decision gates can be added that allow agents or the user to early exit or continue with the main execution path depending on the progress at that point that can only be known during execution.
3. Nested branching is allowed. Don't limit yourself to only on level of branching. If nested branching patterns could produce a more robust plan, do it! It's 100% allowed and encouraged.
4. Phase types are not single-use. Any phase type can be used many times throughout a plan. Again, this is encouraged!
5. While not strictly forbidden, it's discouraged to incorporate failure handling after `work` phases. The DAG execution backend has recovery mechanisms from failed work items built-in to the `work` phase type.
6. Similarly, keep exploratory and project setup phases (e.g. project-survey, external-research, internal-research, project-setup) limited to only what is necessary to make decisions during execution. The `work` phase type has these phases built-in for handling these tasks as they relate to doing work (e.g. API docs, setting up dependencies or build systems, targeted project survey and analysis related to the work item, etc.).

## Preflight Checklist (fill out the preflight before continuing)


1. Call `qdrant_qdrant-find` using `collection_name={{PLAN_NAME}}` and query "user goal and request".
2. Call `qdrant_qdrant-find` using `collection_name={{PLAN_NAME}}` and query "user involvement and constraints".
3. Call `qdrant_qdrant-find` using `collection_name={{PLAN_NAME}}` to refresh findings from the exploratory work done in the previous steps. Decide on 5-7 queries and call the tool for each one.
4. Load the `planning-schema` skill. This is the complete list of available phase types and their fields.
4. Fill out the following fully before continuing.

```toml
[preflight]
user_goal_and_request = <summarize the user's overall goal and specific request in one sentence>
collaborative_effort = <true/false>
collaboration_phases = <if collaborative_effort is true, list out the collaboritive planning phases>
core_findings_from_exploratory_work = <list of core findings from exploratory work that are relevant to planning>
entry_point = <phase type and purpose of the entry point phase>
core_decision_points = <list of all core user or agentic decisions that must be made during execution>
branching_decision_points = <list of core decision points that require branching pathways in the plan>
work_items = <list of work items that need to be done to fulfill the user's request, based on the findings and decisions above>
pre_work_research = <list of internal and external research items that need to be done before each work item, this informs filling out the pre-work fields in the work phase type>
pre_work_project_setup = <list of project setup tasks that need to be done before each work item, this informs filling out the pre-project-setup fields in the work phase type>
merge_points = <list of any merge points in the plan, this informs filling out the from field in each phase>
exit_points = <list of exit points in the plan, this informs filling out the phase types and from fields for exit pathways>
```

## Plan Drafting Protocol

From your preflight checklist and understanding of planning rules/concepts, draft the full plan in `toml` format. Ensure the entry point has no `from` field defined and that there is only one.

This is a drafting step, do not call `create_plan` yet.

## Gate (fill out the toml before continuing)


```toml
[gate]
single_entry_point = <true/false>
valid_branching = <true/false>
prework_research_requirement_met = <true/false>
prework_project_setup_requirement_met = <true/false>
collaborative_phases_requirement_met = <true/false>
plan_completeness = <true/false, does it cover all requirements? are you happy with it? all hypothesized gaps/unknowns resolved?>
gate_passed = <true/false>
```

Do not call `create_plan` or `next_step` until `gate_passed=true`.

## How to Proceed

Call `create_plan` with `plan_name={{PLAN_NAME}}` and the `toml`-formatted plan in full. For any tool call errors, read the error messages, understand them and retry until the tool call succeeds.

Once `create_plan` succeeds, call `next_step` immediately. Do not wait for user instruction to proceed. The next step summarizes the planning session to the user, what was created and how to proceed.


