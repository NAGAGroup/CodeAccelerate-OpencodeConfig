<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04: Write review-intake.md, clarify.md, and scout.md

## Objective

Write three planning DAG prompt files for the `/plan-deep-review` workflow. These files drive the intake, clarification loop, and agent dispatch phases of the planning session — where the code review scope is captured, session-design questions are asked, and ContextScout/ContextInsurgent agents are dispatched to actually read and review the code.

## Scope

**Write (new files — directory must be created if not present):**
- `opencode/planning/plan-deep-review/prompts/review-intake.md`
- `opencode/planning/plan-deep-review/prompts/clarify.md`
- `opencode/planning/plan-deep-review/prompts/scout.md`

**Read for format reference:**
- `opencode/planning/plan-deep-research/prompts/research-intake.md`
- `opencode/planning/plan-deep-research/prompts/clarify.md`
- `opencode/planning/plan-deep-research/prompts/` (structure reference)

**Do not touch:**
- Any other planning DAG files
- `.opencode/session-plans/` session artifacts

## Constraints

- Planning DAG prompt files do NOT start with `<!-- DO NOT COMPACT -->` — that comment is only for generated execution session files
- Do not hardcode node IDs in Advance sections — use `next_step()` with no arguments for sequential nodes, or describe branch selection for gate nodes
- Prompt files follow the pattern: Role statement → Steps → Constraints → Advance
- These are planning session nodes — they design the review session structure; they do not do the actual code review themselves
- `review-intake.md` must capture `$ARGUMENTS` which contains: optional scope path + optional flags (--bugs, --quality, --arch, --perf, --docs, --security, or any combination)
- `clarify.md` is a loop node — its Advance section must cover both the loop-back and the advance option
- `scout.md` dispatches multiple @ContextScout agents in parallel (and optionally @ContextInsurgent for deep analysis) to read the specified code scope and return structured findings; this is where actual code reading happens
- Scouts return structured findings: bugs, quality issues, arch concerns, etc. — categorized by flag type where applicable
- Reference `opencode/planning/plan-generic/prompts/scout.md` for dispatch pattern

## Todolist

- [ ] Read reference prompts from `plan-deep-research` and `plan-generic` for format conventions
- [ ] Write `review-intake.md` — captures scope path + flags from $ARGUMENTS; confirms with user; does NOT start reviewing code
- [ ] Write `clarify.md` — loop node (remaining_visits: 3); asks session-design questions one at a time (focus areas, depth, fix grouping preferences); Advance section covers both loop and advance options
- [ ] Write `scout.md` — dispatches 2–4 @ContextScout agents in parallel targeting different aspects of the specified scope (e.g., by directory, by concern type, by flag category); optionally dispatches @ContextInsurgent for deep multi-file analysis; instructs scouts to return structured findings (categorized by type); Advance: call `next_step()` after all scouts return
- [ ] Verify all three files are present and well-formed

## Delegation

**Agent:** @QuickDoc (parallel × 3, one per file)
**Model:** haiku-like
**Prompt structure per agent:**
- Read: reference prompts listed in Scope above
- Goal: Write the specified prompt file following the structure and conventions described in Constraints
- Verify: File exists, follows role→steps→constraints→advance pattern, and matches the intent described in Objective

## Advance

Call `next_step()` when all three files are written.
