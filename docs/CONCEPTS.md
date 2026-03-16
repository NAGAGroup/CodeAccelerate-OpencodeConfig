# OpenCode Concepts — The Mental Model

This document explains *what the system is and why it works the way it does*. It's for new users who want to understand the design philosophy before diving into usage. For how to use the commands, see [USAGE.md](USAGE.md). For a complete inventory of components, see [../FEATURES.md](../FEATURES.md).

---

## The Plan Is the Product

Most agent configurations try to build a universal execution engine: agent hierarchies, routing logic, pattern enforcement frameworks. You spend more time configuring the engine than doing actual work.

This config flips that. The system itself is dead simple:

1. You run `/plan`, which triggers Q&A
2. Q&A produces a session plan — a set of markdown files in `.opencode/sessions/{name}/`
3. Agents read and follow the plan
4. When you run `/continue`, the session executes one subtask at a time
5. Between subtasks, a checkpoint protocol runs (commit, update state, write notes)
6. When done, you close the session with a final commit

The complexity lives in each session plan — designed fresh for that specific problem, then discarded when done. The mental model is simple: **there are files in a directory, and agents read them.**

Everything is inspectable and editable. Session plans are markdown. Protocols are markdown. Agent definitions are markdown. If something isn't working mid-session, you edit the file. No plugin API to understand, no routing heuristic to debug. This transparency is by design.

---

## HeadWrench — The Orchestrator

HeadWrench is your primary interface and the session orchestrator. When you open OpenCode, HeadWrench is the default agent.

HeadWrench's responsibilities:

- **Planning**: Runs `/plan` — triggers Q&A, reads ContextScout's findings, generates a session plan, assigns agents to subtasks
- **Delegation**: For each subtask, reads its specification and invokes the right subagent with a fully-specified task prompt
- **Execution**: Runs `/continue` to execute the next pending subtask in a session
- **Checkpointing**: Between subtasks, ensures the checkpoint protocol runs (WIP commit, state updates, notes, inbox entries, gate checks)
- **Contextualization**: Maintains awareness of the session plan, current subtask, accumulated notes, and persistent project context

HeadWrench does **not**:

- Do deep codebase exploration (delegates to `context-scout` or `context-insurgent`)
- Research topics or fetch external documentation (delegates to `deep-researcher`)
- Write implementation code itself (delegates to session-local agents created via the `agent-writer` skill)

---

## Subagents — Specialized Workers

Subagents are isolated, single-purpose workers. Each has a focused role. HeadWrench gives each subagent a fully-specified task prompt; the subagent completes the task and reports back. Subagents have no awareness of the broader session — they receive work, do it, and return results.

There are 3 subagents:

1. **`context-scout`** — Reads the codebase and prior session notes before planning begins. Builds situational awareness so HeadWrench can ask better Q&A during `/plan`. Read-only, fast.

2. **`context-insurgent`** — Deep codebase exploration specialist with sequential thinking capability. Used for complex multi-file investigations that require structured, multi-step reasoning.

3. **`deep-researcher`** — Handles web searches, documentation lookup, code examples, and external knowledge fetching. When you need to research a tool, library, or pattern, this agent does the digging.

---

## Sessions — The Unit of Work

A session is a named, bounded piece of work with a goal and a set of subtasks. Sessions are the primary unit of organization.

**Session structure:**

Sessions live in `.opencode/sessions/{name}/` as plain markdown and JSON files. Key files:

- `index.md` — Human-readable plan: goal, phases, subtasks, who's doing what, success criteria
- `spec.json` — Machine-readable state: current subtask index, completion status, task definitions, agent assignments
- `subtask-NN-{name}.md` — One file per subtask. Only the current subtask is loaded and shown to agents at runtime
- `notes/` — Session-specific findings, decisions, and observations (created and updated during checkpoints)

**Session lifecycle:**

