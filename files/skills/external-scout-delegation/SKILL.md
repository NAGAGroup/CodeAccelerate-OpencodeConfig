---
name: external-scout-delegation
description: Delegate to @external-scout
---

# Delegating to @external-scout

## Tool Schema

```json
{
  // The type of specialist subagent to spin up.
  // Must be one of the available agent types (see below).
  "subagent_type": "string",

  // Short 3-5 word description of what this task does.
  // Used for labelling/logging — not seen by the subagent.

  "description": "string",
  // The full task prompt sent to the subagent.
  // Should be highly detailed and self-contained — the subagent
  // starts with a fresh context and only knows what you tell it here.
  // Include: what to do, what to return, how to verify its work.

  "prompt": "string",
  // Optional — the slash command that triggered this task, if any.
  // e.g. "/check-file path/to/file.py"

  // Optional — resume a previous subagent session instead of starting fresh.
  // Pass the task_id returned from a prior Task call to continue
  // with that agent's existing message history and tool outputs.
  "task_id": "string"
}
```

Only provide "task_id" if instructed to resume a previous subagent session, omit it entirely from the tool call arguments if not using it.

The four arguments are only those listed above: "description", "prompt", "subagent_type", and optionally "task_id". You must call the tool with this schema, do not attempt to improvise or shortcut.

## What @external-scout is

@external-scout is a research subagent that searches external
sources — documentation, community resources, technical
references, forums, and published guides. It cannot access
the project. It has access to web search tools, URL fetching,
and sequential thinking.

## What @external-scout is good at

@external-scout excels at resolving uncertainties that can't
be answered from the project alone — verifying whether a tool
supports a feature, finding best practices for an approach,
understanding how a technology works in practice, and
discovering gotchas or edge cases that others have encountered.

@external-scout is not good at understanding project-specific
context. It has no access to the project and relies entirely
on what you tell it in the delegation prompt.

## How to delegate effectively

Your delegation prompt should:
- Provide enough context about the situation for @external-scout
  to understand what it's researching and why, without including
  proprietary details
- Frame questions in general, public terms — ask about
  technologies and practices, not about your specific project
- Describe what you already know so @external-scout doesn't
  waste time confirming things you've already established
- Request that @external-scout search before answering — it
  should never answer from training data alone
- Request that @external-scout fetch and read actual sources
  rather than relying on search snippets
- Require an uncertainties section — what it searched for but
  couldn't verify from sources it actually read

## IP safety

Before dispatching @external-scout, you must present your
delegation prompt to the user for review via the `question`
tool. The prompt will be used in external web searches.
Generalize any project-specific details:

- Replace internal project names with generic descriptions
- Replace proprietary tool names with their public category
- Remove any identifiers, code names, or internal terminology
- Frame questions about your situation in terms of the
  publicly available technologies involved

## Output to request

@external-scout should report:

- What it found, with distinction between information from
  sources it actually read versus search snippet summaries
- How confident it is in each finding — did it verify from
  a primary source, or is it relying on secondary references?
- What it searched for but couldn't find reliable answers to
- Any contradictions between sources

## Examples

✓ Good delegation: general terminology, enough context
  "We're using a package manager to manage toolchains for
  a compiled language. We need to know whether a specific
  meta-package provides different compiler backends when
  targeting a new platform. Search the package manager's
  documentation and community forums."

✓ Good delegation: states what's already known
  "We've confirmed the build system is cross-platform and
  uses standard install directories. What we need to know
  is whether the coverage tooling has equivalents on the
  target platform in the same package ecosystem."

✓ Good delegation: asks for source verification
  "Search for this, but read the actual documentation pages
  rather than relying on search result snippets. If you
  can't find a primary source, say so."

✗ Bad delegation: leaks project internals
  "Search for how to add platform support to the
  MyCompany-InternalProject repository."

✗ Bad delegation: answerable from the project itself
  "Find out what dependencies our project uses." —
  @external-scout has no project access, and this should
  have been answered by @context-scout

✗ Bad delegation: no context provided
  "Research platform support for compiled language
  projects." — too vague to produce actionable findings

✗ Bad delegation: accepts training data as evidence
  "Tell me about this tool's packages." — should require
  actual search and source verification
