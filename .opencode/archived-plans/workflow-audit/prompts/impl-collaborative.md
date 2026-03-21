# Node: impl-collaborative — Collaborative Planning Workflow Restructure

This node restructures the Collaborative planning workflow DAG and rewrites/creates all affected prompt files.

## Target DAG

```
session-overview → load-guidelines → idea-intake → clarify (loop) → agent-routing → seed-gate → finalize
```

Key changes from current:
- Add `session-overview` as entry node (was missing)
- Move `load-guidelines` to second node (was post-gate)
- Move `agent-routing` before `seed-gate` (user sees full routing at gate)
- Remove separate `load-schema` post-gate node (redundant with second-node load-guidelines)

## Step 1 — Rewrite opencode/planning/plan-collaborative/plan.json

Write a new plan.json reflecting the target DAG above. Key fields:
- `entry`: `"session-overview"`
- All prompt paths: `~/.config/opencode/planning/plan-collaborative/prompts/{node-id}.md`
- `clarify`: loop node with `next: ["clarify", "agent-routing"]`, `remaining_visits: 3`
- `seed-gate`: gate node with `next: ["finalize", "clarify"]`
- `finalize`: terminal node (no `next`)
- Remove: `load-schema` node, old `agent-routing` post-gate position

## Step 2 — Write session-overview.md

File: `opencode/planning/plan-collaborative/prompts/session-overview.md`

Orients the planning agent for a collaborative planning session.

Content:
- What a collaborative planning session is (produce a collaborative session plan — an explore-based DAG where open questions are surfaced one at a time with the user)
- The agent's role (session designer — identify the topic, surface design questions, define exploration structure, then produce the session artifact)
- The agent's role is structural: capture the idea, surface open questions, define exploration areas — NOT to explore the topic itself
- Session structure (node-by-node: session-overview → load-guidelines → idea-intake → clarify → agent-routing → seed-gate → finalize)
- Do NOT start exploring or asking questions — just orient and call `next_step()`

## Step 3 — Write load-guidelines.md

File: `opencode/planning/plan-collaborative/prompts/load-guidelines.md`

Same pattern: brief instruction that guidelines are loaded, internalize before proceeding, call `next_step()`.

## Step 4 — Update idea-intake.md

File: `opencode/planning/plan-collaborative/prompts/idea-intake.md`

Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Confirm: topic, desired format, desired outcome — one question at a time
- No exploration yet

## Step 5 — Update clarify.md

File: `opencode/planning/plan-collaborative/prompts/clarify.md`

Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Questions are session-design questions (not topic questions): depth/breadth, open questions to explore, format/audience, output artifacts, known ground to skip
- 2–5 questions total across all clarify visits
- Loop or advance

## Step 6 — Write agent-routing.md (if not already present or needs update)

File: `opencode/planning/plan-collaborative/prompts/agent-routing.md`

This file already exists. Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Load delegation skill
- Assign agent+model to each generated prompt: explore-NN.md nodes, spec-gate.md, finalize-output.md
- Produce routing table
- Call `next_step()`

## Step 7 — Update seed-gate.md

File: `opencode/planning/plan-collaborative/prompts/seed-gate.md`

Review and update:
- Remove hardcoded node IDs from ADVANCE section (current bug: hardcodes `next_step({ next: "finalize" })` but plan.json has `next: ["load-schema","clarify"]`)
- Present: session structure (open questions, explore node list, agent routing table, output artifacts)
- Ask user for explicit approval
- On approval: call `next_step()` — plugin presents branch options
- On rejection/changes: loop back to clarify

## Step 8 — Update finalize.md

File: `opencode/planning/plan-collaborative/prompts/finalize.md`

Key update — CC-2 compliance: generate session-specific `session-overview.md` dynamically.

The collaborative finalize.md generates the most files (6+). Review and update:
- `session-overview.md`: Generate dynamically with: the topic (from idea-intake), the exploration questions (from clarify), output artifact (spec.md path), role instructions ("one question at a time, write to spec.md as conclusions are reached")
- `spec.md` stub: unchanged (just a stub)
- `explore-NN.md` files: one per open question — unchanged pattern
- `spec-gate.md`: unchanged
- `finalize-output.md`: unchanged
- Remove any static verbatim session-overview.md template — replace with dynamic generation
- Terminal node: call `close_session()`, not `next_step()`

## Step 9 — Verify

- `cat opencode/planning/plan-collaborative/plan.json` — confirm new DAG structure
- `ls opencode/planning/plan-collaborative/prompts/` — confirm session-overview.md and load-guidelines.md exist
- Check seed-gate.md has no hardcoded `next_step({ next: "finalize" })` call

## Advance

Call `next_step()` when all steps are complete and verified.
