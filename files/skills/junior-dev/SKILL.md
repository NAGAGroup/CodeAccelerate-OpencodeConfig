---
name: junior-dev
description: Teaches how to dispatch junior-dev for goal-oriented code implementation with investigation-driven approach.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Describe the goal and constraints — not specific files or edit instructions. Junior-dev investigates the codebase itself.
</rules>

<example>
Goal: Add input validation to the data ingestion pipeline so that malformed records are rejected before processing rather than causing failures downstream.

Context: The ingestion pipeline is the central path for all incoming data. Upstream components pass records without validating format or required fields. Downstream processing assumes records are well-formed and fails in hard-to-debug ways when they are not.

Scope: Validation logic only — do not touch downstream processing, storage, or how errors are surfaced to callers. Follow whatever validation patterns already exist in the codebase.

Constraints: Rejection must be explicit and distinguishable from a processing failure — callers need to know whether a record was rejected vs failed to process.

Plan Name: [plan name or N/A]

Report what was accomplished and any notable implementation decisions made.
</example>
