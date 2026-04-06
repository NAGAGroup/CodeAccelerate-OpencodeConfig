---
name: tailwrench-delegation
description: Teaches how to dispatch @tailwrench for shell operations, verification checks, and git commands.
---

# Delegating to @tailwrench

This skill teaches how to dispatch @tailwrench for shell operations, verification, and git commands. Load it before writing a dispatch prompt to understand what @tailwrench can do and how to write clear, specific instructions.

## How to Dispatch the Agent

Call the task tool with subagent_type tailwrench:

```
task(
  subagent_type="tailwrench",
  description="Run build and tests",
  prompt="Run: npm run build. Report the full output and exit code. A pass means exit code 0 with no errors. If it fails, report the exact error message. Then run: npm test. Report the test output and pass/fail result. Do not attempt to fix failures. Before starting, retrieve any previous verification results from Qdrant collection 'build-verification' using qdrant_qdrant-find. Store the final results to the same collection when done."
)
```

**Parameters:**
- `subagent_type`: always the string "tailwrench"
- `description`: 3–5 word label for logging
- `prompt`: your full goal-based dispatch prompt

## What @tailwrench Can Do

@tailwrench is a powerful operator with full tool access. It runs shell commands, executes builds and tests, performs verification checks, creates git commits, and manages environment setup. It follows instructions exactly and executes defined tasks with precision. It has a step limit of 30 — dispatch prompts must be specific and compact to avoid wasting steps on ambiguous work. @tailwrench focuses on verification and execution, not investigation or file editing. It reports findings directly without attempting to diagnose or fix problems beyond its scope.

## Rules for Good Dispatch Prompts

State the task clearly — verify, run commands, or commit. For verification, describe what to check and what a passing result looks like. For commands, list commands in order with what to report back for each. For commits, describe what was changed and the scope so @tailwrench can write a meaningful commit message. Write with specific, compact language — @tailwrench has 30 steps and cannot pursue investigation if uncertain. Focus on defined tasks only, not problem-solving or design work. Use imperative language — state what @tailwrench should do. Specify success criteria explicitly so the agent knows when verification passes and when it fails. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @tailwrench to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store the final results to the same collection when done.

## Examples

**Good:** "Run: npm run build. Report full output and exit code. A pass means exit code 0, no errors. If it fails, report the exact error. Then run: npm test. Report test output and result. Before starting, retrieve previous results from Qdrant collection 'build-verification' using qdrant_qdrant-find. Store final results when done."

**Bad — open-ended task:** "Fix whatever is broken." @tailwrench executes instructions, not designs solutions. It works on defined problems with clear success criteria.

**Bad — file editing mixed in:** "Update the config file and then run the build." Dispatch @junior-dev for config changes, then @tailwrench separately for the build.

**Bad — missing-context bad example:** "Verify the changes work. Run the tests." Missing specific verification criteria or which commands to run. Specify what success means.

**Bad — investigation disguised as verification:** "Run the tests and figure out what is broken." @tailwrench verifies against specific criteria, not troubleshoots or investigates root causes.

**Bad — exceeds step budget:** "Build the project, run all tests, generate reports, verify documentation, check linting, and commit changes." @tailwrench has 30 steps; simplify or split into multiple dispatches.

**Bad — asks for troubleshooting work:** "Run the deployment and tell me what went wrong if it fails." Specify success criteria and what to check, not paths for investigation.

## When to Use @tailwrench

Dispatch @tailwrench for verification (testing, linting, coverage checks), build operations, environment setup, git operations, and shell commands. @tailwrench is especially useful when you need structured verification against clear success criteria. Use @junior-dev for file editing, dispatch scouts for investigation, place architectural design work in the planning phase.
