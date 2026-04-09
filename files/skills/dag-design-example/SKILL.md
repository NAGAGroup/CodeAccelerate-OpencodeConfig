---
name: dag-design-example
description: Worked example of DAG design and construction — phase decomposition, tool call sequence, and expected output at each stage.
---
<overview>
This is a reference artifact. Study the phase decomposition and compact notation, then apply the same structure to the DAG you are building. Every exit node must be a write-notes node. Success exits capture what was accomplished; failure exits capture what went wrong.
</overview>

<example name="phase-decomposition">
This example covers three phases and includes every core component at least once.

Phase 1 — plan then branch:
(plan: sequential-thinking) → (route: decision-gate) → [path-a-research, path-b-work]

Phase 2a — investigation-first with early exit:
(path-a-research: project-search-and-analysis) → (early-check: decision-gate) → [write-notes-early-exit, path-a-work]
(path-a-work: work-item) → (setup: run-project-commands)
(write-notes-early-exit: write-notes)

Phase 2b — alternative path, converges to phase 3:
(path-b-work: work-item) → (setup: run-project-commands)

Phase 3 — implement with single retry:
(setup: run-project-commands) → (implement: work-item) → (verify-impl: verify) → [commit-success, fix-impl]
(commit-success: commit) → (write-notes-success: write-notes)
(fix-impl: work-item) → (verify-impl-retry: verify) → [commit-retry, write-notes-failure]
(commit-retry: commit) → (write-notes-success: write-notes)
(write-notes-success: write-notes)
(write-notes-failure: write-notes)

Patterns demonstrated:
inter-phase branching — route splits to path-a-research and path-b-work
intra-phase branching — early-check exits early or continues
mutually exclusive phase 2 paths — path-a and path-b both feed into setup
convergence — setup receives from both path-a-work and path-b-work
single retry — verify-impl → fix-impl → verify-impl-retry
commit placement — after each successful verify, before write-notes
</example>

<example name="stage-1-build-clusters">
Load the catalogue first.
  get_planning_components_catalogue(variant="core")

Phase 1:
  add_nodes_to_dag(plan_name="my-plan", nodes={"plan": "sequential-thinking", "route": "decision-gate"})
  connect_nodes(plan_name="my-plan", edges={"plan": "route", "route": ["path-a-research", "path-b-work"]})

Phase 2a:
  add_nodes_to_dag(plan_name="my-plan", nodes={"path-a-research": "project-search-and-analysis", "early-check": "decision-gate", "write-notes-early-exit": "write-notes", "path-a-work": "work-item"})
  connect_nodes(plan_name="my-plan", edges={"path-a-research": "early-check", "early-check": ["write-notes-early-exit", "path-a-work"]})
  get_compact_dag_draft(target="my-plan")

Phase 2b:
  add_nodes_to_dag(plan_name="my-plan", nodes={"path-b-work": "work-item"})
  get_compact_dag_draft(target="my-plan")

Phase 3:
  add_nodes_to_dag(plan_name="my-plan", nodes={"setup": "run-project-commands", "implement": "work-item", "verify-impl": "verify", "commit-success": "commit", "write-notes-success": "write-notes", "fix-impl": "work-item", "verify-impl-retry": "verify", "commit-retry": "commit", "write-notes-failure": "write-notes"})
  connect_nodes(plan_name="my-plan", edges={"setup": "implement", "implement": "verify-impl", "verify-impl": ["commit-success", "fix-impl"], "commit-success": "write-notes-success", "fix-impl": "verify-impl-retry", "verify-impl-retry": ["commit-retry", "write-notes-failure"], "commit-retry": "write-notes-success"})
  get_compact_dag_draft(target="my-plan")
</example>

<example name="stage-2-connect-clusters">
  connect_nodes(plan_name="my-plan", edges={"path-a-work": "setup", "path-b-work": "setup"})
  get_compact_dag_draft(target="my-plan")
  get_dag_draft_diagram(target="my-plan")
</example>

<example name="stage-3-entry-exit">
  set_entry_point(plan_name="my-plan", node_id="plan")

  set_exit_point(plan_name="my-plan", node_id="write-notes-early-exit", type="success")
  set_exit_point(plan_name="my-plan", node_id="write-notes-success", type="success")
  set_exit_point(plan_name="my-plan", node_id="write-notes-failure", type="failure")

  validate_dag(plan_name="my-plan")
</example>
