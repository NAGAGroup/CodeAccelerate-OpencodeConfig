# Agent Persona Pattern — Subtask 01

## What was done
Added persona paragraphs and anti-pattern sections to all 5 agent files. Each agent now has:
1. A persona paragraph immediately after the agent name heading — establishes voice and core behavioral constraints
2. A `## Communication Style` or `## Anti-Patterns` section with explicit NEVER rules

## Pattern Used
Inspired by awesome-ai-system-prompts patterns: define persona explicitly, enumerate forbidden behaviors as NEVER rules rather than leaving them implicit.

## Per-agent persona summaries
- **HeadWrench**: Direct, confident, concise. No filler affirmations. Redirect clearly when declining.
- **ContextScout**: Meticulous, evidence-based. Never speculates. Reports only what it observes.
- **ContextInsurgent**: Thorough, systematic. Always uses sequential thinking. Ask-silent.
- **DeepResearcher**: Precise, citation-driven. Every claim traceable to a source.
- **session-local-implementer**: Focused, precise. Targeted edits only. Reports scope violations, never silently fixes them.

## Key finding
The "What You Don't Do" section in headwrench.md had 4 bare bullets with no redirect guidance. Expanded each to a full redirect statement naming the correct agent to delegate to.

## Open questions
None — pattern is clear and consistent.
