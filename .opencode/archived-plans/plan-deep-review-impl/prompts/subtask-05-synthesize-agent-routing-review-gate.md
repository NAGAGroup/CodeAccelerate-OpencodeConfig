<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 05: Write synthesize.md, agent-routing.md, and review-gate.md

## Objective

Write three planning DAG prompt files for the `/plan-deep-review` workflow. These files drive the synthesis, agent routing, and user approval gate phases — where scout findings are aggregated into structured finding groups, fix subtasks are routed to appropriate agents, and the user approves the proposed fix plan before file generation begins.

## Scope

**Write (new files):**
- `opencode/planning/plan-deep-review/prompts/synthesize.md`
- `opencode/planning/plan-deep-review/prompts/agent-routing.md`
- `opencode/planning/plan-deep-review/prompts/review-gate.md`

**Read for format reference:**
- `opencode/planning/plan-generic/prompts/synthesize.md`
- `opencode/planning/plan-generic/prompts/agent-routing.md`
- `opencode/planning/plan-generic/prompts/review-gate.md`
- `opencode/planning/plan-deep-research/prompts/research-gate.md`

**Do not touch:**
- Any other planning DAG files
- `.opencode/session-plans/` session artifacts

## Constraints

- Planning DAG prompt files do NOT start with `<!-- DO NOT COMPACT -->` — that comment is only for generated execution session files
- Do not hardcode node IDs in Advance sections — use `next_step()` with no arguments for sequential nodes
- Prompt files follow the pattern: Role statement → Steps → Constraints → Advance
- These are planning session nodes — they structure the review findings and fix plan; they do not execute fixes

**synthesize.md specifics:**
- Reads all scout findings from prior node context
- Groups findings by type (bugs, quality, arch, etc.) or by logical fix scope — agent's discretion
- Produces a structured summary: finding groups with severity/count
- Presents the summary to the user briefly before advancing
- Does NOT ask questions here — surfaces open questions in summary, then advances

**agent-routing.md specifics:**
- Loads the `delegation` skill
- Reviews finding groups from synthesize context
- Assigns each fix subtask (finding group) to an agent: @JuniorDev for code edits, @QuickDoc for doc fixes, HW for shell/build/complex changes
- Produces a routing table (subtask → agent → model tier → rationale)
- Does NOT write files — routing decisions only
- Calls `next_step()` to advance to review-gate

**review-gate.md specifics:**
- Gate node — presents to user and waits for approval
- Presents: finding groups, proposed fix subtask breakdown, agent routing assignments, any risky steps flagged with `[🚫 GATE]`
- Asks user explicitly: "Does this fix plan look correct? Approve to generate the fix session plan, or loop back with changes."
- Advance section: branch options — approve → finalize, or loop back → clarify

## Todolist

- [ ] Read reference prompts from `plan-generic` and `plan-deep-research` for format conventions
- [ ] Write `synthesize.md` — aggregates findings from scout context; groups by type; presents structured summary; advances to agent-routing
- [ ] Write `agent-routing.md` — loads delegation skill; routes each finding group to appropriate agent; produces routing table; advances to review-gate
- [ ] Write `review-gate.md` — gate node presenting complete fix plan to user; branches to finalize (approve) or clarify (loop back)
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
