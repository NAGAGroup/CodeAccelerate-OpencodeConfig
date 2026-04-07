# E2E Testing Strategy — Planning DAG

**Last updated:** 2026-04-06
**Status:** Infrastructure built, not yet run

---

## Goal

Validate that headwrench can execute the full planning DAG (`/plan-session`) end-to-end on a real goal without deviation, stalling, or needing user nudging. The E2E tests complement the per-subagent Phase 1 tests by testing the orchestration layer — headwrench's ability to follow node instructions, load skills, write good delegation prompts, and drive the session to completion.

---

## What Is Being Tested

The E2E runner sends a single prompt in the format produced by `/plan-session` slash command expansion (replacing `$ARGUMENTS` with a real planning goal). Headwrench receives this as its first message and must call `plan_session` immediately to enter the planning DAG. The runner then monitors the full multi-turn session across all 11 DAG nodes.

**Five evaluation dimensions:**

1. **Skill loading** — Did headwrench load the correct skills at each node? Each node's prompt header declares which skills are needed. Skills are exempt from enforcement blocking, so loading is voluntary but expected.

2. **Node instruction adherence** — Did headwrench satisfy the enforcement sequence for each node? Getting blocked by an enforcement error and recovering counts as success — the important thing is that the required tools are eventually called in order.

3. **Delegation prompt quality** — Are dispatch prompts to subagents goal-based? Do they describe what to understand or accomplish, not which files to read or what steps to take? Captured in `response_text` per node for human review.

4. **DAG quality** — Does the generated execution DAG describe phases and decision gates rather than specific implementation steps? Captured for human review via the dag-designer's output.

5. **Completion without nudging** — Does the session reach `plan-success` and output a valid plan name and `/activate-plan` instruction without any additional user prompts?

---

## Infrastructure

### Files

| File | Purpose |
|------|---------|
| `test/e2e-runner.ts` | Multi-turn runner — monitors SSE, tracks per-node results, stores to Qdrant |
| `test/e2e-prompts.ts` | Pool of 4 planning goals in slash command expansion format |

### Running

```bash
# Start the server first (if not already running)
bun run test:setup

# Run all 4 tests, 1 trial each
bun run test:e2e

# Run a specific test
bun run test:e2e -- --test=add-math-function

# Run with multiple trials
bun run test:e2e -- --test=add-math-function --trials=2

# Start server and run all tests
bun run test:e2e:full
```

### Server

```
ocx oc -p naga-ollama serve --port 4096
```

Headwrench runs as the primary agent (agentId: `headwrench`). The model is Qwen3.5:9b via naga-ollama profile with `reasoningEffort: "none"`.

### Qdrant

Results are stored to collection `e2e-test-harness` at `http://localhost:6333`. Each result record contains:
- `test_id`, `trial_number`, `session_id`, `timestamp`
- `node_results[]` — per-node breakdown with tool sequence, skills loaded, enforcement/skill satisfaction flags, response text, duration
- `nodes_reached[]` — which nodes were visited
- `completed`, `completed_without_nudging`, `nudge_count`
- `plan_name` — extracted from plan-success response
- `total_duration_ms`

---

## Test Prompt Pool

Four planning goals covering different scenarios:

| ID | Goal |
|----|------|
| `add-math-function` | Add a GCD function to a C++ math library |
| `add-header-only-lib` | Add a new header-only string utilities library |
| `improve-test-coverage` | Add missing edge case tests without new files |
| `add-doxygen-docs` | Add Doxygen comments to an undocumented header-only library |

Each prompt is the exact expansion of the `/plan-session` slash command:

```
Immediately call the plan_session tool to begin the planning workflow.

You are HeadWrench, starting a planning session to explore, design, and decompose the user's request into a structured execution DAG. The user's topic or description is:

"<goal>"

Constraints:

Call plan_session must be called immediately to start the planning workflow. Do not attempt to manually parse or execute plan files yourself. The plan_session tool will handle the entire planning process.
```

