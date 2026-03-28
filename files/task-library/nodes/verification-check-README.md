# Verification Check Node Type

---

## DAG v2.0 Schema Compliance

Verification check nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"verify-build"`) |
| `prompt` | Bare filename: `"verification-check.md"` |
| `todo` | `["bash"]` only — run verification commands |
| `next` | Branch array with ≥2 options (pass/fail paths) |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **verification-check** node executes validation tests, builds, linting, or integration checks and branches execution to different paths based on results. HeadWrench runs a bash command (e.g., `npm test`, `npm run build`, `npm run lint`) and routes to different branches based on exit codes or output patterns. This is a quality gate node typical in CI/CD workflows.

## Purpose

- Execute test suites and branch on pass/fail/error
- Verify builds compile successfully before deployment
- Run linting and code quality checks
- Execute integration tests before release
- Provide conditional routing based on verification results

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `verification-check` |
| **Category** | Validation |
| **Todo Sequence** | `["bash"]` (single bash command) |
| **Primary Agent** | HeadWrench |
| **Agent Step Budget** | 5 |
| **Branching Support** | Yes (2+ branches required) |
| **Parallel Execution** | No (sequential verification) |
| **Requires Prompt** | Yes |
| **Requires Branching** | Yes (min 2 branches) |

## When to Use

- **After parallel-tasks** to verify all work completed successfully
- **Before deployment** to ensure build and tests pass
- **In feedback loops** to retry failed tasks
- **Quality gates** to prevent bad code from advancing
- **Integration validation** to verify system compatibility
- **Build verification** to catch compilation errors early

## Supported Verification Commands

### Test Suites
```bash
npm test                    # Jest, Mocha, Vitest, etc.
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
bun test                   # Bun test runner
```

### Build Verification
```bash
npm run build              # TypeScript, Webpack, etc.
cargo build                # Rust builds
go build                   # Go builds
tsc --noEmit               # TypeScript check
```

### Linting and Quality
```bash
npm run lint               # ESLint, Prettier, etc.
npm run format:check       # Format verification
cargo check                # Rust checks
```

### Custom Verification
```bash
./scripts/verify.sh        # Custom verification script
health-check.sh            # System health checks
```

## Exit Codes and Routing

### Standard Exit Codes

| Code | Meaning | Typical Branch |
|------|---------|-----------------|
| 0 | All checks passed | `output-success` or next node |
| 1 | Test failures | Retry or fix tasks |
| 2 | Build failures | Retry or fix tasks |
| 3 | Linting failures | Retry or fix tasks |
| 124 | Command timeout | Fail or extend timeout |

### Branch Routing Examples

```
Exit 0 → Tests Passed
Exit 1 → Tests Failed → Retry
Exit 2 → Build Failed → Retry
Exit 124 → Timeout → Fail
```

## Structure

```json
{
  "id": "verify-outputs",
  "name": "Verification Check",
  "prompt": "verification-check.md",
  "todo": ["bash — npm test"],
  "next": [
    {
      "when": "Exit code 0 - Tests passed",
      "node": {
        "id": "tests-passed",
        "prompt": "output-success.md",
        "todo": []
      }
    },
    {
      "when": "Exit code 1 - Tests failed",
      "node": {
        "id": "fix-failures",
        "prompt": "loop-until-success.md",
        "todo": ["task"]
      }
    }
  ]
}
```

## Implementation Notes

### Task Design

The verification-check node executes a single bash command:

**Command Categories:**

1. **Test Suite Execution**
   - Runs full or partial test suite
   - Captures pass/fail/error results
   - Routes based on exit code

2. **Build Verification**
   - Attempts compilation or build
   - Captures build errors
   - Routes based on success/failure

3. **Quality Checks**
   - Runs linting or format checks
   - Captures style violations
   - Routes based on compliance

4. **Integration Validation**
   - Runs integration test suite
   - Verifies system components interact
   - Routes based on test results

### Critical Requirements

1. **Clear Exit Codes** — Command must produce distinct exit codes for different outcomes
2. **Output Capture** — stdout/stderr captured for debugging
3. **Timeout Handling** — Commands should complete within reasonable time
4. **Deterministic Results** — Same input should produce same verification result
5. **No Side Effects** — Verification should not modify production state

## Integration

### Typical Usage Patterns

#### Pattern 1: Parallel Tasks → Verify → Success
```json
{
  "id": "parallel-work",
  "prompt": "parallel-tasks.md",
  "todo": ["task", "task", "task"],
  "next": {
    "id": "verify-all",
    "prompt": "verification-check.md",
    "todo": ["bash"],
    "next": [
      {
        "when": "Exit code 0",
        "node": {
          "id": "success",
          "prompt": "output-success.md",
          "todo": []
        }
      }
    ]
  }
}
```

#### Pattern 2: Verify → Retry Loop
```json
{
  "id": "verify-and-retry",
  "prompt": "verification-check.md",
  "todo": ["bash"],
  "next": [
    {
      "when": "Exit code 0",
      "node": { "id": "success", "prompt": "output-success.md", "todo": [] }
    },
    {
      "when": "Exit code non-zero",
      "node": {
        "id": "retry",
        "prompt": "loop-until-success.md",
        "todo": ["task — Fix failures and retry verification"]
      }
    }
  ]
}
```

#### Pattern 3: Multiple Exit Code Handling
```json
{
  "id": "verify-with-cases",
  "prompt": "verification-check.md",
  "todo": ["bash — npm test"],
  "next": [
    {
      "when": "Exit code 0 - All tests passed",
      "node": { "id": "deploy", "prompt": "deploy.md", "todo": [] }
    },
    {
      "when": "Exit code 1 - Test failures detected",
      "node": { "id": "fix-tests", "prompt": "loop-until-success.md", "todo": ["task"] }
    },
    {
      "when": "Exit code 124 - Tests timed out",
      "node": { "id": "timeout", "prompt": "output-failure.md", "todo": [] }
    }
  ]
}
```

## Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "feature-delivery-verified",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "intake",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "load-skills",
        "prompt": "skill-invoke.md",
        "todo": ["skill"],
        "next": {
          "id": "parallel-implementation",
          "prompt": "parallel-tasks.md",
          "todo": ["task", "task", "task"],
          "next": {
            "id": "verify-quality",
            "prompt": "verification-check.md",
            "todo": ["bash — npm test && npm run build && npm run lint"],
            "next": [
              {
                "when": "Exit code 0 - All checks passed",
                "node": {
                  "id": "compress-results",
                  "prompt": "compression-node.md",
                  "todo": ["task"],
                  "next": {
                    "id": "success",
                    "prompt": "output-success.md",
                    "todo": []
                  }
                }
              },
              {
                "when": "Exit code non-zero - Issues detected",
                "node": {
                  "id": "fix-issues",
                  "prompt": "loop-until-success.md",
                  "todo": ["task — Fix failing tests and rebuild"]
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

## Prompt Template

The verification-check prompt should specify the command and exit code routing:

```markdown
# Verification Check

