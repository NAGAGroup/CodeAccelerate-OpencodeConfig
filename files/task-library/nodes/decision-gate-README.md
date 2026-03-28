# Decision Gate Node Type

---

## DAG v2.0 Schema Compliance

Decision gate nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"decide-approach"`) |
| `prompt` | Bare filename: `"decision-gate.md"` |
| `todo` | `["question"]` only — user must choose a branch |
| `next` | Branch array with ≥2 options (each with `when` and `node`) |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **decision-gate** node is the primary branching control-flow node in DAGs. It presents analysis findings and options to the user via the question tool, then routes to different next nodes based on the user's selection. Each branch requires a unique `when` condition that describes the decision path.

## Purpose

- Present findings and options to user
- Collect user decision via question tool
- Branch to different paths based on decision
- Control flow through planning and execution DAGs

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `decision-gate` |
| **Category** | Control Flow |
| **Todo Sequence** | `["question"]` |
| **Primary Agent** | HeadWrench |
| **Agent Step Budget** | N/A (orchestrator) |
| **Branching Support** | Branch (2+ paths) |
| **Requires Prompt** | Yes |
| **Requires `when` conditions** | Yes (each branch) |

## When to Use

- **After analysis** to route based on findings
- **At decision points** requiring user input
- **For conditional execution** where paths diverge
- **Before implementation** to choose approach
- **In iterative workflows** to loop or proceed

## Branching Model

### Structure

```json
{
  "id": "decision-gate",
  "prompt": "decision.md",
  "todo": ["question"],
  "next": [
    {
      "when": "Option A",
      "node": { "id": "path-a", ... }
    },
    {
      "when": "Option B",
      "node": { "id": "path-b", ... }
    },
    {
      "when": "Option C",
      "node": { "id": "path-c", ... }
    }
  ]
}
```

### Requirements

- **`next` must be an array** (not an object)
- **Minimum 2 branches** (decision requires options)
- **Each branch has `when` condition** (describes the decision path)
- **Each branch has `node`** (next node in that path)
- **`when` conditions must be unique** (clear distinction between paths)

### Example Conditions

- `"Proceed with approach A"` — User chooses path A
- `"Need more exploration"` — User wants to explore more
- `"Proceed with approach B"` — User chooses path B
- `"Refactor first, then implement"` — Conditional based on analysis
- `"Reuse existing solution"` — Choose existing approach

## Decision Gate Workflow

```
1. Present options to user (question tool)
2. User selects one option
3. Route to corresponding branch
4. Execute next node in selected path
5. Continue from there
```

### Example Flow

```json
{
  "id": "decide",
  "prompt": "decide.md",
  "todo": ["question"],
  "next": [
    {
      "when": "Implement feature",
      "node": {
        "id": "implement",
        "prompt": "implement.md",
        "todo": ["task"]
      }
    },
    {
      "when": "Refactor first",
      "node": {
        "id": "refactor",
        "prompt": "refactor.md",
        "todo": ["task"]
      }
    },
    {
      "when": "Gather more context",
      "node": {
        "id": "scout-more",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"]
      }
    }
  ]
}
```

## Structure

```json
{
  "id": "decision-gate",
  "name": "Decision Gate",
  "prompt": "decision-gate.md",
  "todo": ["question"],
  "next": [
    {
      "when": "Condition A description",
      "node": { ... }
    },
    {
      "when": "Condition B description",
      "node": { ... }
    }
  ]
}
```

## Implementation Notes

### Question Tool Usage

The question tool presents options and collects user decision:

```markdown
# Decision Gate

**Goal:** User selects next direction from presented options.

## What to do

Use the `question` tool to:
1. Present analysis findings
2. Explain each option
3. Ask user to select direction
4. Confirm choice

## Delegation

**Agent:** HeadWrench
**Tool:** question

## Todo

1. `question` — Present options and collect decision:
   - Option A: [description and rationale]
   - Option B: [description and rationale]
   - Ask user which direction to proceed
   - Confirm selection before routing
```

### Routing After Decision

Once user selects an option, the corresponding branch executes:

```
User chooses "Implement feature"
  ↓
Route to "implement" node
  ↓
Execute implementation task
  ↓
Continue DAG from there
```

### Integration Patterns

**Pattern 1: After Analysis**
```
analyze-deep → decision-gate → [path-a / path-b]
```

**Pattern 2: Iterative Refinement**
```
scout → analyze → decision-gate → scout (if refine) / implement (if proceed)
```

**Pattern 3: Error Recovery**
```
execute-task → [success / error] → decision-gate → [retry / skip / abort]
```

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "decision-workflow",
  "entry": {
    "id": "session",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "analyze",
      "prompt": "analyze-deep.md",
      "todo": ["task"],
      "next": {
        "id": "user-decision",
        "prompt": "decision-gate.md",
        "todo": ["question"],
        "next": [
          {
            "when": "Proceed with approach A",
            "node": {
              "id": "implement-a",
              "prompt": "implement-a.md",
              "todo": ["task"]
            }
          },
          {
            "when": "Proceed with approach B",
            "node": {
              "id": "implement-b",
              "prompt": "implement-b.md",
              "todo": ["task"]
            }
          },
          {
            "when": "Need more exploration",
            "node": {
              "id": "scout-more",
              "prompt": "scout-parallel.md",
              "todo": ["task", "task", "task"],
              "next": {
                "id": "reanalyze",
                "prompt": "analyze-deep.md",
                "todo": ["task"]
              }
            }
          }
        ]
      }
    }
  }
}
```