---

## Per-Node Evaluation

The runner tracks each DAG node turn separately. For each node:

### Enforcement Check

Each node has a required tool sequence (from `plan.jsonl`). The check passes if the enforcement tools appear in the tool sequence in order (other tools may appear between them).

| Node | Enforcement |
|------|------------|
| session-overview | `choose_plan_name` |
| orientation-scout | `sequential-thinking_sequentialthinking`, `task` |
| external-research | `sequential-thinking_sequentialthinking`, `task` |
| write-notes | `qdrant_qdrant-store` |
| compress | `compress` |
| session-overview-refresher | _(none)_ |
| retrieve-notes | `sequential-thinking_sequentialthinking`, `qdrant_qdrant-find`, `sequential-thinking_sequentialthinking` |
| dag-design | `init_dag`, `sequential-thinking_sequentialthinking`, `task` |
| dag-review | `sequential-thinking_sequentialthinking`, `task` |
| dag-revision | `sequential-thinking_sequentialthinking`, `task` |
| plan-success | _(none)_ |

### Skill Check

Each node declares expected skills in its prompt header. The check passes if all declared skills appear in the `skill` tool calls for that turn. Skills are exempt from enforcement — they can be loaded at any point without blocking.

| Node | Expected Skills |
|------|----------------|
| session-overview | `following-plans` |
| orientation-scout | `context-scout-delegation`, `sequential-thinking` |
| external-research | `external-scout-delegation`, `sequential-thinking` |
| write-notes | `qdrant-notes` |
| compress | _(none)_ |
| session-overview-refresher | `following-plans` |
| retrieve-notes | `sequential-thinking`, `qdrant-notes` |
| dag-design | `dag-design`, `sequential-thinking` |
| dag-review | `dag-review`, `sequential-thinking` |
| dag-revision | `dag-design`, `sequential-thinking` |
| plan-success | _(none)_ |

### Enforcement Error Recovery

If the runner detects "EnforcementError" in a tool output, it flags `had_enforcement_error: true` for that node. This is not a failure — recovery is expected behavior. The node still passes if enforcement is eventually satisfied.

---

## Iteration Loop

When a trial fails or shows problems, iterate on the relevant files:

| Problem | Fix target |
|---------|-----------|
| Wrong skills loaded (or not loaded) | Node prompt `Skills` header |
| Enforcement not satisfied | Node prompt `Instructions` / `Constraints` |
| Delegation prompt prescribes steps instead of goals | Node prompt `Instructions` |
| Subagent references in delegation prompt | Node prompt `Instructions` |
| Session stalls between nodes | Check `next_step` call in node prompt |
| DAG describes file edits not phases | `dag-design` node prompt, `dag-design` skill |

After changes: `bun run build && bun run deploy && bash scripts/update-profiles.sh`, then re-run the affected test.

---

## Relationship to Phase 1 Tests

Phase 1 (per-subagent tests via `test/runner.ts`) validated that each subagent behaves correctly when dispatched with a realistic single-turn prompt. Phase 2 (this E2E runner) validates that headwrench orchestrates those subagents correctly across a full multi-turn planning session.

Phase 1 findings are prerequisites — subagents must be working before E2E testing is meaningful. Phase 1 status at E2E launch:
- context-scout: ✅ passing
- context-insurgent: ✅ passing
- external-scout: ✅ passing (response structure fix applied)
- Other agents: not yet tested in Phase 1

---

## Success Criteria

A trial is considered successful when:
- All 11 nodes are reached in order
- Enforcement is satisfied at every node with a non-empty enforcement list
- Skills are loaded at every node with a non-empty skills list
- `completed_without_nudging: true`
- `plan_name` is non-null and follows the naming convention (lowercase, hyphens)
- Delegation prompts (captured in `response_text`) are goal-based, not step-prescribing
- Generated DAG describes phases and decision gates, not specific file edits

Lock the planning DAG prompts when 3 consecutive trials pass all criteria.
