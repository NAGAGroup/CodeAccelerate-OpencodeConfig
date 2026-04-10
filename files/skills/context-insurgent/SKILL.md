---
name: context-insurgent
description: Teaches how to dispatch context-insurgent for deep, narrow analysis of specific code mechanisms and logic flows.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Describe mechanisms and behaviors to investigate — not specific files or paths.
</rules>

<example>
Goal: Understand how the project's error recovery mechanism works — what triggers recovery, what state is preserved, and what conditions cause unrecoverable failure.

Questions to answer: What initiates the recovery sequence? What state is saved and restored? Are there conditions where recovery is skipped? What happens to in-progress work when recovery triggers?

Why this matters: We are adding a new operation type and need to know which recovery paths it must participate in and what invariants must be maintained.

Plan Name: [plan name or N/A]

Return findings as analytical prose describing how the mechanism works, what the key behaviors and constraints are, and what was examined but could not be fully determined.
</example>
