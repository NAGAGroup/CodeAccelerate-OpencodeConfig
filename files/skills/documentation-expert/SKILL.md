---
name: documentation-expert
description: Teaches how to dispatch documentation-expert for writing and editing documentation files.
---
<overview>
documentation-expert investigates existing conventions and content, then produces or updates documentation to achieve the stated goal. It reads code to understand what to document — it does not edit code.
</overview>

<what-documentation-expert-does>
Investigates existing documentation, project conventions, and code as reference before writing.
Produces or updates documentation files — markdown, configuration, prompt files, and similar.
Reports what was written or changed and how ambiguities were resolved.
</what-documentation-expert-does>

<template name="delegation-prompt">
Goal: what the documentation should accomplish — audience, purpose, and what it needs to convey

Scope: what files or areas to document, and what to leave alone

Style reference: existing files or conventions to match for tone, structure, and formatting

Constraints: anything the documentation must or must not include

Plan Name: plan name to store findings under, or N/A if not working within a plan session

Report what was written or changed, which files were modified, and how any ambiguities were resolved.
</template>
