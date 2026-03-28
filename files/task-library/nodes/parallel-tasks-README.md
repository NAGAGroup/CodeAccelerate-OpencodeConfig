# Parallel Tasks Node Type

---

## DAG v2.0 Schema Compliance

Parallel task nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"parallel-work"`) |
| `prompt` | Bare filename: `"parallel-tasks.md"` |
| `todo` | `["task", "task", "task"]` — exactly 3 independent tasks (use 1-3 items) |
| `next` | Single node or omitted for terminal |

**v2.0 Node Fields (only these allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **parallel-tasks** node dispatches 1-3 independent haiku agents (@JuniorDev, @QuickDoc, @DeepResearcher) to execute tasks simultaneously. Each agent runs with its own step budget independently, with no budget sharing. This node is ideal for scenarios where multiple agents can work on different aspects without waiting for each other.

## Purpose

- Execute multiple independent code edits, documentation, and research tasks in parallel
- Maximize wall-clock efficiency by leveraging multiple agents simultaneously
- Enable parallel workflows for feature implementation + documentation + research
- Reduce total execution time by distributing work across agents

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `parallel-tasks` |
| **Category** | Execution |
| **Todo Sequence** | `["task", "task", "task"]` or fewer (1-3 independent tasks) |
| **Primary Agent** | HeadWrench (coordination only) |
| **Agent Step Budget** | 5 (HeadWrench coordination only) |
| **Per-Agent Budgets** | Independent (JuniorDev: 10, QuickDoc: 8, DeepResearcher: 15) |
| **Branching Support** | Linear only |
| **Parallel Execution** | Yes (1-3 agents run concurrently) |
| **Requires Prompt** | Yes |

## When to Use

- **Parallel code edits** — Multiple targeted changes across files simultaneously
- **Code + docs + research** — Implementation, documentation, and research in parallel
- **Multi-agent workflows** — Tasks that don't depend on each other
- **Time optimization** — Reduce wall-clock time by parallelizing independent work
- **Feature delivery** — Complete implementation, docs, and testing concurrently

## Parallel Execution Model

### Budget Allocation

- **HeadWrench Budget:** 5 steps (coordination only, does not do work)
- **Agent Budgets:** Independent, each agent has its own
  - @JuniorDev: 10 steps
  - @QuickDoc: 8 steps
  - @DeepResearcher: 15 steps
- **No Budget Sharing:** Each agent operates independently
- **Wall-Clock Time:** Determined by slowest agent (not sum of budgets)

### Execution Flow

```
Task 1 (JuniorDev)    Task 2 (QuickDoc)    Task 3 (DeepResearcher)
  |                      |                       |
  +----------Coordinate (HeadWrench)----------+
  |                      |                       |
  v (10 steps)          v (8 steps)            v (15 steps)
  Code Edit        Doc Generation          Research Report
  |                      |                       |
  +--Complete after ~15 seconds (wall-clock)---+
        (Not 10 + 8 + 15 = 33 seconds)
  |                      |                       |
  v                      v                       v
