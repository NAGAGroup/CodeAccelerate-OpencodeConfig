# Output Success Node Type

---

## DAG v2.0 Schema Compliance

Output success nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"output-success"`) |
| `prompt` | Bare filename: `"output-success.md"` |
| `todo` | `[]` for auto-advance to completion |
| `next` | Omitted — terminal node |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata
- No `next` field (terminal node)

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **output-success** node is a terminal node that marks the successful completion of a planning or execution workflow. It signals the end of a successful path and gracefully closes the session. No further routing or branching occurs from this node.

## Purpose

- Signal successful plan completion to the user
- Provide optional final logging or summary
- Establish clear end state for successful execution paths
- Enable graceful session closure

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `output-success` |
| **Category** | Terminal |
| **Todo Sequence** | `[]` (empty, or optional `["bash"]` for logging) |
| **Primary Agent** | None (session terminates) |
| **Agent Step Budget** | 0 |
| **Branching Support** | Terminal (no branching) |
| **Requires Prompt** | No |

## When to Use

- **End of successful execution** — Task completed successfully
- **After final delivery** — All work items completed
- **Success confirmation** — Reached success criteria from intake
- **Clean session closure** — Session marked complete and ready to end

## Structure

```json
{
  "id": "execution-complete",
  "name": "Output Success",
  "prompt": "output-success.md",
  "todo": []
}
```

## Implementation Notes

### Behavior

1. **Terminal Marker** — Indicates this is the final node in the execution path
2. **No Agent Dispatch** — No agent work required; session state updates automatically
3. **Optional Logging** — Can include single bash todo for final logging
4. **Session Closure** — OpenCode marks session as complete

### Optional Logging

If audit trail or final summary logging is desired:

```json
{
  "id": "execution-complete",
  "prompt": "output-success.md",
  "todo": ["bash"]
}
```

The bash todo can:
- Write completion timestamp to session log
- Generate final summary report
- Send completion notification
- Update external tracking systems

### Integration

- Always the final node in a successful execution path
- No outgoing branches or next nodes
- Session state automatically updated to "complete"
- User receives completion confirmation

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "feature-delivery-dag",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "execute-tasks",
      "prompt": "execute.md",
      "todo": ["task"],
      "next": [
        {
          "when": "All tasks completed successfully",
          "node": {
            "id": "success-complete",
            "prompt": "output-success.md",
            "todo": []
          }
        },
        {
          "when": "Errors encountered",
          "node": {
            "id": "failure-complete",
            "prompt": "output-failure.md",
            "todo": []
          }
        }
      ]
    }
  }
}
```

## Prompt Template

The output-success prompt should confirm completion to the user:

```markdown
# Execution Complete

**Status:** ✅ All work items completed successfully

## Summary

Your planning and execution workflow has completed successfully. All objectives were met and success criteria have been satisfied.

## Next Steps

- Session is now closed
- All artifacts are available in session history
- You can start a new session at any time

Thank you for using CodeAccelerate!
```

## Best Practices

### DO:
- Always use as the final node in success paths
- Keep todo sequence empty unless logging is critical
- Ensure completion message is clear and positive
- Confirm all success criteria were met before routing here
- Link from conditional-branch or decision points

### DON'T:
- Add multiple todos (keep empty or single bash only)
- Include branching logic (terminal node)
- Route failed tasks here
- Add agent assignments
- Allow further routing from this node

## Validation Rules

- `todo` array must be `[]` (no tool calls, terminal)
- `next` field must be omitted (terminal node)
- DAG node must only contain: `id`, `prompt`, `todo` (no `next`)
- Prompt optional but recommended for context
- No custom metadata in node definition

## Valid Todo Items Reference

### ✅ Valid in output-success
- `[]` (empty) — Terminal success, no actions
- `bash` (optional) — Optional final logging/reporting command

### ✅ Valid in other nodes  
- `task` — Agent dispatch (parallel-tasks, analyze-deep, etc.)
- `question` — User input (intake, decision-gate, output-failure)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Error Handling

| Scenario | Resolution |
|----------|-----------|
| Routed to success incorrectly | Review decision logic in prior node |
| Missing logging opportunity | Add optional `bash` todo if needed |
| Session not closing | Verify terminal flag is set |
| User confusion about completion | Add clear summary message |

## Example in DAG Context

```json
{
  "id": "fix-deployment-bug-dag",
  "entry": {
    "id": "analyze-issue",
    "prompt": "analyze-deep.md",
    "todo": ["task"],
    "next": {
      "id": "implement-fix",
      "prompt": "implement.md",
      "todo": ["task"],
      "next": {
        "id": "verify-fix",
        "prompt": "verify.md",
        "todo": ["bash"],
        "next": [
          {
            "when": "Tests pass and deployment successful",
            "node": {
              "id": "bug-fixed",
              "prompt": "output-success.md",
              "todo": []
            }
          },
          {
            "when": "Tests fail or new issues found",
            "node": {
              "id": "retry-fix",
              "prompt": "loop-until-success.md",
              "todo": ["task"]
            }
          }
        ]
      }
    }
  }
}
```

Flow:
1. Analyze issue and identify root cause
2. Implement fix based on analysis
3. Verify fix with tests
4. If successful → route to output-success (session ends)
5. If failed → route to loop-until-success (retry)

## See Also

- **Output Failure Node** — Terminal node for failure paths
- **Conditional Branch Node** — Routing to success vs. failure
- **Session Overview Node** — Entry point before execution
- **Terminal Nodes Best Practices** — Session closure patterns
