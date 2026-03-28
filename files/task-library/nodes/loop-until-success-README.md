# Loop Until Success Node Type

---

## DAG v2.0 Schema Compliance

Loop until success nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"retry-loop"`) |
| `prompt` | Bare filename: `"loop-until-success.md"` |
| `todo` | `["bash"]` only — execute retry logic |
| `next` | Branch array with ≥2 options (success/failure paths) |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata
- Uses unrolled loop pattern (explicit duplicate nodes with `-2`, `-3` suffixes)

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **loop-until-success** node is a control-flow node that implements retry logic with automatic iteration tracking. It attempts work via bash, evaluates the result, and either succeeds, retries with backoff, or fails after max iterations. Uses an unrolled loop pattern to support DAG-based execution.

## Purpose

- Implement resilient retry logic for failure-prone operations
- Track retry attempts and enforce maximum iteration limits
- Execute work with exponential backoff between retries
- Route to success or failure based on exit code and attempt count
- Support build-test-fix and deployment retry cycles

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `loop-until-success` |
| **Category** | Control-flow |
| **Todo Sequence** | `["bash"]` |
| **Primary Agent** | HeadWrench |
| **Agent Step Budget** | 10 steps |
| **Branching Support** | Branch (2-3 paths with when conditions) |
| **Requires Prompt** | Yes |

## When to Use

- **Build failures** — Retry failed builds with backoff
- **Test flakiness** — Re-run occasionally-failing tests
- **Network operations** — Retry API calls with exponential backoff
- **Deployment resilience** — Retry failed deployments
- **Transient errors** — Handle temporary infrastructure issues
- **Resource contention** — Retry when resources become available

## Structure

```json
{
  "id": "deploy-with-retry",
  "name": "Deploy With Retry",
  "prompt": "loop-until-success.md",
  "todo": ["bash"],
  "next": [
    {
      "when": "Exit code 0 - Deployment succeeded",
      "node": {
        "id": "verify-deployment",
        "prompt": "verify-deployment.md",
        "todo": ["bash"]
      }
    },
    {
      "when": "Iterations < 3 - Retry",
      "node": {
        "id": "deploy-with-retry",
        "prompt": "loop-until-success.md",
        "todo": ["bash"]
      }
    },
    {
      "when": "Iterations >= 3 - Max attempts reached",
      "node": {
        "id": "deploy-failed",
        "prompt": "output-failure.md",
        "todo": ["question"]
      }
    }
  ]
}
```

## Implementation Notes

### Behavior

1. **Attempt Execution** — HeadWrench executes bash todo
2. **Exit Code Check** — Evaluates if exit code is 0 (success)
3. **Iteration Count** — Checks current attempt against max iterations
4. **Backoff Wait** — Waits with exponential backoff before retry
5. **Conditional Routing** — Routes to success, retry, or failure

### Iteration Tracking

Iteration count stored in session state:

```
Iteration 1: Initial attempt
Iteration 2: First retry (1s wait)
Iteration 3: Second retry (2s wait)
Fail: Max iterations reached
```

### Backoff Strategy

Exponential backoff between retries:

```
Iteration 1 → wait 1s → Iteration 2
Iteration 2 → wait 2s → Iteration 3
Iteration 3 → wait 4s → Iteration 4 (if allowed)
```

Configuration:
- `backoff_base_ms`: 1000 (1 second)
- `backoff_strategy`: exponential (multiply by 2 each time)
- `max_iterations`: 3 (default, configurable)

### Condition Types

**Success Condition:**
```json
{
  "when": "Exit code 0 - Operation succeeded",
  "node": { ... }
}
```

**Retry Condition:**
```json
{
  "when": "Iterations < 3 - Retry",
  "node": {
    "id": "same-node-id",
    "prompt": "loop-until-success.md",
    "todo": ["bash"]
  }
}
```

**Max Attempts Condition:**
```json
{
  "when": "Iterations >= 3 - Max attempts reached",
  "node": { ... }
}
```

### Unrolled Loop Pattern

Loop-until-success uses an "unrolled" loop where retry branches point back to the same node:

```
attempt 1 (this node)
  ↓ [success] → proceed
  ↓ [retry] → same node (iteration 2)
       ↓ [success] → proceed
       ↓ [retry] → same node (iteration 3)
            ↓ [success] → proceed
            ↓ [fail] → max attempts reached
```

### Integration

- Typically follows execution nodes (build, deploy, test)
- Routes to success node or failure/recovery node
- Iteration state maintained in session
- Backoff delay applied between attempts
- Output and errors logged for debugging

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "resilient-deployment",
  "entry": {
    "id": "build-artifact",
    "prompt": "build.md",
    "todo": ["bash"],
    "next": {
      "id": "deploy-with-retries",
      "prompt": "loop-until-success.md",
      "todo": ["bash"],
      "next": [
        {
          "when": "Exit code 0 - Deploy succeeded",
          "node": {
            "id": "verify-deployment",
            "prompt": "verify-deployment.md",
            "todo": ["bash"],
            "next": {
              "id": "deploy-complete",
              "prompt": "output-success.md",
              "todo": []
            }
          }
        },
        {
          "when": "Iterations < 3 - Retry",
          "node": {
            "id": "deploy-with-retries",
            "prompt": "loop-until-success.md",
            "todo": ["bash"]
          }
        },
        {
          "when": "Iterations >= 3 - Max attempts",
          "node": {
            "id": "deployment-failed",
            "prompt": "output-failure.md",
            "todo": ["question"]
          }
        }
      ]
    }
  }
}
```

