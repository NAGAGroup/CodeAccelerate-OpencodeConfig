# AGENTS.md

This is an OpenCode framework configuration, deployed to users via OCX. Users install it as a configuration package that adds agents, skills, commands, and a planning plugin to their OpenCode setup.

## How to Orient

Start with `docs/spec/00-system-overview.md`. That document links to the eight spec files that define the system authoritatively. Read the spec before touching code — the spec is the source of truth. If the code disagrees with the spec, the spec wins. Update the spec first, then update the code. Keep the spec current after any changes.

`registry.jsonc` defines the deployed artifacts. Every file under `files/` must have a corresponding entry in `registry.jsonc`. Keep them in sync when files are created or deleted.

## Core Ideas

These are stable design commitments. The spec handles the details.

**Planning is the core feature.** Planning decomposes the problem through investigation and stores findings in a semantic notes system. Those notes are consumed by the executing agent — planning and execution are separate phases connected by notes, not by shared context.

**Planning decomposes the plan, not the solution.** The plan is a shape of work types — phases, decision gates, verification steps. It is not a script of what to edit or read. The planner does not solve the user's request or do task decomposition into specific actions.

**Plans are built from a composable component library.** Each component pairs a static prompt with a required tool call sequence (enforcement sequence). The prompt instructs the executing agent on what type of work to do. The enforcement sequence ensures structural invariants are met — that certain tool calls happen, in order, before advancing.

**Component prompts are static.** Every node of the same component type uses the identical prompt. The planner's intent lives in the DAG's shape and the rationale stored to semantic notes — never in per-node prompt customization.

**The DAG constrains actions, not reasoning.** Tool access, call ordering, and verification gates are enforced. What the agent investigates, discovers, and decides is unconstrained. Component prompts instruct agents to make goal-oriented decisions, not decisions about specific files or specific edits.

**Subagents are competent specialists.** They are dispatched with goal-oriented prompts and figure out the how themselves. Scouting subagents help the primary agent make informed decisions by returning findings, not by taking action.

**Memory is forbidden.** Agents regather context fresh every session via the semantic notes system. Nothing is assumed to persist in the conversation window between sessions.

## Project Structure

```
files/                        Source artifacts deployed via OCX
  agents/                     Agent definition files (YAML frontmatter + system prompt)
  skills/                     Skill files (methodology documents loaded on demand)
  commands/                   Slash command definitions
  profiles/                   OpenCode profile configurations
  plugins/
    planning-enforcement.ts   Plugin source — the DAG enforcement engine
    planning-enforcement.js   Compiled output (never edit directly — run bun run build)
    *.ts                      Supporting TypeScript modules
  planning/
    plan-session/
      plan.jsonl              The planning DAG template (14-node fixed workflow)
      prompts/                Per-node prompt files for the planning DAG
      node-library/           Execution DAG component library

docs/spec/
  00-system-overview.md       Entry point — read this first, it links to everything else

registry.jsonc                Deployed artifact manifest — keep in sync with files/
```

## Build

Run `bun run build` after any TypeScript changes. This compiles the plugin source and packages all components via OCX. Never edit `.js` files directly.

## Working Rules

- `.opencode/` is off-limits — never read or write it. This rule extends beyond this repo: any configuration artifact produced here (agents, skills, commands, prompts) must never instruct agents running in users' projects to read or write `.opencode/` directly. That directory belongs to the plugin. Any information that needs to come out of it (DAG contents, session state, prompt files) is surfaced through plugin tools — `show_dag`, `show_compact_dag`, `init_dag`, `add_node`, and so on. If a workflow requires access to something in `.opencode/`, the answer is a new plugin tool, not a direct path reference in a prompt or agent file.
- Never read CHANGELOG files — they contain stale history that pollutes understanding.
- The spec is the design authority. Code is the implementation.
