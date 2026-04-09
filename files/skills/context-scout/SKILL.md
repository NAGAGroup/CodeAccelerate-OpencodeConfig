---
name: context-scout
description: Teaches how to dispatch context-scout for wide-shallow project exploration and landscape overviews.
---
<overview>
context-scout surveys a project broadly using semantic search and returns findings as clear prose. It covers multiple aspects in one pass — structure, components, relationships, conventions — and includes an explicit unknowns section.
</overview>

<what-context-scout-does>
Searches the codebase using semantic queries to map what exists and how parts relate.
Returns prose findings — not file lists or bullet inventories.
Includes an explicit unknowns section covering what could not be determined.
Makes no changes — read only.
</what-context-scout-does>

<example name="delegation">
Goal: Understand the overall structure of this project — how it is organized, what the major components are, how they relate to each other, and what conventions the codebase follows.

Areas to survey: top-level organization, core modules and their responsibilities, how modules interact, testing and configuration conventions.

Why this matters: We are about to add a significant new capability and need to understand where it fits, what conventions to follow, and what existing patterns to build on.

Plan Name: project-landscape

Return findings as prose. Include an explicit unknowns section covering what was investigated but could not be determined, what remains ambiguous, and what follow-up investigation would resolve it.
</example>
