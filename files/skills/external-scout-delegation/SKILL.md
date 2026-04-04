---
name: external-scout-delegation
description: Delegate to @external-scout
---

# Delegating to @external-scout

## Tool Schema

```json
{
  "subagent_type": "string",
  "description": "string",
  "prompt": "string",
  "task_id": "string"
}
```

- `subagent_type`: The agent type to use. Use `"external-scout"`.
- `description`: A short 3–5 word label for logging. Not seen by the agent.
- `prompt`: The full task prompt sent to the agent. Must be self-contained.
- `task_id`: Only include when resuming a previous session. Omit otherwise.

Only these four arguments are accepted. Do not add others.

## What @external-scout Does

@external-scout is a research agent. It searches external sources — public references, community resources, and published guides. It has no access to internal materials. It relies on web search, URL reading, and sequential thinking.

@external-scout is good at resolving questions that cannot be answered from internal materials — verifying whether something is supported, finding established approaches, and discovering edge cases others have encountered.

## Before You Delegate: Review for Private Information

Your delegation prompt will be sent to external search tools. Before dispatching, review the prompt and remove or generalize any private details:

- Replace internal names with generic descriptions.
- Replace private terms with their general category.
- Remove any identifiers or internal-only terminology.
- Frame questions in terms of the publicly available subject matter.

Present the delegation prompt to the user for review before dispatching.

## How to Write a Good Delegation Prompt

Your prompt should:
1. Give enough background for @external-scout to understand what it is researching and why.
2. Use general, public terms. Do not include private details.
3. State what you already know so @external-scout does not repeat confirmed findings.
4. Ask @external-scout to search before answering — never from memory alone.
5. Ask @external-scout to read actual sources, not only search summaries.
6. Ask for an uncertainties section — what was searched for but could not be confirmed from sources actually read.

## What to Ask @external-scout to Report

- What it found, with a distinction between verified (read from source), inferred (from summaries), and uncertain.
- How confident it is in each finding.
- What it searched for but could not confirm.
- Any contradictions between sources.

## Examples

Good — general terms, enough context:
> "We are using [a type of tool] to manage [a process]. We need to know whether [tool] supports [capability] in [context]. Search [tool's] documentation and community resources."

Good — states what is already known:
> "We have confirmed [known fact]. What we need to know is whether [unknown] exists in [context]."

Good — asks for source verification:
> "Search for this, but read the actual reference pages rather than relying on search snippets. If you cannot find a primary source, say so."

Bad — leaks private details:
> "Search for how to do [X] for [internal project name]."

Bad — answerable from internal materials:
> "Find out what [thing] our work uses." — @external-scout has no internal access. This should have been answered by @context-scout.

Bad — no context provided:
> "Research [topic]." — too vague to produce useful findings.

Bad — accepts memory as evidence:
> "Tell me about [topic]." — must require actual search and source verification.