Combined Results ready for next node
```

### Key Differences from Scout-Parallel

| Aspect | scout-parallel | parallel-tasks |
|--------|----------------|----------------|
| **Agents** | 1 agent (context-scout) | 3 different agents |
| **Budget** | Shared (12 total) | Independent per agent |
| **Wall-clock time** | ~4 steps | ~max(agent budgets) |
| **Task focus** | Exploration | Implementation/docs/research |
| **Coordination** | Context-scout divides budget | HeadWrench coordinates agents |

## Structure

```json
{
  "id": "parallel-tasks",
  "name": "Parallel Tasks",
  "prompt": "parallel-tasks.md",
  "todo": ["task", "task", "task"],
  "next": {
    "id": "verify-outputs",
    "prompt": "verify-outputs.md",
    "todo": ["task"]
  }
}
```

## Agent Selection Guide

### @JuniorDev (10 steps)
- **Best for:** Targeted code edits, bug fixes, implementation
- **Output:** Modified files, test-ready code changes
- **Typical tasks:** Implement feature, apply refactor, fix specific bug

### @QuickDoc (8 steps)
- **Best for:** Documentation generation, README updates, inline comments
- **Output:** Markdown files, updated documentation, code comments
- **Typical tasks:** Generate API docs, update README, create examples

### @DeepResearcher (15 steps)
- **Best for:** Research, investigation, pattern analysis, external validation
- **Output:** Research reports, alternative approaches, recommendations
- **Typical tasks:** Investigate libraries, analyze patterns, research best practices

## Implementation Notes

### Task Design

Each of the tasks should be **completely independent**:

**Task 1: Code Implementation (JuniorDev)**
```
Edit-heavy task that modifies files:
- Implement feature or fix
- Update specific files
- No dependency on other tasks
```

**Task 2: Documentation (QuickDoc)**
```
Documentation-focused task:
- Generate API docs
- Update README or guides
- No dependency on implementation details
```

**Task 3: Research (DeepResearcher)**
```
Research or analysis task:
- Investigate alternatives
- Analyze patterns
- Evaluate approaches
```

### Critical Requirements

1. **Task Independence** — Tasks must NOT depend on each other's results
2. **Clear Boundaries** — Each agent works in distinct area (code/docs/research)
3. **No Synchronization Points** — Avoid "Task 2 needs results from Task 1"
4. **Parallel-Safe** — All tasks can safely run simultaneously

### Anti-Patterns

❌ **Task 2 depends on Task 1 output** → Use sequential nodes instead
❌ **All 3 tasks modify the same file** → Coordinate via scout-parallel or sequential
❌ **Task 1 output feeds into Task 2** → Create separate DAG branch
❌ **Tasks share state** → Use linear sequential nodes

## Integration

- Usually follows `intake` or `decision-gate` for requirements
- Precedes `verification-check` for testing outcomes
- Can feed into `compression-node` to synthesize outputs
- Best with output tasks like `output-success`

## Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "feature-implementation",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "intake",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "parallel-work",
        "prompt": "parallel-tasks.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "verify",
          "prompt": "verification-check.md",
          "todo": ["bash"],
          "next": [
            {
              "when": "Exit code 0 - All checks passed",
              "node": {
                "id": "success",
                "prompt": "output-success.md",
                "todo": []
              }
            },
            {
              "when": "Exit code 1 - Tests failed",
              "node": {
                "id": "retry",
                "prompt": "loop-until-success.md",
                "todo": ["task"]
              }
            }
          ]
        }
      }
    }
  }
}
```

## Prompt Template

The parallel-tasks prompt should structure three completely independent tasks:

```markdown
# Parallel Task Dispatch

**Goal:** Execute code implementation, documentation, and research in parallel.

## What to do

Dispatch three independent agents simultaneously:

1. **Code Implementation** — @JuniorDev
2. **Documentation** — @QuickDoc
3. **Research/Analysis** — @DeepResearcher

## Delegation

**Coordinator:** HeadWrench
**Workers:** @JuniorDev, @QuickDoc, @DeepResearcher (parallel)
**Estimated time:** ~15 seconds wall-clock (max of individual budgets)

## Todo

1. `task` — Dispatch @JuniorDev to implement feature X:
   - Modify files A and B with feature implementation
   - Ensure changes are self-contained and testable
   - Do not wait for docs or research to complete

2. `task` — Dispatch @QuickDoc to document feature X:
   - Create API documentation
   - Generate usage examples
   - Do not wait for implementation or research

3. `task` — Dispatch @DeepResearcher to investigate alternatives:
   - Research similar libraries or approaches
   - Compare performance characteristics
   - Document findings independently
```

## Performance Characteristics

| Aspect | Value |
|--------|-------|
| **Parallel execution** | 1-3 agents run simultaneously |
| **Wall-clock time** | ~15 seconds (max of agent budgets, not sum) |
| **Per-agent budgets** | Independent (10 + 8 + 15 = 33 total, but ~15 wall-clock) |
| **Token efficiency** | 3x speedup compared to sequential execution |
| **Best for** | Independent work streams |
| **Not ideal for** | Interdependent tasks or shared state |

## Best Practices

### DO:
- Use 1-3 tasks depending on scope
- Make each task completely independent
- Assign tasks to appropriate agents (JuniorDev for code, QuickDoc for docs, etc.)
- Leverage parallelization to reduce wall-clock time
- Follow with verification or output node
- Document task boundaries clearly