## Prompt Template

The loop-until-success prompt should explain retry logic and current attempt:

```markdown
# Deploy With Retry

**Goal:** Deploy application with automatic retry on failure.

## Current Attempt

This is attempt #{ITERATION_COUNT} of {MAX_ITERATIONS}.

## What to Do

Execute deployment with error handling:

1. Run deployment command: `./deploy.sh`
2. Capture exit code
3. If exit code 0: deployment succeeded, proceed
4. If exit code non-zero and iterations < 3: retry with backoff
5. If exit code non-zero and iterations >= 3: fail

## Retry Strategy

- **Attempt 1:** Immediate
- **Attempt 2:** Wait 1 second, then retry
- **Attempt 3:** Wait 2 seconds, then retry
- **Fail:** After 3 attempts, escalate to failure

## Delegation

**Agent:** HeadWrench
**Tool:** bash
**Routing:** Automatic based on exit code and iteration count

## Todo

1. `bash` — Deploy application:
   - Execute `./deploy.sh --prod`
   - Capture exit code and output
   - Route based on success or failure
```

## Best Practices

### DO:
- Use for operations known to have transient failures
- Set realistic max_iterations (2-5 typically)
- Implement exponential backoff to reduce server load
- Log each attempt for debugging
- Monitor retry patterns for recurring issues
- Route failed retries to human review

### DON'T:
- Use for operations with permanent failures
- Set max_iterations too high (creates long waits)
- Forget to exit after max attempts
- Retry without backoff (can overwhelm servers)
- Mix retry logic with other branching
- Skip logging of retry attempts
- Retry operations with side effects carelessly

## Validation Rules

- `todo` array must be exactly `["bash"]`
- Prompt required and must document retry strategy
- `next` must be a branch array with ≥2 conditions (success, retry/fail)
- Retry branches must use unrolled loop pattern with `-2`, `-3` suffixes
- Each branch must have a unique `when` condition
- DAG node must only contain: `id`, `prompt`, `todo`, `next`

## Valid Todo Items Reference

### ✅ Valid in loop-until-success
- `bash` — Command execution with retry routing

### ✅ Valid in other nodes  
- `task` — Agent dispatch (parallel-tasks, analyze-deep, etc.)
- `question` — User input (intake, decision-gate, output-failure)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Error Handling

| Scenario | Resolution |
|----------|-----------|
| Max iterations reached | Route to output-failure with explanation |
| Permanent failure detected | Exit early without retrying |
| Network timeout | Increase backoff delay or max_iterations |
| Resource exhaustion | Check resource availability before retry |
| Unexpected exit codes | Add additional when conditions for edge cases |

## Example in DAG Context - Build Test Fix Cycle

```json
{
  "id": "build-test-fix-cycle",
  "entry": {
    "id": "compile",
    "prompt": "compile.md",
    "todo": ["bash"],
    "next": {
      "id": "compile-with-retry",
      "prompt": "loop-until-success.md",
      "todo": ["bash"],
      "next": [
        {
          "when": "Exit code 0 - Build succeeded",
          "node": {
            "id": "run-tests",
            "prompt": "run-tests.md",
            "todo": ["bash"],
            "next": {
              "id": "test-with-retry",
              "prompt": "loop-until-success.md",
              "todo": ["bash"],
              "next": [
                {
                  "when": "Exit code 0 - Tests passed",
                  "node": {
                    "id": "build-complete",
                    "prompt": "output-success.md",
                    "todo": []
                  }
                },
                {
                  "when": "Iterations < 3 - Retry tests",
                  "node": {
                    "id": "test-with-retry",
                    "prompt": "loop-until-success.md",
                    "todo": ["bash"]
                  }
                },
                {
                  "when": "Iterations >= 3 - Tests failed",
                  "node": {
                    "id": "debug-failures",
                    "prompt": "debug-failures.md",
                    "todo": ["task"]
                  }
                }
              ]
            }
          }
        },
        {
          "when": "Iterations < 3 - Retry build",
          "node": {
            "id": "compile-with-retry",
            "prompt": "loop-until-success.md",
            "todo": ["bash"]
          }
        },
        {
          "when": "Iterations >= 3 - Build failed",
          "node": {
            "id": "fix-build-errors",
            "prompt": "fix-build-errors.md",
            "todo": ["task"]
          }
        }
      ]
    }
  }
}
```

Flow:
1. Attempt build (compile)
2. If build failed and retries < 3 → retry build
3. If build succeeded → run tests
4. If tests failed and retries < 3 → retry tests
5. If tests succeeded → build complete (success)
6. If build/tests failed after 3 attempts → human debug/fix required

## Configuration Examples

### Aggressive Retry (Flaky Tests)

```json
{
  "max_iterations": 5,
  "backoff_base_ms": 500,
  "backoff_strategy": "exponential"
}
```

### Conservative Retry (Deployments)

```json
{
  "max_iterations": 3,
  "backoff_base_ms": 2000,
  "backoff_strategy": "exponential"
}
```

### Network Resilience

```json
{
  "max_iterations": 10,
  "backoff_base_ms": 100,
  "backoff_strategy": "exponential"
}
```

## See Also

- **Conditional Branch Node** — Single-pass testing without retry
- **Output Success/Failure Nodes** — Terminal branches
- **Session State** — Where iteration count is tracked
- **Exponential Backoff** — Network resilience patterns
- **Resilience Patterns** — Best practices for retries
