<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02 — Write finalize.md for plan-deep-research

## Objective

Write `opencode/planning/plan-deep-research/prompts/finalize.md` — the terminal node of the planning session DAG. When the planning session runs, this node writes all the artifacts for the *activated* session: the execution plan.json (with a collaborative research loop), all prompt files, a session-overview, and a research-brief stub. It then commits and presents the seed plan to the user.

This is the most complex prompt file in the planning mode. It must precisely specify what files to write, what the execution DAG looks like, and how the activated session runs collaboratively.

## Scope

**Write (new file):**
- `opencode/planning/plan-deep-research/prompts/finalize.md`

**Reference (do not modify):**
- `opencode/planning/plan-collaborative/prompts/finalize.md` — structural reference
- `opencode/planning/plan-collaborative/prompts/agent-routing.md` — to understand delegation context carried forward

## Constraints

### What finalize.md must instruct HW to write

The activated session plan must live at `.opencode/session-plans/{research-name}/` and contain:

**plan.json** — execution DAG with these nodes (in order):
1. `session-overview` (entry) — read-once overview, call `next_step()` immediately
2. `research-execute` — loop node (`remaining_visits` = count confirmed during planning, default 5); dispatches @DeepResearcher per iteration; surfaces findings to user; user steers direction for next iteration; stops when user signals "done" or visits exhausted
3. `synthesis-gate` — gate node; HW presents all findings accumulated across research-execute iterations; user decides: approve synthesis → advance, or redirect → back to research-execute
4. `report-write` — HW writes the completed research report from accumulated findings; single pass
5. `finalize-output` — terminal; presents completed report to user; asks for any final revisions or confirms done

**Prompt files for the activated session:**
- `session-overview.md` — verbatim copy of the session's goal, topic, open questions, and output format as captured during planning; includes `remaining_visits` count for research-execute loop
- `research-execute.md` — loop node prompt; instructs HW to: dispatch @DeepResearcher for the current iteration's focus area (user-directed or the next open question), surface findings in plain language, ask user "what to explore next?" or "are we done?". Must carry `<!-- DO NOT COMPACT -->` header.
- `synthesis-gate.md` — gate; HW assembles a structured summary of all findings so far (by question or theme); user approves or redirects
- `report-write.md` — HW writes `research-report.md` directly (HW direct, not delegated) using all synthesized findings; report format matches what was specified during planning
- `finalize-output.md` — terminal; presents the report, asks for revisions or close

**research-brief.md** — living document stub created at planning time; contains: topic, open questions, output format, iteration log (empty at start). Updated by HW during each `research-execute` iteration of the activated session. finalize.md must instruct HW to create this stub and place it at `.opencode/session-plans/{research-name}/research-brief.md`.

### Collaborative execution model (must be described in finalize.md)

The activated session is human-in-the-loop. finalize.md must make clear that:
- `research-execute` is not autonomous: HW dispatches @DeepResearcher, returns, surfaces findings, then **waits for user input** before the next dispatch
- User controls depth and direction at each iteration
- `synthesis-gate` is a real gate: user must explicitly approve before report writing begins
- `report-write` is HW-direct: no delegation

### Format and style

- finalize.md must have a `## Steps` section (numbered), `## Constraints`, `## Gate locations`, and an `## Advance` section at the end
- Advance: "This is a terminal node. Call `close_session()` after presenting the final overview."
- Presentation format for the end of finalize.md: subtask-style list with delegation assignments per activated-session prompt, plus note of where research-brief.md lives

### Asking about remaining_visits

finalize.md must instruct HW to confirm the `remaining_visits` count for `research-execute` with the user during planning (in the clarify loop). If not confirmed, default is 5. finalize.md must embed this count into the generated `plan.json`.

## Todolist

- [ ] Read `opencode/planning/plan-collaborative/prompts/finalize.md` to internalize the structure and patterns
- [ ] Write `opencode/planning/plan-deep-research/prompts/finalize.md` with all sections per constraints above
- [ ] Verify: Steps section covers all file writes in order (plan.json, session-overview, research-execute, synthesis-gate, report-write, finalize-output, research-brief.md)
- [ ] Verify: research-brief.md stub creation is explicitly called out as a step
- [ ] Verify: The collaborative execution model is described clearly (not autonomous, user steers each iteration)
- [ ] Verify: Advance section instructs `close_session()` not `next_step()`

## Delegation

**Agent:** HW (direct)
**Reason:** This prompt file requires complex judgment about the collaborative research execution model, precise DAG specification for the activated session, and exact wording for how HW should operate in the loop. A haiku model lacks the reasoning quality needed to get the nuance right. HW has full session context from all prior planning decisions.

## Advance

Call `next_step()` when this subtask is complete.
