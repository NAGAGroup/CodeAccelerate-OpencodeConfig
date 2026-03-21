<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session: plan-deep-review-impl

## Goal

Build the `/plan-deep-review` planning workflow — a complete new planning DAG that accepts a codebase scope (full repo or specific path) plus optional review flags (`--bugs`, `--quality`, `--arch`, etc.), dispatches agents to conduct an in-depth code review of that scope, presents findings to the user at a gate, and produces a dedicated fix session plan (plan.json + subtask prompts) as output.

## Output Artifacts

All files are written into the repository at:

- `opencode/commands/plan-deep-review.md` — slash command registration
- `opencode/planning/plan-deep-review/plan.json` — 9-node planning DAG
- `opencode/planning/plan-deep-review/prompts/` — 9 node prompt files:
  - `session-overview.md`
  - `load-guidelines.md`
  - `review-intake.md`
  - `clarify.md`
  - `scout.md`
  - `synthesize.md`
  - `agent-routing.md`
  - `review-gate.md`
  - `finalize.md`

## Session Structure

6 subtasks run in order. Subtasks 3, 4, and 5 each write multiple prompt files in parallel:

1. **subtask-01** — Write `opencode/commands/plan-deep-review.md` (slash command)
2. **subtask-02** — Write `opencode/planning/plan-deep-review/plan.json` (9-node DAG)
3. **subtask-03** — Write `session-overview.md` + `load-guidelines.md` (2 prompt files)
4. **subtask-04** — Write `review-intake.md` + `clarify.md` + `scout.md` (3 prompt files)
5. **subtask-05** — Write `synthesize.md` + `agent-routing.md` + `review-gate.md` (3 prompt files)
6. **subtask-06** — Write `finalize.md` (HW direct — complex terminal node)

No gate nodes. No loop nodes. Execute in order, do not skip.

## Key Conventions

- Slash command files: YAML frontmatter with `description` + `$ARGUMENTS` placeholder + MANDATORY PROTOCOL calling `plan_deep_review()` immediately
- Planning DAG prompt paths in plan.json: `~/.config/opencode/planning/plan-deep-review/prompts/{node}.md`
- Planning DAG session_type: `"plan-deep-review"` (new value)
- Planning DAG prompt files do NOT need `<!-- DO NOT COMPACT -->` comment
- Generated fix session files (produced by finalize.md at runtime) DO need `<!-- DO NOT COMPACT THIS NODE -->` as first line
- Gate nodes: `type: "gate"`, `next: [array of branches]`
- Loop nodes: `remaining_visits: 3` default
- Terminal nodes: no `next` field, end with `close_session()`
- load-guidelines.md is a pass-through: it just loads `~/.config/opencode/planning/plan-design-guidelines.md`

## What the Planning DAG Does (for prompt authoring context)

The `/plan-deep-review` workflow:
1. **review-intake** — captures scope path + flags from `$ARGUMENTS`
2. **clarify** (loop, remaining_visits: 3) — asks session-design questions (focus areas, depth, grouping preferences)
3. **scout** — dispatches ContextScout agents in parallel (and/or ContextInsurgent for deep analysis) to actually read and review the specified code; scouts return structured findings (bugs, quality issues, arch concerns)
4. **synthesize** — aggregates scout findings into structured finding groups
5. **agent-routing** — loads delegation skill; routes fix subtasks to appropriate agents
6. **review-gate** (gate) — presents finding groups + proposed fix plan to user; user approves or loops back
7. **finalize** (terminal) — generates the fix session plan: `plan.json` + `session-overview.md` + `fix-subtask-NN-{name}.md` per finding group; commits

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
