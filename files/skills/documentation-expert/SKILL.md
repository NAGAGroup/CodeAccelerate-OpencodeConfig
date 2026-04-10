---
name: documentation-expert
description: Teaches how to dispatch documentation-expert for writing and editing documentation files.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
</rules>

<prompt template>
prompt="Goal: [what the documentation should accomplish — audience, purpose, what it needs to convey]

Scope: [what files or areas to document, and what to leave alone]

Style reference: [existing files or conventions to match for tone, structure, and formatting]

Constraints: [anything the documentation must or must not include]

Plan Name: [plan name or N/A]

Report what was accomplished and how any ambiguities were resolved."

description="[3-5 word description for the user]"
subagent_type="documentation-expert"
</prompt template>
