<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask ST08: Decide on plan-deep-review Rebuild Scope

## Objective

Determine the scope of work needed for `plan-deep-review` scaffold. This subtask is a **user decision gate**, not an execution subtask. Surface the current state and ask the user to decide: rebuild plan-deep-review with the same design philosophy, leave it as-is, or defer it to a future session.

## Scope

**Current state of plan-deep-review:**

- 5th planning scaffold in the directory (not in scope during discovery, but exists)
- 11 prompt files + 20-node DAG
- Dual-gate structure: `review-gate` (full plan approval) + `synthesize` loop (refinement loop for review findings)
- Purpose: deep code review planning (similar to generic decomposition, but focused on review tasks)

**User decision options:**

1. **Option A: Rebuild plan-deep-review** (same scope as generic/debug/collaborative/deep-research)
   - Apply all changes from ST01–ST07 to plan-deep-review
   - Update boilerplate, fix sequencing, rebuild as spec-generation or execution plan
   - Effort: 1–2 additional subtasks (~4 hours)

2. **Option B: Leave plan-deep-review as-is** (defer or skip)
   - plan-deep-review remains untouched
   - Users can still access it, but it won't benefit from the redesign
   - Note: It will become outdated relative to other scaffolds
   - Effort: None (this session ends after ST07)

3. **Option C: Minimal update for plan-deep-review** (boilerplate only)
   - Apply ST02 boilerplate elimination to plan-deep-review prompts only
   - Do NOT restructure DAG, rebuild scaffolds, or enforce strict language
   - Effort: 30 minutes
   - Downside: Inconsistent with other scaffolds

## Decision Prompt

Your input determines whether plan-deep-review is in scope for the overall redesign. Consider:
- Is code review planning important enough to warrant the effort?
- Will leaving it outdated create confusion?
- Can this work be deferred to a future session without losing value?

**Surface this to the user and wait for explicit direction.** Do NOT guess the user's preference.

## Constraints

- You MUST present all three options clearly
- You MUST ask the user which option to pursue
- You MUST NOT decide on behalf of the user
- You MUST wait for explicit approval before proceeding

## Delegation

**Agent:** HW (direct)

**Task:** Surface the three options for plan-deep-review scope to the user:
1. Full rebuild (ST01–ST07 applied to plan-deep-review)
2. Defer/skip (leave as-is, no work)
3. Minimal update (boilerplate only, no restructure)

Surface findings, ask user for decision, and wait for explicit approval before calling next_step().

**Goal:** Get user direction on plan-deep-review scope.

## Advance

Call `next_step()` exactly once after the user has chosen an option. If the user chooses Option A (rebuild), call `next_step()` with no args — this will advance to a new finalize gate. If the user chooses Option B or C, call `next_step()` with no args — this will also advance to finalize (the agent will know which option was chosen from the user's response, stored in context).

Note: If the user chooses Option A, additional subtasks will be added to the plan before finalize is run.