## Prompt Template

The decision-gate prompt should clearly present options:

```markdown
# Decision Gate

**Goal:** User selects direction from presented options.

## What to do

Present analysis findings and ask user to select next direction.

## Analysis Summary

[Summarize key findings from previous analysis]

## Options

**Option 1: Approach A**
- Rationale: [why this makes sense]
- Pros: [advantages]
- Cons: [disadvantages]
- Effort: [estimated complexity]

**Option 2: Approach B**
- Rationale: [why this makes sense]
- Pros: [advantages]
- Cons: [disadvantages]
- Effort: [estimated complexity]

**Option 3: Gather More Context**
- Rationale: More exploration needed
- Approach: Scout additional areas
- Impact: Delays other decisions

## Delegation

**Agent:** HeadWrench
**Tool:** question

## Todo

1. `question` — Present options and collect user decision:
   - Present 3 options with rationale
   - Ask user which direction to proceed
   - Confirm understanding of implications
   - Ready next node based on selection
```

## Best Practices

### DO:
- Always have at least 2 branches
- Make `when` conditions clear and distinct
- Present findings before asking for decision
- Explain pros/cons of each option
- Use meaningful condition descriptions
- Link each branch to appropriate next node
- Use decision gates at strategic points

### DON'T:
- Have only 1 branch (not a decision then)
- Leave `when` conditions vague
- Ask user to choose without context
- Create loops without exit conditions
- Use non-descriptive condition names like "yes" or "no"
- Mix different decision types in one gate

## Validation Rules

- `todo` array must be exactly `["question"]`
- Must have a prompt file (required)
- `next` must be an array of branch objects (not single node)
- Minimum 2 items in `next` array
- Each item must have `when` and `node` fields
- All `when` conditions must be unique strings
- DAG node must only contain: `id`, `prompt`, `todo`, `next`

## Valid Todo Items Reference

### ✅ Valid in decision-gate
- `question` — HeadWrench asks user to choose path

### ✅ Valid in other nodes  
- `task` — Agent dispatch (parallel-tasks, analyze-deep, etc.)
- `bash` — Command execution (conditional-branch, verification-check, etc.)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Error Handling

| Error | Resolution |
|-------|-----------|
| Single branch | Add at least one more branch option |
| Missing `when` conditions | Add descriptive `when` for each branch |
| Missing prompt file | Create decision-gate.md with clear options |
| `next` is object not array | Convert `next` to array format |
| Vague conditions | Use specific, action-oriented condition names |

## Example in Complete DAG

```json
{
  "id": "complete-workflow",
  "entry": {
    "id": "start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "gather",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "explore",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "analyze",
          "prompt": "analyze-deep.md",
          "todo": ["task"],
          "next": {
            "id": "choose",
            "prompt": "decision-gate.md",
            "todo": ["question"],
            "next": [
              {
                "when": "Implement solution",
                "node": {
                  "id": "implement",
                  "prompt": "implement.md",
                  "todo": ["task"],
                  "next": {
                    "id": "test",
                    "prompt": "test.md",
                    "todo": ["bash"]
                  }
                }
              },
              {
                "when": "Explore alternatives",
                "node": {
                  "id": "explore-alt",
                  "prompt": "scout-parallel.md",
                  "todo": ["task", "task", "task"],
                  "next": {
                    "id": "analyze-alt",
                    "prompt": "analyze-deep.md",
                    "todo": ["task"]
                  }
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

## Pattern Reference

### Conditional Execution
```json
{
  "next": [
    {"when": "Condition A", "node": {...}},
    {"when": "Condition B", "node": {...}}
  ]
}
```

### Feedback Loop
```json
{
  "next": [
    {"when": "Acceptable", "node": {...}},
    {"when": "Needs revision", "node": {"id": "revise", "next": { "id": "re-decide", "next": [...] }}}
  ]
}
```

### Fallback Path
```json
{
  "next": [
    {"when": "Primary path", "node": {...}},
    {"when": "Alternative path", "node": {...}},
    {"when": "Escalate for review", "node": {...}}
  ]
}
```

## See Also

- **Question Tool** — How HeadWrench collects user input
- **DAG Branching** — Schema for branching structures
- **Conditional Routing** — Best practices for decision points
- **Other Gate Nodes** — Planning gates, user gates
