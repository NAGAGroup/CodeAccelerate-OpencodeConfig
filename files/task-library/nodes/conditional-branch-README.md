# Conditional Branch Node Type

---

## DAG v2.0 Schema Compliance

Conditional branch nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"test-results"`) |
| `prompt` | Bare filename: `"conditional-branch.md"` |
| `todo` | `["bash"]` only — command execution determines branch |
| `next` | Branch array with ≥2 options (each with `when` and `node`) |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **conditional-branch** node is a control-flow branching node that routes execution to different paths based on bash command results or task outcomes. It evaluates conditions (exit codes, output patterns, file states) and automatically routes to appropriate next nodes without requiring user input.

## Purpose

- Execute conditional tests and route based on results
- Implement test-driven execution paths
- Validate build, deployment, or environment states
- Route to recovery or success paths automatically
- Enable data-driven branching in DAGs

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `conditional-branch` |
| **Category** | Control-flow |
| **Todo Sequence** | `["bash"]` |
| **Primary Agent** | HeadWrench |
| **Agent Step Budget** | 5 steps |
| **Branching Support** | Branch (2+ paths with when conditions) |
| **Requires Prompt** | Yes |

## When to Use

- **After execution** — Verify results and branch on success/failure
- **Test validation** — Run tests and route based on pass/fail
- **Build checks** — Verify build completed and branch accordingly
- **Environment detection** — Check deployment environment and adjust
- **Conditional task flow** — Execute different work based on system state
- **Retry detection** — Decide whether to retry or escalate

## Structure

```json
{
  "id": "verify-tests",
  "name": "Verify Tests",
  "prompt": "conditional-branch.md",
  "todo": ["bash"],
  "next": [
    {
      "when": "Exit code 0 - Tests passed",
      "node": {
        "id": "proceed",
        "prompt": "proceed.md",
        "todo": []
      }
    },
    {
      "when": "Exit code 1 - Tests failed",
      "node": {
        "id": "retry-failed",
        "prompt": "loop-until-success.md",
        "todo": ["task"]
      }
    }
  ]
}
```

## Implementation Notes

### Behavior

1. **Command Execution** — HeadWrench executes bash command in todo
2. **Exit Code Capture** — Captures exit code and output from command
3. **Condition Matching** — Evaluates which when condition matches
4. **Automatic Routing** — Routes to matching branch without user input
5. **Output Logging** — Command output available for debugging

### Condition Types

#### Exit Code Based

```json
{
  "when": "Exit code 0 - Tests passed",
  "node": { ... }
}
```

Standard exit codes:
- `0` = Success
- `1` = General error
- `2` = Misuse of command
- `127` = Command not found

#### Pattern Matching

```json
{
  "when": "Output contains 'PASSED'",
  "node": { ... }
}
```

### Example Conditions

**Test Validation:**
```json
{
  "when": "Exit code 0 - All tests passed",
  "node": { "id": "deploy", "prompt": "deploy.md" }
},
{
  "when": "Exit code 1 - Tests failed",
  "node": { "id": "fix-tests", "prompt": "fix-tests.md" }
}
```

**Environment Check:**
```json
{
  "when": "Production environment detected",
  "node": { "id": "prod-deploy", "prompt": "prod-deploy.md" }
},
{
  "when": "Development environment",
  "node": { "id": "dev-deploy", "prompt": "dev-deploy.md" }
}
```

**Build Validation:**
```json
{
  "when": "Build completed successfully",
  "node": { "id": "run-tests", "prompt": "run-tests.md" }
},
{
  "when": "Build failed",
  "node": { "id": "fix-build", "prompt": "fix-build.md" }
}
```

### Integration

- Typically follows execution or test nodes
- Routes to success, retry, or failure paths
- HeadWrench automatically evaluates condition
- No user interaction required
- Output logged for debugging

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "test-driven-development",
  "entry": {
    "id": "run-unit-tests",
    "prompt": "run-unit-tests.md",
    "todo": ["bash"],
    "next": [
      {
        "when": "Exit code 0 - Unit tests passed",
        "node": {
          "id": "run-integration-tests",
          "prompt": "run-integration-tests.md",
          "todo": ["bash"],
          "next": [
            {
              "when": "Exit code 0 - Integration tests passed",
              "node": {
                "id": "deploy-ready",
                "prompt": "output-success.md",
                "todo": []
              }
            },
            {
              "when": "Exit code 1 - Integration tests failed",
              "node": {
                "id": "debug-integration",
                "prompt": "debug-integration.md",
                "todo": ["task"]
              }
            }
          ]
        }
      },
      {
        "when": "Exit code 1 - Unit tests failed",
        "node": {
          "id": "fix-unit-tests",
          "prompt": "fix-unit-tests.md",
          "todo": ["task"]
        }
      }
    ]
  }
}
```

