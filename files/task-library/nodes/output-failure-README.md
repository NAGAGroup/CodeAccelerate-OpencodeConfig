# Output Failure Node Type

---

## DAG v2.0 Schema Compliance

Output failure nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"output-failure"`) |
| `prompt` | Bare filename: `"output-failure.md"` |
| `todo` | `[]` for no action, or `["question"]` for optional recovery decision |
| `next` | Omitted — terminal node |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata
- No `next` field (terminal node)

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **output-failure** node is a terminal node that marks the end of a failed planning or execution workflow. It provides graceful failure closure, optional user interaction for recovery decisions, and clear communication of error states. No further routing or branching occurs from this node.

## Purpose

- Signal failure or error state to the user
- Provide clear explanation of what went wrong
- Offer optional recovery or next-step choices
- Establish clear end state for failed execution paths
- Enable graceful session closure with error documentation

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `output-failure` |
| **Category** | Terminal |
| **Todo Sequence** | `[]` (empty, or optional `["question"]` for user choice) |
| **Primary Agent** | None (session terminates) |
| **Agent Step Budget** | 0 |
| **Branching Support** | Terminal (no branching) |
| **Requires Prompt** | No |

## When to Use

- **Execution failed** — Critical errors encountered during work
- **Build/test failed** — Build system, tests, or deployments failed
- **User abort** — User chose to stop or exit the session
- **Resource exhausted** — Timeout, budget, or other resource limits reached
- **Unrecoverable error** — Error too severe to retry

## Structure

```json
{
  "id": "execution-failed",
  "name": "Output Failure",
  "prompt": "output-failure.md",
  "todo": []
}
```

## Implementation Notes

### Behavior

1. **Terminal Marker** — Indicates this is the final node in a failed execution path
2. **No Agent Dispatch** — No agent work required; session state updates automatically
3. **Optional User Input** — Can include single question todo to ask about recovery
4. **Session Closure** — OpenCode marks session as failed with appropriate exit code
5. **Error Preservation** — Error context remains available in session history

### Optional User Question

If recovery or retry decision is needed:

```json
{
  "id": "execution-failed",
  "prompt": "output-failure.md",
  "todo": ["question"]
}
```

The question todo can ask:
- Would you like to retry with different parameters?
- Should we try an alternative approach?
- Would you like to skip this task and continue?
- Do you want to debug the failure further?

### Integration

- Routes from error conditions in prior nodes
- No outgoing branches or next nodes
- Session state automatically updated to "failed" or "error"
- Error code (exit status 1 or 2) communicated to system

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "deployment-dag",
  "entry": {
    "id": "pre-deploy-check",
    "prompt": "pre-deploy.md",
    "todo": ["bash"],
    "next": [
      {
        "when": "Pre-checks passed",
        "node": {
          "id": "deploy-app",
          "prompt": "deploy.md",
          "todo": ["bash"],
          "next": [
            {
              "when": "Deployment succeeded",
              "node": {
                "id": "deploy-success",
                "prompt": "output-success.md",
                "todo": []
              }
            },
            {
              "when": "Deployment failed",
              "node": {
                "id": "deploy-failed",
                "prompt": "output-failure.md",
                "todo": ["question"]
              }
            }
          ]
        }
      },
      {
        "when": "Pre-checks failed",
        "node": {
          "id": "prechecks-failed",
          "prompt": "output-failure.md",
          "todo": []
        }
      }
    ]
  }
}
```

## Prompt Template

The output-failure prompt should clearly communicate the failure state:

```markdown
# Execution Failed

**Status:** ❌ Work halted due to error

## Error Summary

The execution encountered an error that prevented completion. Details are available in the session history.

## What Happened

[Error message and context from prior node]

## Recovery Options

- **Retry** — Start over with same parameters
- **Alternative Approach** — Try different strategy
- **Debug** — Investigate root cause further
- **Exit** — Close session and try later

Would you like to:
1. Retry the failed task?
2. Try a different approach?
3. Continue with remaining work?
4. Exit and try again later?

Please let us know your preference.
```

## Best Practices

### DO:
- Always use as the final node in failure paths
- Keep error messages clear and actionable
- Preserve error context in session for debugging
- Offer recovery options when sensible
- Link from conditional-branch or error detection points

### DON'T:
- Add multiple todos (keep empty or single question only)
- Include branching logic (terminal node)
- Route successful tasks here
- Add agent assignments
- Allow further routing from this node
- Hide error details from user

## Validation Rules

- `todo` array must be `[]` or `["question"]` (terminal node)
- `next` field must be omitted (terminal node)
- DAG node must only contain: `id`, `prompt`, `todo` (no `next`)
- Prompt recommended for failure context and recovery information
- No custom metadata in node definition

## Valid Todo Items Reference

### ✅ Valid in output-failure
- `[]` (empty) — Terminal failure, no actions
- `question` (optional) — Optional user question about recovery

### ✅ Valid in other nodes  
- `task` — Agent dispatch (parallel-tasks, analyze-deep, etc.)
- `bash` — Command execution (conditional-branch, verification-check, etc.)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Error Handling

| Scenario | Resolution |
|----------|-----------|
| Routed to failure incorrectly | Review error detection logic |
| User needs retry capability | Add optional `question` todo |
| Error context not visible | Document error in prompt clearly |
| No recovery path defined | Add guidance in prompt |
| User uncertain about next steps | Ask explicit recovery question |

## Example in DAG Context

```json
{
  "id": "build-and-test-dag",
  "entry": {
    "id": "start-build",
    "prompt": "start-build.md",
    "todo": ["bash"],
    "next": {
      "id": "run-tests",
      "prompt": "run-tests.md",
      "todo": ["bash"],
      "next": [
        {
          "when": "Tests pass",
          "node": {
            "id": "build-success",
            "prompt": "output-success.md",
            "todo": []
          }
        },
        {
          "when": "Tests fail",
          "node": {
            "id": "test-failures",
            "prompt": "output-failure.md",
            "todo": ["question"]
          }
        }
      ]
    }
  }
}
```

Flow:
1. Start build process
2. Run test suite
3. If tests pass → route to output-success (session ends successfully)
4. If tests fail → route to output-failure (ask user about retry)

## See Also

- **Output Success Node** — Terminal node for success paths
- **Conditional Branch Node** — Routing to success vs. failure
- **Error Detection Patterns** — When to route to failure
- **Session Overview Node** — Entry point before execution
- **Terminal Nodes Best Practices** — Session closure patterns
