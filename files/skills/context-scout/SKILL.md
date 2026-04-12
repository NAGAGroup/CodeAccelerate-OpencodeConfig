---
name: context-scout
description: Teaches how to dispatch context-scout for wide-shallow project exploration and landscape overviews.
---
<rules>
Your prompt must match the template, filling in only the placeholder content and including the rest verbatim.
Only dispatch context-scout to understand what already exists in the project — not for ideation, best-practice research, or library recommendations.
Never provide specific file paths in areas to survey — use concepts instead.
</rules>

<prompt template>
prompt="Goal: [Understand the overall structure of this project — how it is organized, what the major components are, how they relate to each other, and what conventions the codebase follows.]

Areas to survey: [top-level organization, core modules and their responsibilities, how modules interact, testing and configuration conventions.]

Why this matters: [We are about to add a significant new capability and need to understand where it fits, what conventions to follow, and what existing patterns to build on.]

Plan Name: [descriptive-plan-name]

Return findings as prose. Include an explicit unknowns section covering what was investigated but could not be determined, what remains ambiguous, and what follow-up investigation would resolve it.

Run multiple searches — one per area to understand. This guarantees a broad, comprehensive survey instead of a narrow deep dive that misses important context."

description="[3-5 word description for the user]"
subagent_type="context-scout"
</prompt template>
