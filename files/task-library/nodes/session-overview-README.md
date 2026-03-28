# Session Overview Node Type

---

## DAG v2.0 Schema Compliance

Session overview nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | `"session-overview"` (entry node) |
| `prompt` | Bare filename: `"session-overview.md"` |
| `todo` | `[]` for auto-advance (no tool calls) |
| `next` | Single node (typically intake) |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **session-overview** node is the entry point for all planning sessions. It reads the current session state, project context, and execution history without requiring any agent dispatch or user interaction. This node auto-advances immediately after its initial observation phase.

## Purpose

- Establish shared context at session start
- Read current project state and session memory
- Summarize previous work and decisions
- Set the stage for subsequent planning nodes

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `session-overview` |
| **Category** | Initialization |
| **Todo Sequence** | `[]` (empty - auto-advance) |
| **Primary Agent** | None (HeadWrench reads only) |
| **Agent Step Budget** | 0 |
| **Branching Support** | Linear only |
| **Requires Prompt** | No |

## When to Use

- **Always** at the start of any planning or project DAG
- At session resumption to re-establish context
- Before cross-team handoffs to establish shared understanding
- Before any user-facing decision nodes to ensure all parties understand current state

## Structure

```json
{
  "id": "session-overview",
  "name": "Session Overview",
  "prompt": "session-overview.md",
  "todo": [],
  "next": {
    "id": "intake",
    "prompt": "intake.md",
    "todo": ["question"]
  }
}
```

## Implementation Notes

### Behavior

1. **No user interaction required** — Reads from session memory (context7 MCP server)
2. **No agent dispatch** — HeadWrench performs observation only
3. **Auto-advance** — Completes immediately and moves to next node
4. **Context reading** — Retrieves project state, previous plans, execution history

### Integration

- Use as entry point in all DAGs via `"entry"` field
- Always chains to an `intake` node or planning node as `next`
- Works with session memory MCP server for context persistence

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "my-planning-dag",
  "entry": {
    "id": "session-overview",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "intake",
      "prompt": "intake.md",
      "todo": ["question"]
    }
  }
}
```

## Best Practices

### DO:
- Always use as entry point in DAGs
- Link to `intake` or planning node as `next`
- Rely on session memory context it provides
- Use the context it retrieves for subsequent decisions

### DON'T:
- Add todo items (it auto-advances)
- Dispatch agents to this node
- Use outside of session start context
- Create branching from this node (linear only)

## Prompt Template

The session-overview node does not require a prompt file. HeadWrench reads context directly from:
- Session memory (context7 MCP)
- Current project state
- Previous plan and execution logs

## Validation Rules

- `todo` array must be empty `[]` (no tool calls)
- `next` must point to a single node (typically intake)
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- Prompt required to set context for planning session
- No custom metadata in node definition

## Valid Todo Items Reference

### ✅ Valid in session-overview
- `[]` (empty) — No actions; node auto-advances

### ✅ Valid in other nodes  
- `task` — Agent dispatch (parallel-tasks, analyze-deep, etc.)
- `bash` — Command execution (conditional-branch, verification-check, etc.)
- `question` — User input (intake, decision-gate, output-failure)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- Any todo items in session-overview (must be empty)

## Error Handling

| Error | Resolution |
|-------|-----------|
| Non-empty `todo` array | Remove all todo items; this node auto-advances |
| Agent assignment | Remove agent assignment; this node requires no dispatch |
| Branching structure | Remove branching; use linear `next` only |

## Example in DAG Context

```json
{
  "id": "planning-dag-v1",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "gather-requirements",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "explore",
        "prompt": "scout.md",
        "todo": ["task"]
      }
    }
  }
}
```

In this DAG:
1. `session-start` reads session context and auto-advances
2. `gather-requirements` asks the user for input
3. `explore` dispatches agents to explore the codebase

## See Also

- **Intake Node** — Next node type, gathers user requirements
- **DAG Entry Point** — Using `entry` field in plan.json
- **Session Memory** — Context7 MCP server for persistence
