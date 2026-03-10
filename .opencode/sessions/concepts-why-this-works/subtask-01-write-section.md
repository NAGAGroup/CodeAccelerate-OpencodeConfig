# Subtask 01 — Write "Why This Works" Section

## Delegation
- **Agent:** DocWriter
- **Model tier:** fast — `github-copilot/claude-haiku-4.5`
- **Reason:** Well-specified writing task with all source material provided. Single-file edit with clear placement, tone, and content requirements. No research or reasoning needed.

---

## Objective

Insert a new H2 section titled "Why This Works" into `docs/CONCEPTS.md`. The section goes **after** the horizontal rule that closes "The Plan Is the Product" section (after line 24) and **before** the "## HeadWrench — The Orchestrator" H2 (currently line 26). The section must cover exactly four points in flowing prose paragraphs, match the existing document tone, and leave all existing content unchanged.

---

## Todolist

### 1. Write the section
- [ ] Read `docs/CONCEPTS.md` to confirm current state and exact insertion point
- [ ] Draft the "Why This Works" section covering all 4 required points (see Patterns below)
- [ ] Insert the section after line 24 (`---`) and before line 26 (`## HeadWrench`)

### 2. Verify
- [ ] Confirm all existing section headers and content are intact
- [ ] Confirm the new section has no H3 subsections — prose paragraphs only
- [ ] Confirm placement is correct (after "The Plan Is the Product", before "HeadWrench")

---

## Scope
- **Edit:** `docs/CONCEPTS.md` — insert the new section only
- **Read:** `docs/CONCEPTS.md`
- **Write:** nothing new
- **Excluded:** Every other file in the repository

---

## Patterns

```
✅ GOOD — "The session plan carries the complexity. The config does not."
✅ GOOD — Match the existing voice: short declarative sentences, no hedging words like "essentially" or "basically"
✅ GOOD — Reference concrete archive evidence: the old system had agent-guardrails.ts enforcing ~6 behavioral rules via plugin hooks, 12 reflection prompt files fired when agents drifted, workflow-* slash commands encoding standard patterns, agent-specific execution-protocol skills
✅ GOOD — Treat the four points as four natural paragraphs that flow together
✅ GOOD — The contrast paragraph names the approaches by name: oh-my-opencode, OpenAgentsControl, and the prior handrolled config (the archive/main branch)

❌ BAD  — Do not add H3 subheadings inside "Why This Works"
❌ BAD  — Do not rewrite, reorder, or reformat any existing content in CONCEPTS.md
❌ BAD  — Do not hedge: avoid "essentially", "basically", "in a sense", "kind of"
❌ BAD  — Do not write feature comparisons or version-specific claims about oh-my-opencode or OAC
❌ BAD  — Do not insert the section at the wrong place (e.g., at the end of the file)
```

---

## Constraints

- **Pure addition:** only the new section is added. No existing line changes.
- **Placement is mandatory:** immediately after the `---` closing "The Plan Is the Product", before `## HeadWrench — The Orchestrator`.
- **No H3s:** the existing document uses only H2 sections with flowing prose. Match that.
- **Four points, four paragraphs** (or very close — you may combine if flow demands it, but all four must be addressed):
  1. **Why static workflow templates fail** — They anticipate cases upfront and encode them as rules (plugins, reflection prompts, workflow commands). Every edge case requires a new rule. Drift requires supervision to correct. The config grows to match every problem the system ever encountered. Reference: the prior handrolled config (`archive/main` branch) had a `agent-guardrails.ts` TypeScript plugin enforcing 6+ behavioral rules via before-hook interceptors, 12 reflection prompt markdown files to fire when agents drifted, `todoplan.ts`, `workflow-constraints.ts`, `skill-loader.ts` plugins, and `workflow-*` slash commands encoding standard patterns. It worked — until edge cases showed up.
  2. **Why Q&A-driven works** — Q&A interviews the user about the specific problem. Done criteria, scope, constraints, what to avoid — all flow in through normal answers. The user's expertise enters the system without requiring prompt engineering knowledge. The session plan becomes the enforcement mechanism; agents follow the spec, not hardcoded rules.
  3. **Why maintenance is near-zero** — No TypeScript scaffolding, no reflection prompts, no workflow commands for standard patterns. Two stable plugin primitives: DCP for context pruning, session-context for session state injection. Agent definitions are plain markdown. Sessions are created and discarded — complexity lives briefly in the plan and then disappears. There is no permanent scaffolding that accumulates technical debt.
  4. **Contrast with existing solutions** — oh-my-opencode and OpenAgentsControl provide pre-built agent roles and workflow patterns — excellent for common cases, but you fit your problem into their structure. The prior handrolled config tried to build a universal execution engine that anticipated every scenario. This config does the opposite: the execution engine stays dumb, the session plan gets smart. The config hasn't needed to change in months; the plans change every session.
- **Tone:** match the existing CONCEPTS.md voice exactly — direct, confident, no jargon. Read the existing "The Plan Is the Product" section and mirror its register.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