## Prompt Template

The conditional-branch prompt should explain the test/condition and expected outcomes:

```markdown
# Test Validation

**Goal:** Run test suite and route to success or retry based on results.

## What to Do

Use bash to run the test suite:

1. Execute `npm test` or equivalent test command
2. Capture exit code (0 = success, 1 = failure)
3. Route to appropriate branch based on result

## Expected Outcomes

- **Pass (exit code 0):** Tests passed, proceed to deployment
- **Fail (exit code 1):** Tests failed, route to debugging/retry
- **Error (exit code 2+):** Environment or setup error

## Delegation

**Agent:** HeadWrench
**Tool:** bash
**Routing:** Automatic based on exit code

## Todo

1. `bash` — Run test suite:
   - Execute `npm test` (or `pytest`, `make test`, etc.)
   - Exit code 0 means tests passed
   - Exit code 1 means tests failed
   - Capture output for debugging
```

## Best Practices

### DO:
- Use for automated validation and routing
- Keep conditions simple and unambiguous
- Log output for debugging decision
- Route to appropriate recovery or success paths
- Use exit codes consistently
- Handle edge cases with catch-all condition

### DON'T:
- Use for user-input decisions (use decision-gate instead)
- Have overlapping when conditions
- Skip condition coverage (ensure all outcomes covered)
- Ignore exit codes in evaluation
- Add agent assignments beyond HeadWrench
- Use for complex multi-branch logic (max 3-5 branches recommended)

## Validation Rules

- `todo` array must be exactly `["bash"]`
- Prompt required and must describe conditions
- `next` must be a branch array with ≥2 options
- Each branch must have a unique `when` condition
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- No custom metadata in node definition

## Valid Todo Items Reference

### ✅ Valid in conditional-branch
- `bash` — Command execution with conditional routing

### ✅ Valid in other nodes  
- `task` — Agent dispatch (parallel-tasks, analyze-deep, etc.)
- `question` — User input (intake, decision-gate, output-failure)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Error Handling

| Scenario | Resolution |
|----------|-----------|
| Exit code not matching any when | Add catch-all "default" condition |
| Ambiguous when conditions | Refine conditions to be mutually exclusive |
| Command fails to execute | Check bash syntax and permissions |
| Output parsing error | Simplify condition to rely on exit code |
| Unexpected exit code | Log output and add debugging node |

## Example in DAG Context - Build and Deploy

```json
{
  "id": "ci-cd-pipeline",
  "entry": {
    "id": "build",
    "prompt": "build.md",
    "todo": ["bash"],
    "next": {
      "id": "verify-build",
      "prompt": "conditional-branch.md",
      "todo": ["bash"],
      "next": [
        {
          "when": "Exit code 0 - Build succeeded",
          "node": {
            "id": "run-tests",
            "prompt": "run-tests.md",
            "todo": ["bash"],
            "next": {
              "id": "verify-tests",
              "prompt": "conditional-branch.md",
              "todo": ["bash"],
              "next": [
                {
                  "when": "Exit code 0 - Tests passed",
                  "node": {
                    "id": "deploy",
                    "prompt": "deploy.md",
                    "todo": ["bash"]
                  }
                },
                {
                  "when": "Exit code 1 - Tests failed",
                  "node": {
                    "id": "fix-issues",
                    "prompt": "fix-issues.md",
                    "todo": ["task"]
                  }
                }
              ]
            }
          }
        },
        {
          "when": "Exit code 1 - Build failed",
          "node": {
            "id": "fix-build",
            "prompt": "fix-build.md",
            "todo": ["task"]
          }
        }
      ]
    }
  }
}
```

Flow:
1. Execute build command
2. Check build exit code
3. If build succeeded → run tests
4. Check test results
5. If tests passed → deploy
6. If tests failed → fix issues
7. If build failed → fix build

## See Also

- **Decision Gate Node** — User-driven branching (vs. automatic)
- **Loop Until Success Node** — Retry logic with conditional routing
- **Output Success/Failure Nodes** — Terminal branches
- **Bash Tool** — Command execution and exit code handling
- **Test-Driven Execution** — Patterns for validation and routing