### DON'T:
- Create task dependencies between items
- Assume sequential execution
- Share state between tasks
- Modify same files from multiple tasks (risk of conflicts)
- Use this for tightly-coupled work (use sequential nodes)
- Expect tasks to communicate during execution

## Validation Rules

- `todo` array must contain 1-3 `task` items (exactly)
- All tasks must be independent (no data dependencies)
- Must have a prompt file (required)
- `next` must be a single node (linear)
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- No custom metadata in node definition

## Valid Todo Items Reference

### ✅ Valid in parallel-tasks
- `task` — Agent dispatch (1-3 tasks for parallel execution)

### ✅ Valid in other nodes  
- `bash` — Command execution (conditional-branch, verification-check, loop-until-success)
- `question` — User input (intake, decision-gate, output-failure)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use in parallel-tasks
- `skill` — Use skill-invoke node instead
- `bash` — Use verification-check or conditional-branch instead
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Error Handling

| Error | Resolution |
|-------|-----------|
| Task interdependency | Restructure tasks to be independent or use sequential nodes |
| Shared file modification | Coordinate via different tasks or use sequential workflow |
| Budget exceeded | Reduce task scope or split into multiple parallel-tasks nodes |
| Agent not available | Substitute with appropriate available agent |
| Timeout on slowest task | Increase agent budget or reduce task complexity |

## Example Scenarios

### Scenario 1: Feature + Docs + Tests in Parallel

```json
{
  "id": "feature-delivery",
  "prompt": "parallel-tasks.md",
  "todo": [
    "task — JuniorDev: Implement authentication feature",
    "task — QuickDoc: Generate security docs and examples",
    "task — DeepResearcher: Evaluate OAuth2 vs. JWT approaches"
  ]
}
```

### Scenario 2: Refactor + Migration Guide + Performance Analysis

```json
{
  "id": "refactor-parallel",
  "prompt": "parallel-tasks.md",
  "todo": [
    "task — JuniorDev: Refactor API endpoints for consistency",
    "task — QuickDoc: Create migration guide for deprecations",
    "task — DeepResearcher: Analyze performance impact"
  ]
}
```

### Scenario 3: Bug Fix + Tests + Root Cause Analysis

```json
{
  "id": "bug-fix-parallel",
  "prompt": "parallel-tasks.md",
  "todo": [
    "task — JuniorDev: Implement bug fix in code",
    "task — QuickDoc: Add regression tests and examples",
    "task — DeepResearcher: Analyze root cause patterns"
  ]
}
```

## Integration with Other Nodes

### After These Nodes:
- `intake` — Gather requirements, then execute in parallel
- `decision-gate` — Make decision, then execute parallel tasks
- `analyze-deep` — Get analysis, then implement in parallel

### Before These Nodes:
- `verification-check` — Verify all parallel outputs
- `compression-node` — Compress and synthesize outputs
- `output-success` — Summarize successful parallel execution
- `loop-until-success` — Retry if verification fails

## Key Differences from Similar Nodes

### vs. scout-parallel
- **scout-parallel:** 3 scouts, 1 agent, shared 12-step budget
- **parallel-tasks:** 1-3 agents, independent budgets, implementation focus

### vs. conditional-branch
- **conditional-branch:** Single bash command, routes to branches
- **parallel-tasks:** Multiple agent tasks, parallel execution, no branching

### vs. skill-invoke
- **skill-invoke:** Load knowledge, linear execution
- **parallel-tasks:** Dispatch agents, parallel execution

## Troubleshooting

### Tasks completing at different times
**Expected behavior.** Wall-clock time = max(all task times). Fastest tasks finish first.

### Output from one task needed by another
**Use sequential nodes instead.** Parallel-tasks requires complete independence.

### Agents running sequentially instead of parallel
**Check task design.** Ensure tasks are truly independent and explicitly dispatched.

### Memory or context issues
**Reduce task scope.** Break into smaller, simpler parallel-tasks nodes.

## See Also

- **Scout Parallel Node** — Parallel exploration with single agent
- **Analyze Deep Node** — Deep synthesis after scout findings
- **Verification Check Node** — Verify parallel task outputs
- **Compression Node** — Compress parallel outputs
- **Context Scout Agent** — Quick exploration agent
- **Junior Dev Agent** — Targeted code editing
- **Quick Doc Agent** — Documentation generation
- **Deep Researcher Agent** — Research and analysis
