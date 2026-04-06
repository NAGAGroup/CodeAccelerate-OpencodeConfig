---
name: tailwrench-delegation
description: Teaches how to dispatch @tailwrench for shell operations, verification checks, and git commands.
---

# Delegating to @tailwrench

This skill teaches how to dispatch @tailwrench for shell operations, verification, and git commands. Load it before writing a dispatch prompt to understand what @tailwrench can do and how to write clear, specific instructions.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "tailwrench", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should specify what commands to run in order, what to report back for each, what success criteria look like, and should include instructions to retrieve previous results from the appropriate Qdrant collection using qdrant_qdrant-find before starting and store final results when done.

## What @tailwrench Can Do

@tailwrench is a powerful operator with full tool access. It runs shell commands, executes builds and tests, performs verification checks, creates git commits, and manages environment setup. It follows instructions exactly and executes defined tasks with precision. It has a step limit of 30 — dispatch prompts must be specific and compact to avoid wasting steps on ambiguous work. @tailwrench focuses on verification and execution, not investigation or file editing. It reports findings directly without attempting to diagnose or fix problems beyond its scope.

## Rules for Good Dispatch Prompts

State the task clearly — verify, run commands, or commit. For verification, describe what to check and what a passing result looks like. For commands, list commands in order with what to report back for each. For commits, describe what was changed and the scope so @tailwrench can write a meaningful commit message. Write with specific, compact language — @tailwrench has 30 steps and cannot pursue investigation if uncertain. Focus on defined tasks only, not problem-solving or design work. Use imperative language — state what @tailwrench should do. Specify success criteria explicitly so the agent knows when verification passes and when it fails. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @tailwrench to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store the final results to the same collection when done.

## Skill-Loading Instructions for @tailwrench

Include explicit skill-loading instructions in your dispatch prompt so @tailwrench loads necessary skills before starting work. Add these instructions near the top of the dispatch prompt:

- **Before running shell commands:** Include "Load the shell-operations skill for running commands, tests, builds, and git operations."
- **Before storing results:** Include "Load the qdrant-notes skill for persisting verification results and findings to the plan session collection."

Skill-loading instructions should appear early in the dispatch prompt so the subagent loads skills before beginning shell operations. This ensures @tailwrench has access to shell operations and knowledge persistence from the start.

## Examples

**Good:** "Load the shell-operations skill for running shell commands. Load the qdrant-notes skill for storing results. Run: npm run build. Report full output and exit code. A pass means exit code 0, no errors. If it fails, report the exact error. Then run: npm test. Report test output and result. Before starting, retrieve previous results from Qdrant collection 'build-verification' using qdrant_qdrant-find. Store final results when done."

**Bad — open-ended task:** "Fix whatever is broken." @tailwrench executes instructions, not designs solutions. It works on defined problems with clear success criteria.

**Bad — file editing mixed in:** "Update the config file and then run the build." Dispatch @junior-dev for config changes, then @tailwrench separately for the build.

**Bad — missing-context bad example:** "Verify the changes work. Run the tests." Missing specific verification criteria or which commands to run. Specify what success means.

**Bad — investigation disguised as verification:** "Run the tests and figure out what is broken." @tailwrench verifies against specific criteria, not troubleshoots or investigates root causes.

**Bad — exceeds step budget:** "Build the project, run all tests, generate reports, verify documentation, check linting, and commit changes." @tailwrench has 30 steps; simplify or split into multiple dispatches.

**Bad — asks for troubleshooting work:** "Run the deployment and tell me what went wrong if it fails." Specify success criteria and what to check, not paths for investigation.

## When to Use @tailwrench

Dispatch @tailwrench for verification (testing, linting, coverage checks), build operations, environment setup, git operations, and shell commands. @tailwrench is especially useful when you need structured verification against clear success criteria. Use @junior-dev for file editing, dispatch scouts for investigation, place architectural design work in the planning phase.

## What @tailwrench Can and Cannot Do

@tailwrench can:
- Run shell commands and scripts
- Execute builds and tests
- Perform verification checks (linting, coverage, security scans)
- Create git commits and manage version control
- Set up environments and manage dependencies
- Generate reports and output results

@tailwrench cannot:
- Investigate code or design solutions
- Edit files (beyond configuration changes needed for execution)
- Make architectural decisions
- Troubleshoot complex problems (it follows instructions, not diagnoses)
- Exceed its 30-step limit on a single dispatch

For investigation, use scouts. For file editing, use @junior-dev. For design decisions, use the planning phase.

## Structuring Verification Tasks

Effective verification dispatch prompts structure checks carefully:

- **List commands in order:** Specify which commands to run and in what sequence
- **Define success criteria:** What output indicates success vs failure
- **Specify reporting:** What details to report for each command
- **Include error handling:** What to do if a command fails (continue or stop)
- **Set expectations:** What the agent should pay attention to in output

Clear structure helps @tailwrench stay within its 30-step limit and report useful results.

## Qdrant Integration for Verification

When using @tailwrench within a plan session, the dispatch prompt should include Qdrant instructions. @tailwrench retrieves prior results (to understand what has been verified) and stores final results (so other agents can see what verification found).

This creates a verification record. Each verification builds on prior results, and the planning process can track overall verification status.

## Common Verification Patterns

**Pattern: Build → Test Sequence**
Run build command first. If it succeeds (exit code 0), run tests. Report both build and test results. This sequence ensures that the build is valid before tests run.

**Pattern: Multiple Independent Checks**
Run linting, type checking, security scanning in sequence. Report results for each. Success means all checks pass. This pattern catches multiple categories of problems.

**Pattern: Before/After Verification**
Run verification before a change (baseline). Make the change. Run verification after (confirmation). Compare results to verify the change had the intended effect.

## Dispatch Prompt Quality Checklist

Before dispatching @tailwrench, verify your prompt includes:
- ✓ Clear task (verify, run, build, commit)
- ✓ Specific commands in order
- ✓ Success criteria (what exit code or output indicates success)
- ✓ What to report for each step
- ✓ Error handling (continue or stop on failure)
- ✓ For commits: what was changed and scope
- ✓ Plan name and Qdrant collection name (if applicable)
- ✓ Instructions to retrieve prior results from Qdrant (if applicable)
- ✓ Instructions to store final results when done (if applicable)
