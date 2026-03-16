# Subtask 09 — create-deep-research-plan

## Objective
Create the `plan-deep-research` modular protocol and its corresponding slash command, following the same conventions as the other modular plan-*.md files.

## TL;DR
`/plan-deep-research` is a semantically distinct planning mode: the user is kicking off a research-focused session using DeepResearcher, not a build or fix session. It needs both a protocol file (for HeadWrench to follow) and a command file (for user discoverability).

## Scope
### Write
- `opencode/protocols/plan-deep-research.md` — new modular plan protocol
- `opencode/commands/plan-deep-research.md` — new slash command

### Read
- `opencode/protocols/plan-init.md` (format reference)
- `opencode/protocols/plan-generic.md` (format reference)
- `opencode/protocols/plan-end.md` (format reference)
- `opencode/commands/quick-plan.md` (command format reference)
- `opencode/protocols/` directory listing (verify naming conventions)
- `opencode/commands/` directory listing (verify naming conventions)

### Excluded
- All other files

## Constraints
- `plan-deep-research.md` must be modular: it calls plan-init.md steps at the start and plan-end.md steps at the end, with its own unique middle
- The protocol's core flow should: dispatch @DeepResearcher for the research task, gate for user review of findings, then hand off to HeadWrench for next-step planning based on results
- The command file should follow the exact same structure as other command files (purpose, when to use, example)
- Do NOT create any session files or modify any existing files

## What the Protocol Should Define
- **When to invoke:** User wants to research a topic, technology, API, or approach before planning/building
- **What makes it distinct:** DeepResearcher is the primary agent; output is a research brief/summary, not a subtask plan
- **Core flow:**
  1. HeadWrench runs plan-init steps (orient, Q&A to understand research goal)
  2. HW dispatches @DeepResearcher with a scoped research prompt
  3. Gate: surface findings to user for review
  4. Based on user feedback: either loop for more research or proceed to plan-end
- **Output:** a session notes file with research findings; optionally a new session plan if the user wants to act on the findings

## Todolist
- [ ] Read plan-init.md, plan-generic.md, plan-end.md for format conventions
- [ ] Read quick-plan.md for command file format
- [ ] Write opencode/protocols/plan-deep-research.md
- [ ] Write opencode/commands/plan-deep-research.md

## Delegation
**Agent:** @session-local-implementer
**Reason:** Creating two new files — a protocol and a command — requires file writing and should follow established format conventions read from existing files.
