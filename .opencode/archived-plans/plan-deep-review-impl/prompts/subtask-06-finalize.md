<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 06: Write finalize.md (terminal node)

## Objective

Write `opencode/planning/plan-deep-review/prompts/finalize.md` — the terminal node of the `/plan-deep-review` planning DAG. This is the most complex prompt in the workflow: when executed, it must dynamically generate a complete fix session plan (plan.json + session-overview.md + one subtask prompt file per finding group) and commit it. The generated fix session plan is what the user activates to actually apply the code review fixes.

This subtask is handled directly by HW (not delegated) because the finalize node instructions require precise understanding of the DAG schema, session plan conventions, and the exact structure of what must be generated.

## Scope

**Write:**
- `opencode/planning/plan-deep-review/prompts/finalize.md`

**Read for format reference:**
- `opencode/planning/plan-generic/prompts/finalize.md`
- `opencode/planning/plan-deep-research/prompts/finalize.md`
- `opencode/planning/plan-design-guidelines.md` (schema reference)

**Do not touch:**
- `.opencode/session-plans/` (this subtask writes `opencode/planning/...` only)
- Any other planning DAG files

## Constraints

- This is a terminal node — its Advance section must NOT call `next_step()`. It must call `close_session()`.
- Planning DAG prompt files do NOT start with `<!-- DO NOT COMPACT -->` — that comment is only for generated execution session files
- The finalize.md prompt must instruct the executing agent to:
  1. Apply delegation assignments from agent-routing context (do not re-derive)
  2. Generate a session-specific `session-overview.md` dynamically — include goal (code review scope + flags), finding groups discovered, subtask count, output path
  3. Write session files to `.opencode/session-plans/{session-name}/`:
     - `prompts/session-overview.md` — starts with `<!-- DO NOT COMPACT THIS NODE -->` as first line
     - `prompts/fix-subtask-NN-{name}.md` — one per finding group, each with Objective, Scope, Constraints, Todolist, Delegation, Advance sections; starts with `<!-- DO NOT COMPACT THIS NODE -->`; terminal subtask note: "DAG will detect terminal and prompt close_session()"
  4. Write `plan.json` — linear fix execution DAG: session-overview → fix-subtask-01 → fix-subtask-02 → ... → fix-subtask-N (terminal); session_type should be `"plan-deep-review"` to indicate this is a fix session from a deep review
  5. Commit: `git add .opencode/session-plans/{session-name}/ && git commit -m "plan: add session {session-name}"`
  6. Present final overview to user: finding groups, fix subtask list with delegation, activation command `/activate-plan {session-name}`
  7. Call `close_session()`
- The {session-name} used for the fix session is determined by the executing agent at runtime — suggest a descriptive name like `deep-review-{scope}-fixes` or `deep-review-fixes-{date}` based on what was reviewed
- Subtask prompt files for fix subtasks must be fully populated — no TBD sections
- The fix plan's plan.json `session_type` field: use `"plan-deep-review"` to mark it as output of this workflow type

## Todolist

- [ ] Read `opencode/planning/plan-generic/prompts/finalize.md` and `opencode/planning/plan-deep-research/prompts/finalize.md` for structure reference
- [ ] Write `opencode/planning/plan-deep-review/prompts/finalize.md` covering all 7 steps listed in Constraints
- [ ] Ensure Advance section calls `close_session()` (NOT `next_step()`) — this is a terminal node
- [ ] Ensure the prompt instructs the agent to generate session-overview.md dynamically (not copy a template)
- [ ] Ensure fix subtask prompts are fully populated with all required sections
- [ ] Verify the file is present and correctly structured

## Delegation

**Agent:** HW (direct)
**Reason:** Complex — requires precise synthesis of the DAG schema, session plan conventions, and multi-step artifact generation instructions. Too complex for a haiku model to produce correctly without full context.

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
