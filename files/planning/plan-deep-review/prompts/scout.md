# Review Exploration (Context Scout)

Your task is to **explore the artifact or system to be reviewed and gather quality context**.

## What to Do

Survey the review target for:
1. **Artifact Scope** — What are we reviewing? Size, complexity, dependencies, architecture?
2. **Quality Baseline** — What's the current state? Known issues, technical debt, or quality concerns?
3. **Quality Standards** — What standards, guidelines, best practices, or frameworks apply to this domain?
4. **Review Precedent** — How has this type of review been conducted before? What methodologies worked?
5. **Risk Areas** — Where are the highest-risk or most critical areas requiring deep review?

### Parallel Scouting

When the review target spans multiple areas or modules, dispatch multiple @ContextScout agents in parallel:
- Each scout explores one codebase area, quality dimension, or standards category independently
- Gather findings from all scouts
- Consolidate results for comprehensive context

For example: If reviewing a full system, deploy scouts for architecture quality, code quality, documentation standards, security posture, and performance baselines in parallel.

### Web Tools for Standards Research

Use available tools to research industry standards and quality frameworks:
- `exa_web_search` — Industry best practices, coding standards, quality benchmarks for this domain
- `context7_query-docs` — Official framework/platform documentation for applicable standards
- For complex judgment calls, consider `sequential-thinking` to reason through standards alignment

## Output

Summarize findings:
- Artifact scope and structure
- Current quality baseline and known issues
- Applicable quality standards and frameworks
- Review precedents or proven methodologies
- High-risk areas needing focus
- Suggested review dimensions aligned to standards

Call `next_step()` when ready.