1. You run `/plan` → Q&A runs → ContextScout provides background → a session is created with an index.md and spec.json
2. You run `/continue` → the current subtask (from spec.json) is loaded and executed by the assigned agent
3. After each subtask completes, the checkpoint protocol runs: WIP commit, index.md and spec.json updates, notes written, inbox entries created, gate checks
4. Repeat `/continue` for each subtask until the session is complete
5. Final commit closes the session

Sessions accumulate observations in `notes/` and feed project-level patterns to `.opencode/inbox/` so future sessions can learn from what worked.

---

## Skills — Loadable Knowledge Packages

Skills are markdown files that encode complex rules or decision frameworks. HeadWrench loads skills on demand when needed — they are not auto-loaded.

Currently, there are two skills:

- **`agent-delegation-expert`** — Loaded during `/plan` (Phase 5) to assign the right agent and model tier to each subtask. Provides routing rules and guidance on when to use fast models (haiku) vs. standard (sonnet) vs. deep reasoning (opus).

- **`agent-writer`** — Creates session-local agent files during plan finalization. Loaded on demand when a subtask requires a custom agent that doesn't exist yet.

Think of skills as "expertise HeadWrench reaches for when it needs it" — not hardcoded behavior, but on-demand guidance living in markdown files. Skills are loaded on demand, not auto-loaded.

---

## Commands — Entry Points

The 12 slash commands are your entry points into the system. High-level overview:

- **`/plan`** — Start a new session. Triggers Q&A, ContextScout analysis, and plan generation. Use when you have a new piece of work to organize.

- **`/plan-deep-research`** — Research-first planning session — orients, dispatches DeepResearcher, gates on findings. Use when understanding comes before implementation and the decision of what to build depends on research.

- **`/continue`** — Resume the current session's next subtask. Reads the session plan, loads the next subtask, and executes it. Use repeatedly to work through a session.

- **`/amend`** — Apply a quick in-session fix without starting a new plan. Use when you need to adjust something mid-session but don't want to create a new session.

- **`/inbox`** — Review accumulated project-level observations in `.opencode/inbox/`. Patterns and lessons from past sessions live here.

- **`/context-add`** — Add a file to `.opencode/context/` persistent context. These files are read by ContextScout on every planning session.

- **`/context-audit`** — Audit permanent context files for staleness. Identifies context files that may be out of date and should be refreshed or removed.

- **`/context-list`** — List files currently in `.opencode/context/`.

- **`/context-remove`** — Remove a file from `.opencode/context/`.

- **`/quick-plan`** — Lightweight planning for small, well-scoped tasks. Faster than `/plan` when full Q&A isn't needed.

- **`/activate-session`** — Set a session plan as active for the current OpenCode session. HeadWrench will inject the session's state into its context on every message.

- **`/deactivate-session`** — Unset the active session plan for the current OpenCode session.

- **`/session-status`** — Display the current session state and subtask progress. Quick overview of where you are in the active session.

For detailed usage of each command, see [USAGE.md](USAGE.md).

---

## The Leverage Points

Where to focus if you want to tune the system:

1. **The Q&A prompts in `/plan`** and the **session plan output format** are high-leverage. Small improvements to how questions are asked or how plans are structured compound across every session.

2. **ContextScout feeds persistent context** (files in `.opencode/context/`) into every planning session automatically. Keep notes there on what works and what doesn't. This is the primary way the system learns.

3. **If something isn't working, the files are right there.** Session plans are markdown. Protocols are markdown. If a subtask assignment is wrong, edit it. If a gate is in the wrong place, move it. No black-box heuristics to debug.

4. **The checkpoint protocol** ensures consistency between subtasks. If checkpoints are running too often or not often enough, adjust them.

---

## Next Steps

- **[USAGE.md](USAGE.md)** — How to use `/plan`, `/continue`, `/amend`, `/inbox`, context commands, and session activation commands
- **[../FEATURES.md](../FEATURES.md)** — Complete component inventory: all agents, commands, protocols, skills, plugins, and MCPs
