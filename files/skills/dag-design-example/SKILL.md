---
name: dag-design-example
description: Worked example of DAG design and construction — phase decomposition, tool call sequence, and expected output at each stage.
---
# DAG Design Example

This skill provides a complete worked example of designing and building an execution DAG using the staged workflow from the `build-dags` skill.

## Phase planning example

```
Phase 1 — decision-gate with immediate convergence:
  work-A → decision-gate-A
    ├─ → work-A-option-1 → work-B (converge)
    └─ → work-A-option-2 → work-B (converge)

Phase 2 — sequential work with early success check:
  work-B → work-C → decision-gate-early-check
    ├─ → plan-success (early exit example — goal already satisfied) (wired up at the end, leave success paths dangling until then)
    └─ → decision-gate-routing
           ├─ → [Phase 3a entry]
           └─ → [Phase 3b entry]

Phase 3a — single retry, converges to Phase 4:
  work-D → verify-D
    ├─ (pass) → work-F (converge with Phase 3b)
    └─ (fail) → fix-D → verify-D-retry
                           ├─ (pass) → work-F (converge)
                           └─ (fail) → plan-fail (wired up at the end, leave failure paths dangling until then)

Phase 3b — two retries, converges to Phase 4:
  work-E → verify-E
    ├─ (pass) → work-F (converge with Phase 3a)
    └─ (fail) → fix-E-1 → verify-E-retry-1
                             ├─ (pass) → work-F (converge)
                             └─ (fail) → fix-E-2 → verify-E-retry-2
                                                     ├─ (pass) → work-F (converge)
                                                     └─ (fail) → plan-fail (wired up at the end, leave failure paths dangling until then)

Phase 4 — sequential to success:
  work-F → plan-success (wired up at the end, leave success paths dangling until then)
```

**Then define the wiring between phases:**
```
work-B connects Phase 1 exit to Phase 2 entry (convergence node)
decision-gate-early-check routes to plan-success (early exit, wired up at the end) or decision-gate-routing
decision-gate-routing routes to work-D (Phase 3a) or work-E (Phase 3b)
work-F connects Phase 3a/3b exits to Phase 4 entry (convergence node)
```

## Applying the workflow

<|think|>
Think through the following application of the staged workflow to the example above and how it generalizes to the DAG you're designing.

### Load the Catalogue

```
# ── Load catalogue ──
get_planning_components_catalogue()
```

### Stage 1: Build phase clusters

```
# ── Stage 1: Build phase clusters ──

# Phase 1
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-A": "work-item", "decision-gate-A": "decision-gate", "work-A-option-1": "work-item", "work-A-option-2": "work-item"}')
connect_nodes(plan_name="my-plan", edges='{"work-A": "decision-gate-A", "decision-gate-A": ["work-A-option-1", "work-A-option-2"]}')
get_compact_dag_draft(target="my-plan")

# Phase 2
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-B": "work-item", "work-C": "work-item", "decision-gate-early-check": "decision-gate", "decision-gate-routing": "decision-gate"}')
connect_nodes(plan_name="my-plan", edges='{"work-B": "work-C", "work-C": "decision-gate-early-check", "decision-gate-early-check": "decision-gate-routing"}')
get_compact_dag_draft(target="my-plan")

# Phase 3a
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-D": "work-item", "verify-D": "verify", "fix-D": "work-item", "verify-D-retry": "verify"}')
connect_nodes(plan_name="my-plan", edges='{"work-D": "verify-D", "verify-D": ["work-F", "fix-D"], "fix-D": "verify-D-retry"}')
get_compact_dag_draft(target="my-plan")

# Phase 3b
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-E": "work-item", "verify-E": "verify", "fix-E-1": "work-item", "verify-E-retry-1": "verify", "fix-E-2": "work-item", "verify-E-retry-2": "verify"}')
connect_nodes(plan_name="my-plan", edges='{"work-E": "verify-E", "verify-E": ["work-F", "fix-E-1"], "fix-E-1": "verify-E-retry-1", "verify-E-retry-1": ["work-F", "fix-E-2"], "fix-E-2": "verify-E-retry-2"}')
get_compact_dag_draft(target="my-plan")

# Phase 4
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-F": "work-item"}')
get_compact_dag_draft(target="my-plan")
```

### Stage 2: Connect phase clusters

> [!IMPORTANT]
> You do not need to redo any connections within phase clusters, only those that connect different phases together, so this stage is much faster than Stage 1. You can also connect phases in any order you like, just make sure to connect all of them before moving on to Stage 3.

```
# ── Stage 2: Connect phase clusters ──
connect_nodes(plan_name="my-plan", edges='{"work-A-option-1": "work-B", "work-A-option-2": "work-B", "decision-gate-routing": ["work-D", "work-E"], "verify-D-retry": "work-F", "verify-E-retry-2": "work-F"}')
get_compact_dag_draft(target="my-plan")
get_dag_draft_diagram(target="my-plan")
```

### Stage 3: Connect kickoff and terminal nodes

```
# ── Stage 3: Connect kickoff and terminal nodes ──

connect_nodes(plan_name="my-plan", edges='{"execution-kickoff": "work-A", "decision-gate-early-check": "plan-success", "work-F": "plan-success", "verify-D-retry": "plan-fail", "verify-E-retry-2": "plan-fail"}')
validate_dag(plan_name="my-plan")
```

## Thinking through this skill

<|think|>
- how does the staged workflow help structure your approach to building complex DAGs?
- using this as a guide, how would you approach building the DAG for your current plan? What are the different phases you would define and why?
- plan out all stages before you start building, then follow the workflow stage by stage to build your DAG. How does this structured approach compare to how you would have built the DAG without it?
