---
name: agent-delegation-expert
description: "Assigns the right agent and model tier to each subtask based on task complexity, type, and skill requirements. Invoke during Phase 5 of /plan after the session plan is drafted to apply routing rules and populate the Delegation section of each subtask file."
---

# Agent Delegation Expert

Assigns the right agent and model tier to each subtask based on task complexity, type, and skill requirements.

## When to Invoke

Load during Phase 5 of `/plan`, after the session plan is drafted. Apply the rules below to assign agent and model to each subtask, then write those assignments into the `## Delegation` section of each `subtask-NN-{name}.md` file.

## Agent Routing Rules

- **@CodeWriter** — clear implementation specs with known patterns
- **@DocWriter** — documentation, comments, READMEs
- **@explorer** — pure codebase search/exploration
- **@Architect** — only if user opted in AND the problem genuinely requires deep reasoning
- **HeadWrench directly** — git ops, build/test/CI, small tightly-coupled tasks. Never assign build or test steps to CodeWriter.
- **CUSTOM → @SubagentBuilder** — when no default agent fits; flag with reason

## Model Tier Rules

- **fast (haiku)** — unambiguous specs, clear inputs/outputs
- **standard (sonnet)** — requires judgment, interpretation, or multiple interacting systems
- **deep (opus)** — genuinely hard reasoning, only if Architect is enabled

## Decision Table

| Situation | Agent | Tier |
|-----------|-------|------|
| Clear spec, known patterns | CodeWriter | fast |
| Multiple interacting systems | CodeWriter | standard |
| Critical output for other subtasks | CodeWriter | standard (min) |
| Pure exploration/search | explorer | fast |
| Infrastructure, git, CI, build, test | HeadWrench | — |
| Genuinely hard reasoning | Architect | deep |

## Custom Agents — When and How

When no default agent fits a subtask:

1. Identify what the subtask needs to do and why existing agents don't fit
2. Brief `@SubagentBuilder` with: the agent's **purpose**, the **behavior** you need, and any **constraints** (e.g. read-only, no bash, specific tool access)
3. Do NOT write the agent spec or frontmatter yourself — SubagentBuilder has the specialized knowledge
4. SubagentBuilder will create the agent file in `.opencode/sessions/{name}/agents/` for use in the session

## Output Format

Write each subtask's delegation into the `## Delegation` section of its `subtask-NN-{name}.md` file:

```
## Delegation
**Agent:** @AgentName
**Model:** tier (model-id) — brief reason
```

Assignments go in subtask files **only** — never in `spec.json` or `index.md`.
