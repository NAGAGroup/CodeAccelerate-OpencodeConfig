# Subtask 06 — Implement: Planning Enforcement Plugin

## Delegation
**Agent:** HeadWrench direct
**Model:** anthropic/claude-sonnet-4-6

---

## Objective
Implement the planning enforcement plugin and all planning session DAG JSON files designed in subtasks 02–05. User tests manually before reporting back.

---

## Context
- DAG node schema: `notes/dag-node-schema.md`
- /plan-generic design: `notes/plan-generic-design.md`
- /plan-debug design: `notes/plan-debug-design.md`
- /plan-collaborative design: `notes/plan-collaborative-design.md`
- Built-in tool registration pattern: `~/.config/opencode/plugins/mermaid-tool.ts`

**Architecture:**
- Plugin registers `next_step` built-in tool
- `chat.message` hook enforces plan-first invariant
- `experimental.chat.system.transform` injects current plan state
- `session.idle` (optional fallback) for step completion detection

---

## Todolist

- [ ] Scaffold TypeScript npm package at `plugins/planning-enforcement/`
  - `package.json`, `tsconfig.json`, `src/index.ts`
  - Dependencies: `@opencode-ai/plugin`
- [ ] Implement `next_step` built-in tool
  - Reads DAG state from disk (`.opencode/dag-state.json`)
  - Advances to next node
  - Injects next node's prompt via `ctx.client.session.prompt({ noReply: true })`
  - Returns step completion confirmation to agent
- [ ] Implement `chat.message` hook — plan-first invariant
  - Check for valid spec.json + plan.json (or dag-state.json)
  - Bypass: message starts with `/plan-`, agent is `build`, session in planning phase
  - Throw error with actionable message if no active plan
- [ ] Implement `experimental.chat.system.transform` — plan state injection
  - Read current DAG state
  - Inject: session type, current step name, success criteria, step number / total
- [ ] Write planning session DAG JSON files (from notes/)
  - `plugins/planning-enforcement/dags/plan-generic.json`
  - `plugins/planning-enforcement/dags/plan-debug.json`
  - `plugins/planning-enforcement/dags/plan-collaborative.json`
- [ ] Run `npm run build` — must compile without errors
- [ ] [⏸ PAUSE] User tests manually — reports back before proceeding

---

## Scope
- Plugin TypeScript source + build config
- DAG JSON files for the 3 session types designed in subtasks 02–05
- dag-state.json read/write logic
- Out of scope: opencode.json, headwrench.md, slash commands, subagents (those are subtask 07–08)

## Constraints
- Must match built-in tool registration pattern from `mermaid-tool.ts`
- Plugin must compile — `npm run build` must pass
- Bypass conditions must be precise — do NOT block /plan-* commands or the build agent
- dag-state.json path: `.opencode/dag-state.json` (project-local, not global)

## Verification
- `npm run build` passes with no TypeScript errors
- User manually invokes /plan-generic (or similar) and confirms the DAG-driven conversation fires

## Output
- `plugins/planning-enforcement/` — complete TypeScript plugin package
- `plugins/planning-enforcement/dags/*.json` — planning DAG files

---

*Checkpoint: `wip: subtask 06 complete — planning enforcement plugin`*
