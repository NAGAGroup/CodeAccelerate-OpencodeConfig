---
name: junior-dev
description: Teaches how to dispatch junior-dev for goal-oriented code implementation with investigation-driven approach.
---
<overview>
junior-dev investigates the codebase before making any changes, then implements targeted edits to achieve the stated goal. It reads and writes files — no shell commands, builds, tests, or documentation.
</overview>

<what-junior-dev-does>
Investigates with semantic search and call tracing before changing anything.
Makes targeted edits to achieve the goal.
Responds with what was accomplished and why key decisions were made.
</what-junior-dev-does>

<example name="delegation">
Goal: Add input validation to the data ingestion pipeline so that malformed records are rejected before processing rather than causing failures downstream.

Context: The ingestion pipeline is the central path for all incoming data. Upstream components pass records without validating format or required fields. Downstream processing assumes records are well-formed and fails in hard-to-debug ways when they are not.

Scope: Validation logic only — do not touch downstream processing, storage, or how errors are surfaced to callers. Follow whatever validation patterns already exist in the codebase.

Constraints: Rejection must be explicit and distinguishable from a processing failure — callers need to know whether a record was rejected vs failed to process.

Plan Name: ingestion-validation

Report what was accomplished and any notable implementation decisions made.
</example>
