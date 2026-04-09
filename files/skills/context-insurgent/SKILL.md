---
name: context-insurgent
description: Teaches how to dispatch context-insurgent for deep, narrow analysis of specific code mechanisms and logic flows.
---
<overview>
context-insurgent traces specific mechanisms, data flows, and dependencies across the project. It returns rich analytical findings about how things work — behaviors, constraints, failure modes, non-obvious interactions. Use for narrow-deep analysis, not broad surveying.
</overview>

<what-context-insurgent-does>
Traces specific mechanisms using semantic search, call tracing, glob, grep, and read.
Synthesizes findings into analytical prose — what the mechanism does, how it behaves, what the constraints are.
Includes an explicit unknowns section covering what could not be verified.
Makes no changes — read only.
</what-context-insurgent-does>

<example name="delegation">
Goal: Understand how the project's error recovery mechanism works — what triggers recovery, what state is preserved, and what conditions cause unrecoverable failure.

Questions to answer: What initiates the recovery sequence? What state is saved and restored? Are there conditions where recovery is skipped? What happens to in-progress work when recovery triggers?

Why this matters: We are adding a new operation type and need to know which recovery paths it must participate in and what invariants must be maintained for recovery to work correctly.

Plan Name: error-recovery-analysis

Return findings as analytical prose describing how the mechanism works, what the key behaviors and constraints are, and what was examined but could not be fully determined.
</example>