**Goal:** Execute verification checks and branch based on results.

## What to do

Run test suite and routing based on exit codes.

## Verification Command

```bash
npm test
```

## Exit Code Routing

- **Exit 0:** Tests passed → advance to success node
- **Exit 1:** Tests failed → dispatch fix task
- **Exit 2:** Build errors → dispatch build fix
- **Other:** Unexpected error → fail path

## Todo

1. `bash` — Execute test suite:
   - Run `npm test` (or equivalent)
   - Capture exit code for branching
   - Log test output for debugging
   - Route based on exit code to appropriate branch
```

## Performance Characteristics

| Aspect | Value |
|--------|-------|
| **Typical runtime** | 30-120 seconds (depends on test suite) |
| **Parallelization** | None (sequential verification) |
| **Timeout handling** | Configure timeout for CI/CD |
| **Output capture** | Full stdout/stderr logged |
| **Caching** | Can leverage build/test caches |

## Best Practices

### DO:
- Place verification after implementation nodes
- Use clear, meaningful exit codes for branching
- Capture full command output for debugging
- Create retry paths for transient failures
- Document expected exit codes in prompt
- Run fast checks first (lint before full tests)
- Use output success/failure nodes for terminal cases

### DON'T:
- Execute verification without branching
- Assume exit code 0 is only success case
- Create verification loops that repeat infinitely
- Run expensive checks first (run lint before full tests)
- Use verification for non-deterministic processes
- Create more than 5-10 branches (use conditional logic)

## Validation Rules

- `todo` array must be exactly `["bash"]`
- Must have a prompt file (required)
- `next` must be a branch array with ≥2 conditions
- Each branch must have a unique `when` string
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- No custom metadata in DAG node definitions
- Exit code routing must be defined in prompt

## Valid Todo Items Reference

### ✅ Valid in verification-check
- `bash` — Command execution (single bash command only)

### ✅ Valid in other nodes  
- `task` — Agent dispatch (parallel-tasks, analyze-deep, etc.)
- `question` — User input (intake, decision-gate, output-failure)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `skill` — Use skill-invoke node instead
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Command Examples

### Example 1: Basic Test Verification
```bash
npm test
# Exit 0: Tests passed
# Exit 1: Tests failed
```

### Example 2: Build + Test + Lint Combo
```bash
npm run build && npm test && npm run lint
# Exit 0: All checks passed
# Exit 1: Any check failed (specify which in output)
```

### Example 3: Test with Coverage
```bash
npm test -- --coverage --coverageThreshold='{"global":{"branches":80}}'
# Exit 0: Coverage threshold met
# Exit 1: Coverage below threshold
```

### Example 4: Custom Verification Script
```bash
./scripts/verify-deployment.sh
# Exit 0: Ready for deployment
# Exit 1: Deployment checks failed
# Exit 2: Environment validation failed
```

## Error Handling

| Error | Resolution |
|-------|-----------|
| Command not found | Install dependencies or check path |
| Tests timeout | Increase timeout or optimize test suite |
| Flaky tests | Retry or improve test stability |
| Exit code unexpected | Update branch conditions or debug command |
| Output not captured | Ensure stderr is redirected to stdout |
| Dependencies missing | Run setup/installation before verification |

## Integration with Loop Nodes

### Pattern: Verify → Retry Loop

```json
{
  "id": "verify",
  "prompt": "verification-check.md",
  "todo": ["bash"],
  "next": [
    {
      "when": "Exit 0",
      "node": { "id": "success", "prompt": "output-success.md", "todo": [] }
    },
    {
      "when": "Exit non-zero",
      "node": {
        "id": "retry-loop",
        "prompt": "loop-until-success.md",
        "todo": ["task — Fix failures"],
        "next": {
          "id": "re-verify",
          "prompt": "verification-check.md",
          "todo": ["bash"]
        }
      }
    }
  ]
}
```

## Typical Workflows

### Workflow 1: Simple Pass/Fail
```
parallel-tasks (implement)
  ↓
