# Scout Parallel Node Type

---

## DAG v2.0 Schema Compliance

Scout parallel nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"scout-parallel"`) |
| `prompt` | Bare filename: `"scout-parallel.md"` |
| `todo` | `["task", "task", "task"]` — exactly 3 parallel tasks |
| `next` | Single node or omitted for terminal |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata
- No descriptions in todo array values

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **scout-parallel** node dispatches context-scout to explore the codebase in three parallel tasks. Each task runs independently while sharing context-scout's 12-step total budget. This node is ideal for quickly gathering context about multiple areas of the codebase.

## Purpose

- Explore codebase quickly across multiple dimensions
- Identify architecture patterns and dependencies
- Gather contextual information in parallel
- Prepare for decomposition and planning decisions

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `scout-parallel` |
| **Category** | Exploration |
| **Todo Sequence** | `["task", "task", "task"]` (exactly 3 tasks) |
| **Primary Agent** | @ContextScout |
| **Agent Step Budget** | 12 (shared across all 3 tasks) |
| **Branching Support** | Linear only |
| **Parallel Execution** | Yes (all 3 tasks run concurrently) |
| **Requires Prompt** | Yes |

## When to Use

- **After intake** to explore the codebase with clear context
- **Before decomposition** to understand architecture and patterns
- **To gather context** on multiple aspects in parallel
- **As entry to planning** before making structural decisions

## Parallel Execution Model

### Budget Allocation

- **Total Budget:** 12 steps
- **Shared Model:** All 3 tasks share the same 12-step budget
- **Estimated per Task:** ~4 steps each
- **Flexible Distribution:** Steps can be distributed unevenly based on task complexity

### Execution Flow

```
Task 1          Task 2          Task 3
  |               |               |
  +-------context-scout-------+
          (12 steps total)
  |               |               |
  v               v               v
Results        Results        Results
  |               |               |
  +-------Advance to next node------+
```

1. All 3 tasks dispatch simultaneously
2. Context-scout works on all 3 in parallel
3. Tasks complete as they finish
4. When all 3 complete, advance to next node

## Structure

```json
{
  "id": "scout-parallel",
  "name": "Scout Parallel",
  "prompt": "scout-parallel.md",
  "todo": ["task", "task", "task"],
  "next": {
    "id": "analyze-findings",
    "prompt": "analyze-deep.md",
    "todo": ["task"]
  }
}
```

## Implementation Notes

### Task Design

Each of the 3 tasks should be **focused and independent**:

**Task 1: Architecture Exploration**
- Identify overall codebase structure
- Note major components and their organization
- Understand file layout and naming conventions

**Task 2: Dependency Mapping**
- Map external dependencies and integrations
- Identify internal service boundaries
- Note potential integration points

**Task 3: Pattern Recognition**
- Identify common patterns and conventions
- Note configuration approaches
- Summarize setup and environment requirements

### Context Scout Capabilities

Context-scout is optimized for:
- Quick file exploration and pattern matching
- Reading documentation and comments
- Building mental models of codebase structure
- Identifying risks and edge cases

### Step Budget Considerations

With 12 total steps shared across 3 tasks:
- **~4 steps per task** (average)
- **Can vary** depending on complexity
- **Parallel execution** means wall-clock time is ~4 steps, not 12
- **Communicates findings** back at the end

### Integration

- Typically follows `intake` node for requirements gathering
- Usually precedes `analyze-deep` node for synthesis
- Output feeds into decomposition and planning

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "exploration-dag",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "requirements",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "explore-parallel",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "synthesize",
          "prompt": "analyze-deep.md",
          "todo": ["task"]
        }
      }
    }
  }
}
```

## Prompt Template

The scout-parallel prompt should structure three focused exploration tasks:

```markdown
# Scout Parallel Exploration

**Goal:** Explore codebase across three dimensions in parallel.

## What to do

Dispatch @ContextScout to explore three areas simultaneously:

1. **Architecture** — Overall structure, components, organization
2. **Dependencies** — External/internal integrations and boundaries
3. **Patterns** — Common conventions, setup, and configuration

## Delegation

**Agent:** @ContextScout
**Parallel:** 3 tasks, 12-step shared budget
**Estimated per task:** ~4 steps

## Todo

1. `task` — Dispatch @ContextScout to explore architecture:
   - Identify major components and file organization
   - Map component interactions
   - Note any architectural patterns or principles

2. `task` — Dispatch @ContextScout to map dependencies:
   - List external dependencies and versions
   - Identify internal service boundaries
   - Note integration points

3. `task` — Dispatch @ContextScout to identify patterns:
   - Document coding conventions and patterns
   - Identify configuration approaches
   - Summarize setup requirements
```

## Best Practices

### DO:
- Use exactly 3 tasks (parallel dispatch is most efficient at 3)
- Make each task independent and focused
- Design tasks to explore different aspects
- Use the 12-step budget efficiently (~4 per task)
- Always follow with synthesis/analysis node
- Link linearly to next node (no branching)

### DON'T:
- Add more or fewer than 3 tasks
- Make tasks interdependent (they run in parallel)
- Assume sequential execution (they're concurrent)
- Ask context-scout to do deep analysis (use `analyze-deep` for that)
- Create branching from this node (linear only)

## Validation Rules

- `todo` array must be exactly `["task", "task", "task"]`
- Must have a prompt file (required)
- `next` must be a single node (linear)
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- All 3 parallel tasks must be independent (no inter-task dependencies)

## Valid Todo Items Reference

### ✅ Valid in scout-parallel
- `task` (3 times) — Parallel exploration tasks

### ✅ Valid in other nodes  
- `bash` — Command execution (conditional-branch, verification-check, etc.)
- `question` — User input (intake, decision-gate, output-failure)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Error Handling

| Error | Resolution |
|-------|-----------|
| Fewer than 3 tasks | Add additional task items to reach exactly 3 |
| More than 3 tasks | Remove tasks or split into multiple scout nodes |
| Non-task todo items | Use only `task` items for agent dispatch |
| Branching structure | Use linear `next` only, no conditions |
| Over-scoped tasks | Break into smaller, focused tasks (~4 steps each) |

## Example in DAG Context

```json
{
  "id": "feature-planning",
  "entry": {
    "id": "session",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "intake",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "scout",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "analyze",
          "prompt": "analyze-deep.md",
          "todo": ["task"],
          "next": {
            "id": "decide",
            "prompt": "decision-gate.md",
            "todo": ["question"],
            "next": [
              {
                "when": "Proceed with implementation",
                "node": {
                  "id": "implement",
                  "prompt": "implement.md",
                  "todo": ["task"]
                }
              },
              {
                "when": "Need more exploration",
                "node": {
                  "id": "scout-2",
                  "prompt": "scout-parallel.md",
                  "todo": ["task", "task", "task"]
                }
              }
            ]
          }
        }
      }
    }
  }
}
```

## Performance Characteristics

- **Parallel execution:** ~4 steps wall-clock time (vs 12 sequential)
- **Best for:** Quick context gathering across multiple areas
- **Not ideal for:** Deep analysis (use `analyze-deep` instead)
- **Token efficiency:** Parallel dispatch saves context switches

## See Also

- **Session Overview Node** — Entry point
- **Intake Node** — Gathers requirements before scouting
- **Analyze Deep Node** — Deep analysis of scout findings
- **Decision Gate Node** — Typical next step after synthesis
- **Context Scout Agent** — The agent that executes these tasks
