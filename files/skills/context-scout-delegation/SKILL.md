---
name: context-scout-delegation
description: Delegate to @context-scout
---

# Delegating to @context-scout

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

## The Audience of the Delegation Prompt

The delegation prompt is to @context-scout. Frame the
prompt as instructions to the agent, not about the agent.

## What @context-scout is

@context-scout is a read-only subagent that explores a
problem space and reports back in prose. It cannot modify
anything. It has access to reading tools, search tools,
and sequential thinking.

## What @context-scout is good at

@context-scout excels at building broad understanding —
surveying a landscape, mapping relationships between parts,
identifying what tools and systems are in play, and
surfacing what it couldn't determine.

@context-scout is not good at deep targeted analysis of a
single area. That's what @context-insurgent does.

## How to delegate effectively

Your delegation prompt should:
- State the user's goal so @context-scout understands why
  it's investigating
- Describe what areas to explore in terms of concepts and
  relationships, letting @context-scout decide its own
  investigation path
- Request prose output, as one practitioner briefing another
- Require an uncertainties section — @context-scout must
  report what it couldn't determine, not just what it found
- Focus the effort on what matters for the user's goal
  rather than asking it to understand everything

## Output to request

@context-scout should cover these areas in its briefing:

- Current state and relevant context
- Major components and how they relate
- Tools, systems, and methodologies involved — their roles
  and interactions, not just names
- What works now and what doesn't
- Uncertainties — what was investigated but couldn't be
  fully determined

The uncertainties section is the most valuable part. It
tells you what needs external research or deeper
investigation.

## Examples

✓ Good delegation: describes what to explore conceptually
  "The user wants to add platform support. Explore how the
  project currently handles platform-specific concerns —
  what manages toolchains, what assumptions exist about the
  target environment, and what would need to change."

✓ Good delegation: scoped to what matters
  "The user wants to improve test coverage. Focus on
  understanding the current testing approach — what's
  tested, what framework is used, how tests are run, and
  where gaps might exist."

✓ Good delegation: requests genuine uncertainties
  "Include anything you investigated but couldn't fully
  verify. Surface-level evidence without confirmed
  understanding is more useful than false confidence."

✗ Bad delegation: prescribes where to look
  "Read the configuration files in the root directory and
  the build scripts in the scripts folder."

✗ Bad delegation: prescribes what to find
  "Confirm that the project uses framework X and identify
  which version."

✗ Bad delegation: asks for structured data
  "Return a table of all dependencies with their versions
  and a file tree of the project structure."

✗ Bad delegation: no uncertainties requested
  "Summarize the project structure and tooling." — produces
  a confident inventory that hides gaps in understanding
