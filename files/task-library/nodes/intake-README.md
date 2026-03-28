# Intake Node Type

---

## DAG v2.0 Schema Compliance

Intake nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"intake"`) |
| `prompt` | Bare filename: `"intake.md"` |
| `todo` | `["question"]` only — gather user input |
| `next` | Single node (typically scout or analyze) |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **intake** node is a requirements-gathering node that conducts a structured interview with the user to establish the project goal, success criteria, constraints, and initial requirements. HeadWrench uses the `question` tool to gather detailed information before planning begins.

## Purpose

- Establish clear project goal and objectives
- Define success criteria and acceptance conditions
- Identify constraints (time, scope, resources, technical)
- Capture known blockers and dependencies
- Create a shared requirements statement

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `intake` |
| **Category** | Initialization |
| **Todo Sequence** | `["question"]` |
| **Primary Agent** | HeadWrench |
| **Agent Step Budget** | N/A (orchestrator) |
| **Branching Support** | Linear only |
| **Requires Prompt** | Yes |

## When to Use

- **First planning node** after session-overview to establish requirements
- **Between planning and execution** to ensure clear goals
- **Before large projects** to avoid rework and misalignment
- **In refactoring or feature work** to define success upfront

## Structure

```json
{
  "id": "intake",
  "name": "Intake",
  "prompt": "intake.md",
  "todo": ["question"],
  "next": {
    "id": "scout-exploration",
    "prompt": "scout-parallel.md",
    "todo": ["task", "task", "task"]
  }
}
```

## Implementation Notes

### Behavior

1. **Question Tool** — HeadWrench uses `question` tool to ask structured prompts
2. **User Response** — User provides answers through OpenCode interface
3. **Synthesis** — HeadWrench synthesizes responses into clear requirements
4. **Linear Next** — Advances to next node in sequence

### Interview Structure

The intake node should cover:

**Objectives:**
- What is the primary goal or objective?
- What problem are we solving?
- Why does this matter now?

**Success Criteria:**
- How will we know this is done?
- What defines "success" or "complete"?
- What acceptance conditions must be met?

**Constraints:**
- What constraints exist? (time, scope, budget, resources)
- What technical limitations are relevant?
- What dependencies exist?

**Context:**
- What have we already tried?
- What blockers or risks do you foresee?
- Are there any preferences or non-negotiables?

### Integration

- Always follows `session-overview` node as entry point
- Typically precedes `scout-parallel` or planning nodes
- Output is used to inform all subsequent planning decisions

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "feature-planning-dag",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "requirements",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "explore",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"]
      }
    }
  }
}
```

## Prompt Template

The intake prompt should structure the question tool invocation:

```markdown
# Intake Interview

**Goal:** Understand the project objectives, constraints, and success criteria.

## What to do

Use the `question` tool to conduct a structured intake interview. Ask the user to provide:

1. **Project Goal** — What is the primary objective?
2. **Success Criteria** — How will we know this is done?
3. **Constraints** — What are the time/scope/resource limitations?
4. **Context** — What blockers or dependencies exist?

## Delegation

**Agent:** HeadWrench
**Tool:** question

## Todo

1. `question` — Conduct structured intake interview with user:
   - Ask about project goal and objectives
   - Ask about success criteria and acceptance conditions
   - Ask about constraints and dependencies
   - Synthesize responses into a clear requirements statement
   - Document all answers for planning reference
```

## Best Practices

### DO:
- Always use after session-overview
- Ask open-ended questions that invite detailed responses
- Document all user answers for reference
- Link to subsequent exploration or planning nodes
- Synthesize responses into clear requirements

### DON'T:
- Add multiple todo items (use only `["question"]`)
- Skip intake and assume you know requirements
- Use branching (linear only)
- Proceed to implementation without clear criteria
- Ignore stated constraints or blockers

## Validation Rules

- `todo` array must be exactly `["question"]`
- Must have a prompt file (required)
- `next` must be a single node (linear)
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- No custom metadata in node definition

## Valid Todo Items Reference

### ✅ Valid in intake
- `question` — HeadWrench asks user for input

### ✅ Valid in other nodes  
- `task` — Agent dispatch (parallel-tasks, analyze-deep, etc.)
- `bash` — Command execution (conditional-branch, verification-check, etc.)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `observation` — Use `task` to dispatch agents instead
- `compress` — Compress is a TOOL; use `task` with compress tool invoked
- `skill` — Use skill-invoke node instead

## Error Handling

| Error | Resolution |
|-------|-----------|
| Non-question todo items | Remove and keep only `["question"]` |
| Missing prompt file | Create intake.md with question-based prompt |
| Branching structure | Use linear `next` only, no conditions |
| Skipped requirements | Don't skip this node; it prevents misalignment later |

## Example in DAG Context

```json
{
  "id": "feature-delivery-dag",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "intake-interview",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "codebase-exploration",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "decompose-work",
          "prompt": "decompose.md",
          "todo": ["task"]
        }
      }
    }
  }
}
```

Flow:
1. Session start reads context
2. Intake gathers requirements via question tool
3. Scout explores codebase (3 parallel tasks)
4. Decompose breaks work into subtasks

## See Also

- **Session Overview Node** — Entry point before intake
- **Scout Parallel Node** — Typical next step after intake
- **Question Tool** — How HeadWrench gathers user input
- **Requirements Best Practices** — Document all decisions from intake
