<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Planning Session: Redesign `files/planning/` Infrastructure

## Session Goal

Redesign the planning directory scaffolds from scratch to eliminate boilerplate redundancy, fix sequencing violations, resolve clarity gaps, and rebuild collaborative and deep-research scaffolds to generate session design specs instead of full execution plans.

## What This Session Is

This session contains **8 independent sequential subtasks** (no loops) with **4 gate points**:
- ST01: Expand plan-design-guidelines.md
- ST02: Eliminate boilerplate redundancy (reference-update gate before proceeding)
- ST03–ST07: Fix sequencing, rebuild scaffolds, enforce strict language
- ST08: Decide on plan-deep-review rebuild scope (user decision)

**Gate 1** occurs before ST02 batch reference updates. **Gates 2 & 3** occur after ST05 and ST06 finalize (verify design spec and research-focus plan). **Gate 4** is a user decision at ST08.

## Session Path

All artifacts live in `.opencode/session-plans/redesign-planning-dir/`. You will execute subtask prompts in order. Do not skip any subtask. When you encounter a gate, surface findings to the user and wait for explicit approval before calling `next_step()`.

## Operating Instructions

- Subtask prompts are agent-internal; each specifies its own delegation
- Terminal subtasks call `close_session()` from within their final subtask prompt; do not call it from this overview
- Read this overview once, internalize it, then call `next_step()` immediately

## Advance

Call `next_step()` immediately. Do this exactly once. Do NOT read session files or other context.

