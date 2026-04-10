---
name: dag-design-example
description: Worked example of DAG design and construction — phase decomposition, tool call sequence, and expected output at each stage.
---
<example>
This example covers three phases and includes every core component at least once.
Every exit node is a write-notes node. Success exits capture what was accomplished; failure exits capture what went wrong.

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

Patterns: inter-phase branching, intra-phase branching with early exit, mutually exclusive phase 2 paths, convergence, single retry, commit after each successful verify.


Stage 1 — Build phase clusters (call get_compact_dag_draft after each phase):
  get_planning_components_catalogue(variant="core")

  add_nodes_to_dag(plan_name="my-plan", nodes={"plan": "sequential-thinking", "route": "decision-gate"})
  connect_nodes(plan_name="my-plan", edges={"plan": "route", "route": ["path-a-research", "path-b-work"]})
  get_compact_dag_draft(target="my-plan")

  add_nodes_to_dag(plan_name="my-plan", nodes={"path-a-research": "project-search-and-analysis", "early-check": "decision-gate", "write-notes-early-exit": "write-notes", "path-a-work": "work-item"})
  connect_nodes(plan_name="my-plan", edges={"path-a-research": "early-check", "early-check": ["write-notes-early-exit", "path-a-work"]})
  get_compact_dag_draft(target="my-plan")

  add_nodes_to_dag(plan_name="my-plan", nodes={"path-b-work": "work-item"})
  get_compact_dag_draft(target="my-plan")

  add_nodes_to_dag(plan_name="my-plan", nodes={"setup": "run-project-commands", "implement": "work-item", "verify-impl": "verify", "commit-success": "commit", "write-notes-success": "write-notes", "fix-impl": "work-item", "verify-impl-retry": "verify", "commit-retry": "commit", "write-notes-failure": "write-notes"})
  connect_nodes(plan_name="my-plan", edges={"setup": "implement", "implement": "verify-impl", "verify-impl": ["commit-success", "fix-impl"], "commit-success": "write-notes-success", "fix-impl": "verify-impl-retry", "verify-impl-retry": ["commit-retry", "write-notes-failure"], "commit-retry": "write-notes-success"})
  get_compact_dag_draft(target="my-plan")


Stage 2 — Wire clusters together:
  connect_nodes(plan_name="my-plan", edges={"path-a-work": "setup", "path-b-work": "setup"})
  get_compact_dag_draft(target="my-plan")
  get_dag_draft_diagram(target="my-plan")


Stage 3 — Set entry and exit points:
  set_entry_point(plan_name="my-plan", node_id="plan")
  set_exit_point(plan_name="my-plan", node_id="write-notes-early-exit", type="success")
  set_exit_point(plan_name="my-plan", node_id="write-notes-success", type="success")
  set_exit_point(plan_name="my-plan", node_id="write-notes-failure", type="failure")
  validate_dag(plan_name="my-plan")
</example>