verification-check (test)
  ↓
  ├→ Exit 0 → output-success
  └→ Exit 1 → loop-until-success → retry verification
```

### Workflow 2: Build + Test + Deploy
```
parallel-tasks (implementation)
  ↓
verification-check (build && test)
  ↓
  ├→ Exit 0 → deploy node
  └→ Exit 1 → fix failures → retry
```

### Workflow 3: Quality Gate with Multiple Checks
```
parallel-tasks (implementation)
  ↓
verification-check (lint && test && build)
  ↓
  ├→ Exit 0 → compression-node → output-success
  ├→ Exit 1 → fix tests → retry
  └→ Exit 2 → fix build → retry
```

## Troubleshooting

### Branching not working
**Check:** Ensure all `when` conditions are covered and exit codes match.

### Commands timing out
**Solution:** Increase timeout or split into separate verification nodes.

### Exit code not as expected
**Debug:** Run command manually to verify actual exit code.

### Retries looping infinitely
**Solution:** Ensure fix tasks actually resolve issues; add max retry limit.

## See Also

- **Parallel Tasks Node** — Typical precursor
- **Loop Until Success Node** — Typical retry path
- **Output Success Node** — Typical success path
- **Output Failure Node** — Typical failure path
- **Compression Node** — Optional post-verification
- **Conditional Branch Node** — Alternative for bash routing
