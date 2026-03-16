---
description: "Research-first planning — orient on a topic, dispatch @DeepResearcher, review findings, then decide whether to build. Use this instead of /plan when understanding comes before implementation."
agent: headwrench
---

$ARGUMENTS

## How to Run /plan-deep-research

Follow the protocol in `~/.config/opencode/protocols/plan-deep-research.md`.

## Purpose

Invoke the deep research planning protocol when the primary goal is *understanding* a topic, technology, API, or approach — before deciding how or whether to build something.

## When to Use /plan-deep-research vs /plan

| Use `/plan-deep-research` when… | Use `/plan` when… |
|----------------------------------|-------------------|
| You want to evaluate options before committing to an approach | You already know what to build |
| You need to understand an API, library, or technology before writing code | You have a feature, fix, or refactor ready to execute |
| The decision of *what* to build depends on research findings | The scope and approach are already clear |
| The output is a research brief, not a list of subtasks | The output is a subtask plan ready to execute |

## What HeadWrench Does

1. **Runs plan-init orientation** — reads the project layout and relevant context
2. **Asks 1–3 scoping questions** — topic boundary, depth vs. breadth, decision criteria
3. **Dispatches `@DeepResearcher`** — with a prompt scoped to the user's research goal
4. **Surfaces findings at a gate** — presents a summary and asks how to proceed
5. **Loops or transitions** — goes deeper on sub-topics, pivots to a new angle, or transitions to a `/plan` session if the user is ready to build

The session ends with a `research-brief.md` notes file in `.opencode/sessions/{name}/notes/`. If the user chooses to transition to a build session, they run `/plan` next and reference the research brief as context.

## Example

```
/plan-deep-research I want to understand the trade-offs between tRPC and REST+OpenAPI for our API layer before we commit to a direction.
```

HeadWrench will orient on the project, ask a few scoping questions (e.g., "are you evaluating type safety, bundle size, or DX?"), dispatch `@DeepResearcher`, and surface a findings brief for your review. You decide whether to go deeper, pivot, or kick off a `/plan` session to start building.
