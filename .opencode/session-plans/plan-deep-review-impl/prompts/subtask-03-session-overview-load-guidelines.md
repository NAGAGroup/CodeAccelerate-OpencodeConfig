<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03: Write Planning Prompts — session-overview.md + load-guidelines.md

## Objective

Write two orientation prompt files for the `/plan-deep-review` planning DAG. These are the first two nodes the agent encounters when a planning session starts: an overview that orients it to the workflow, and a guidelines loader that injects the canonical planning schema.

## Scope

**Write (in parallel):**
- `opencode/planning/plan-deep-review/prompts/session-overview.md`
- `opencode/planning/plan-deep-review/prompts/load-guidelines.md`

**Reference (read only, do not edit):**
- `opencode/planning/plan-deep-research/prompts/session-overview.md` — format reference for a research-flavored session-overview
- `opencode/planning/plan-deep-research/prompts/load-guidelines.md` — exact format reference for load-guidelines (pass-through pattern)

## Constraints

- Planning DAG prompt files do NOT need a `<!-- DO NOT COMPACT THIS NODE -->` comment — that is only for generated session files
- `session-overview.md` must describe the `/plan-deep-review` workflow specifically (not generic planning)
- `load-guidelines.md` must be a pass-through: it should instruct the agent to read `~/.config/opencode/planning/plan-design-guidelines.md` and internalize it, then call `next_step()`
- Both files must follow the standard prompt structure: Role statement → Steps → Constraints → Advance

## Todolist

- [ ] Read `opencode/planning/plan-deep-research/prompts/session-overview.md` for format reference
- [ ] Read `opencode/planning/plan-deep-research/prompts/load-guidelines.md` for pass-through format
- [ ] Dispatch two QuickDoc agents in parallel:
  - **QuickDoc A:** Write `opencode/planning/plan-deep-review/prompts/session-overview.md`
    - Content: orients the agent to the deep-review planning workflow
    - Must describe: what the session produces (a fix session plan), the 9-node flow (session-overview → load-guidelines → review-intake → clarify → scout → synthesize → agent-routing → review-gate → finalize), and the operating principles (one question at a time, scope + flags from $ARGUMENTS, don't start reviewing yet)
    - Ends with: `## Advance — Call next_step() to proceed to load-guidelines.`
  - **QuickDoc B:** Write `opencode/planning/plan-deep-review/prompts/load-guidelines.md`
    - Content: pass-through — read `~/.config/opencode/planning/plan-design-guidelines.md`, internalize schema and best-practices, then call `next_step()`
    - Match the exact pass-through pattern from `plan-deep-research/prompts/load-guidelines.md`
- [ ] Verify both files exist and contain appropriate content

## Delegation

**Agent:** @QuickDoc (×2 parallel)
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-deep-research/prompts/session-overview.md` and `opencode/planning/plan-deep-research/prompts/load-guidelines.md` for format reference
- Goal: Write the two prompt files described above
- Constraints: No DO NOT COMPACT comment; follow standard prompt structure; load-guidelines must be a pass-through
- Verify: Both files exist; session-overview mentions the 9-node flow and fix session plan output; load-guidelines points to plan-design-guidelines.md

## Advance

Call `next_step()` when this subtask is complete.
