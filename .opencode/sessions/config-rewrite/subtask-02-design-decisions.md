# Subtask 02 — Design Decisions: DAG Node Schema

## Delegation
**Agent:** HeadWrench direct (collaborative with user — no subagent)
**Model:** anthropic/claude-sonnet-4-6

---

## Objective
Lock down the DAG node schema collaboratively with the user. This is the foundational data contract for the entire plugin-driven DAG execution system. Everything downstream (planning session JSONs, plugin implementation, execution mechanics) depends on getting this right.

> This subtask is **collaborative**. HeadWrench drives the design conversation; the user shapes and approves. Do NOT pre-solve. Work through it together.

---

## Context
The architecture approved at Gate 1:
- Slash command fires → loads plan DAG JSON → sends first prompt to agent
- Agent executes step → calls `next_step` built-in tool when done
- Plugin advances DAG state → injects next prompt via `ctx.client.session.prompt({ noReply: true })`
- `chat.message` hook enforces plan-first invariant
- `experimental.chat.system.transform` injects current plan state into every agent message

The `next_step` tool is registered by the plugin (see `~/.config/opencode/plugins/mermaid-tool.ts` for the built-in tool registration pattern).

---

## Todolist

- [ ] [⏸ PAUSE] Present draft DAG node schema to user — discuss and refine together
  - What fields does each DAG node need? (step_id, description, prompt, expected_output_schema, next_step_id, branching_conditions, agent_hint, pause_for_user, ...)
  - What does branching look like? (conditional next_step? parallel nodes?)
  - What does a "planning session DAG" look like vs an "execution DAG"?
  - What's the minimum viable schema?
- [ ] [⏸ PAUSE] Lock down the node schema — user approves final version
- [ ] Write the approved schema to `notes/dag-node-schema.md`
- [ ] [🚫 GATE] User confirms schema is ready to build on before subtask 03 begins

---

## Scope
- Define: DAG node fields and types
- Define: Branching/conditional logic representation
- Define: How agent prompts are embedded in nodes vs referenced
- Define: How `next_step` output maps to DAG state
- Out of scope: specific plan JSONs for each session type (subtasks 03–05)

## Constraints
- Schema must be implementable as a TypeScript interface in the plugin
- Must support both planning sessions AND execution sessions (same node format)
- `next_step` tool receives agent output; schema must define what that output looks like per node
- Keep it minimal — resist over-engineering at schema stage

## Output
- `notes/dag-node-schema.md` — approved DAG node schema with field definitions and example node

---

*Checkpoint: `wip: subtask 02 complete — dag node schema`*
