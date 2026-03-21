# Node: impl-deep-research — Deep Research Planning Workflow Restructure

This node restructures the Deep Research planning workflow DAG and rewrites/creates all affected prompt files. It also fixes the critical `research-execute.md` bug in the generated execution session.

## Target Planning DAG

```
session-overview → load-guidelines → research-intake → clarify (loop) → agent-routing → research-gate → finalize
```

Key changes from current:
- Add `session-overview` as entry node (was missing)
- Move `load-guidelines` to second node (was post-gate)
- Move `agent-routing` before `research-gate` (user sees full routing before committing to a 5-iteration automated run)
- Remove separate `load-schema` post-gate node (redundant with second-node load-guidelines)

## Step 1 — Rewrite opencode/planning/plan-deep-research/plan.json

Write a new plan.json reflecting the target DAG above. Key fields:
- `entry`: `"session-overview"`
- All prompt paths: `~/.config/opencode/planning/plan-deep-research/prompts/{node-id}.md`
- `clarify`: loop node with `next: ["clarify", "agent-routing"]`, `remaining_visits: 5` (research sessions need more clarify iterations)
- `research-gate`: gate node with `next: ["finalize", "clarify"]`
- `finalize`: terminal node (no `next`)
- Remove: `load-schema` node, old post-gate `agent-routing` position

## Step 2 — Write session-overview.md

File: `opencode/planning/plan-deep-research/prompts/session-overview.md`

Orients the planning agent for a deep research planning session.

Content:
- What a deep research planning session is (produce a research session plan — an automated multi-iteration research DAG that dispatches DeepResearcher agents in parallel and accumulates to a research brief)
- The agent's role (research session designer — confirm the topic, surface design questions, define execution structure, then produce the session artifact)
- The execution session is mostly unsupervised: DeepResearcher agents run in parallel across multiple iterations without user interaction — user only steers at `synthesis-gate`
- Session structure (node-by-node: session-overview → load-guidelines → research-intake → clarify → agent-routing → research-gate → finalize)
- Do NOT start researching — just orient and call `next_step()`

## Step 3 — Write load-guidelines.md

File: `opencode/planning/plan-deep-research/prompts/load-guidelines.md`

Same pattern: brief instruction that guidelines are loaded, internalize before proceeding, call `next_step()`.

## Step 4 — Update research-intake.md

File: `opencode/planning/plan-deep-research/prompts/research-intake.md`

Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Confirm: research topic, output format, purpose — one question at a time
- No research yet

## Step 5 — Update clarify.md

File: `opencode/planning/plan-deep-research/prompts/clarify.md`

Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Questions are session-design questions: depth/breadth, sub-questions to cover, known ground to skip, source constraints (domains, recency), format/audience for final report
- May batch multiple questions in one `question` tool call (this is explicitly allowed in deep research — confirmed correct)
- Loop or advance

## Step 6 — Write agent-routing.md (update)

File: `opencode/planning/plan-deep-research/prompts/agent-routing.md`

This file already exists. Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Routing assignments:
  - `research-execute.md`: @DeepResearcher (dispatched in parallel); HW synthesizes accumulated findings each iteration
  - `synthesis-gate.md`: HW direct (no delegation — requires user interaction)
  - `report-write.md`: @QuickDoc for straightforward synthesis; HW direct for complex multi-source synthesis
  - `finalize-output.md`: HW direct
- Produce routing table
- Call `next_step()`

## Step 7 — Update research-gate.md

File: `opencode/planning/plan-deep-research/prompts/research-gate.md`

Review and update:
- Remove hardcoded node IDs from ADVANCE section (current: hardcodes `next_step({ next: "load-schema" })` — correct target but still violates CC-1)
- Present: research goal, open questions list, execution loop count (`remaining_visits`), output format, agent routing table
- Ask user for explicit approval before committing to the multi-iteration automated run
- On approval: call `next_step()` — plugin presents branch options
- On rejection/changes: loop back to clarify

## Step 8 — Rewrite finalize.md

File: `opencode/planning/plan-deep-research/prompts/finalize.md`

Two major changes:

### CC-2 compliance: dynamic session-overview.md
Generate session-specific `session-overview.md` dynamically:
- Include: the research topic (from research-intake), the open questions to cover (from clarify), output format/audience, execution mode (N iterations, parallel dispatch, unsupervised)
- Do NOT copy a static verbatim template with placeholders

### DeepRes-5 fix: rewrite research-execute.md generation

The currently generated `research-execute.md` incorrectly instructs the agent to surface findings and wait for user direction each iteration. Fix: the generated `research-execute.md` must instruct the agent to:

1. Read `research-brief.md` for accumulated findings so far
2. Dispatch multiple @DeepResearcher agents in parallel — one per open sub-question or research angle
3. Wait for all DeepResearchers to return
4. Append their findings to `research-brief.md` (structured, labeled by iteration and sub-question)
5. Call `next_step()` — the DAG will loop automatically if `remaining_visits > 0`, or advance to `synthesis-gate` when exhausted
6. Do NOT surface findings to the user mid-loop — accumulate silently

The generated `research-execute.md` must NOT contain instructions to:
- Ask the user for direction between iterations
- Present partial findings for steering
- Wait for user confirmation before looping

All other generated files (`synthesis-gate.md`, `report-write.md`, `finalize-output.md`) remain as-is unless minor ADVANCE section fixes are needed.

Terminal node: call `close_session()`, not `next_step()`.

## Step 9 — Verify

- `cat opencode/planning/plan-deep-research/plan.json` — confirm new DAG structure
- `ls opencode/planning/plan-deep-research/prompts/` — confirm session-overview.md and load-guidelines.md exist
- Check research-gate.md has no hardcoded `next_step({ next: "load-schema" })` call

## Advance

Call `next_step()` — this is the final implementation node. The DAG is terminal after this.
