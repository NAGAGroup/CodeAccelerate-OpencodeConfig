# plan-deep-research — Protocol and Command Created

## What was created

### `opencode/protocols/plan-deep-research.md`
New modular plan protocol for research-first planning sessions. Follows the same conventions as other plan-*.md files (uses plan-init.md as bookend, references plan-end.md for transition). Core flow:
1. plan-init orientation (skip session type selection)
2. 1–3 scoping Q&A questions (topic boundary, depth/breadth, decision criteria)
3. @DeepResearcher dispatch with scoped prompt
4. Gate: user reviews findings (4 options: go deeper / pivot / transition to planning / done)
5. Loop or transition based on user choice
6. Write research-brief.md to session notes; run plan-end.md only if transitioning to build

### `opencode/commands/plan-deep-research.md`
New slash command with YAML frontmatter (`description`, `agent: headwrench`), `$ARGUMENTS`, `## How to Run`, `## Purpose`, `## When to Use` comparison table, `## What HeadWrench Does`, and `## Example`.

## Key design decisions
- No subtask decomposition during research — subtasks belong to a follow-on `/plan` session
- Gate is mandatory — user must review findings before any transition
- Research loop depth is uncapped — user controls how many rounds
- "Transition to planning" tells user to run `/plan` next, referencing the research brief as context
