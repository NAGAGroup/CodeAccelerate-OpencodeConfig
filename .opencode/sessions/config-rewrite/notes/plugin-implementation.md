# Planning Enforcement Plugin — Implementation Notes

## Architecture

Single TypeScript file: `opencode/plugins/planning-enforcement.ts`
Auto-loaded by opencode from the `opencode/plugins/` directory — no build step, no npm package.

## 6 Registered Tools

- `plan_generic()` — reads `opencode/planning/plan-generic/plan.json`, creates dag-state, injects entry prompt
- `plan_debug()` — same for `opencode/planning/plan-debug/plan.json`
- `plan_collaborative()` — same for `opencode/planning/plan-collaborative/plan.json`
- `activate_plan({ plan_name })` — reads `.opencode/session-plans/<name>/plan.json`, creates dag-state, injects entry prompt
- `next_step({ next? })` — reads dag-state, decrements remaining_visits if applicable, resolves next node, updates dag-state, injects next prompt
- `close_session()` — removes dag-state file

## Key Design Decisions

**plan_path stored in dag-state**: `DagSessionState` includes `plan_path` (absolute path to plan.json). This means `next_step` never has to search for the plan file — it always reads from the same path. Supports both global planning DAGs and session-local execution plans with no special-casing.

**No hooks**: Plugin is tools-only. Plan-first invariant enforced via agent behavior (HW system prompt), not plugin hooks.

**Self-editing plans**: Agent can freely rewrite plan.json in-place during collaborative/debug sessions. `next_step` re-reads from `state.plan_path` on every call, so changes are picked up automatically.

**Synthetic prompt injection**: All `session.prompt` calls use `{ noReply: true, parts: [{ type: "text", text: "...", synthetic: true }] }`. The `synthetic: true` flag hides injected prompts from the UI.

**remaining_visits**: Plugin decrements in-place on the plan.json node when a node with `remaining_visits` is exited. On reaching 0, dag-state is set to `"failed"` and no further advancement occurs.

## DAG JSON Files

Located at `opencode/planning/<type>/plan.json`. Prompt files referenced by relative path from worktree root.

## Slash Commands

`opencode/commands/plan-generic.md`, `plan-debug.md`, `plan-collaborative.md`, `activate-plan.md`. Each immediately calls the corresponding tool — no multi-step logic in the command itself.

## Dummy Test Plan

`.opencode/session-plans/dummy-plan/` — 3-node plan (step-one → review gate → done) for manual plugin testing. Verified working.
