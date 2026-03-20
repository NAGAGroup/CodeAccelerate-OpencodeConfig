<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01 — Write planning DAG and core prompt files

## Objective

Create the `opencode/planning/plan-deep-research/` directory with its `plan.json` DAG and four prompt files: `research-intake.md`, `clarify.md`, `research-gate.md`, `agent-routing.md`. These files drive the planning session itself — they scope the research topic, ask research-specific clarifying questions, gate the session design, and determine delegation for the activated session's prompt files.

## Scope

**Write (new files):**
- `opencode/planning/plan-deep-research/plan.json`
- `opencode/planning/plan-deep-research/prompts/research-intake.md`
- `opencode/planning/plan-deep-research/prompts/clarify.md`
- `opencode/planning/plan-deep-research/prompts/research-gate.md`
- `opencode/planning/plan-deep-research/prompts/agent-routing.md`

**Reference (do not modify):**
- `opencode/planning/plan-collaborative/plan.json` — DAG schema reference
- `opencode/planning/plan-collaborative/prompts/idea-intake.md` — structure reference for `research-intake.md`
- `opencode/planning/plan-collaborative/prompts/clarify.md` — structure reference for `clarify.md`
- `opencode/planning/plan-collaborative/prompts/seed-gate.md` — structure reference for `research-gate.md`
- `opencode/planning/plan-collaborative/prompts/agent-routing.md` — structure reference for `agent-routing.md`

## Constraints

- Mirror the plan-collaborative structure exactly but with research-specific framing
- `plan.json` DAG: `research-intake → clarify → research-gate → load-schema → agent-routing → finalize` (6 nodes)
- `clarify` is a loop node: `"next": ["clarify", "research-gate"]`, `"remaining_visits": 5`
- `research-gate` is a gate node: `"next": ["load-schema", "clarify"]`
- `load-schema` is an agent node: `"prompt": "~/.config/opencode/planning/plan-json-schema.md"`, `"next": "agent-routing"`
- All prompt paths use `~/.config/opencode/planning/plan-deep-research/prompts/{name}.md`
- **`research-intake.md`** — confirms three things: research topic, desired output format (report/summary/decision-support/etc.), and what decisions or actions this research will inform. One question at a time if unclear. Does NOT engage with the topic's substance.
- **`clarify.md`** — session-design questions only; explicitly forbid engaging with topic substance. Research-relevant clarifying areas: depth/breadth tradeoff, specific questions to answer, known ground to skip, source constraints (recency, domain), report format/audience.
- **`research-gate.md`** — gate: present the proposed research session structure (topic, open questions, output format) for user approval. Does NOT analyze or answer the research questions.
- **`agent-routing.md`** — loads delegation skill, determines delegation for `research-execute.md`, `synthesis-gate.md`, `report-write.md`, and `finalize-output.md` in the activated session. Produces a delegation summary per prompt file.

## Todolist

- [ ] Read `opencode/planning/plan-collaborative/plan.json` and all 4 referenced prompt files to internalize the pattern
- [ ] Write `opencode/planning/plan-deep-research/plan.json` with the 6-node DAG (include `load-schema` node between `research-gate` and `agent-routing`)
- [ ] Write `opencode/planning/plan-deep-research/prompts/research-intake.md`
- [ ] Write `opencode/planning/plan-deep-research/prompts/clarify.md`
- [ ] Write `opencode/planning/plan-deep-research/prompts/research-gate.md`
- [ ] Write `opencode/planning/plan-deep-research/prompts/agent-routing.md`
- [ ] Verify all prompt paths in plan.json match the actual file names

## Delegation

**Agent:** @JuniorDev (parallel × 5)
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-collaborative/plan.json`, all 4 prompt files in `opencode/planning/plan-collaborative/prompts/`
- Goal: Write 5 new files for `plan-deep-research` that mirror the plan-collaborative structure with research-specific framing, per the constraints above
- Constraints: No content generation about research topics; structural/prompt-writing work only; `clarify` node must have `remaining_visits: 5`; gate node structure must match plan-collaborative's seed-gate pattern
- Verify: All files exist; `plan.json` parses as valid JSON; plan.json has 6 nodes including `load-schema`; prompt paths in plan.json match actual file names

## Advance

Call `next_step()` when this subtask is complete.
