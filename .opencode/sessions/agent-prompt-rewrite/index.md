# Session: agent-prompt-rewrite

## Goal

Rewrite all 30 agent-facing files (5 agents, 13 commands, 10 protocols, 2 skills) to fix user-doc framing, add persona/tone/refusal protocols to agent files, and ensure every file addresses its audience in pure agent-directive language — inspired by patterns from `dontriskit/awesome-ai-system-prompts`.

## Done Criteria

- [ ] All 5 agent files have persona, tone, anti-patterns, and refusal guidance
- [ ] All command files use pure agent-directive language — no slash command references, no user-doc headings
- [ ] All protocol files address you (HeadWrench) in second person — no "when /plan is invoked" style phrasing
- [ ] Subtask file template includes audience note clarifying HW reads it first
- [ ] All 2 skill files have framing consistent with the above rules
- [ ] `session-status.md` left untouched (UX-only, no agent content)
- [ ] Final git diff reviewed and approved by user

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ completed | Rewrite agent files (headwrench, context-scout, context-insurgent, deep-researcher, session-local-implementer) — session-local-implementer / standard |
| 02 | ✅ completed | Rewrite skill files (agent-delegation-expert/SKILL.md, agent-writer/SKILL.md) — session-local-implementer / standard |
| 03 | ▶️ in_progress | Rewrite context/session commands (activate-session, context-add, context-audit, context-list, context-remove, deactivate-session, roadmap-add) — session-local-implementer / standard |
| 04 | 🔲 pending | Rewrite plan commands (plan.md, plan-deep-research.md, quick-plan.md) — session-local-implementer / standard |
| 05 | 🔲 pending | Rewrite plan-phase protocols (plan-init, plan-shared, plan-generic, plan-debug, plan-collaborative, plan-end) — session-local-implementer / standard |
| 06 | 🔲 pending | Rewrite core protocols (plan-deep-research, checkpoint, context-management, session-plan-schema) + [🚫 GATE] user reviews full diff — session-local-implementer / standard |

## Gates

### G1 — Full Diff Review (after subtask 06)

All 30 files rewritten. You review the complete git diff before the final session commit is made. Gate lives in subtask 06's Todolist.

## Current Focus

Subtask 02 complete. Executing Subtask 03 — rewrite context/session command files.

## Scope

**In scope:**
- `opencode/agents/headwrench.md`
- `opencode/agents/subagents/context-scout.md`
- `opencode/agents/subagents/context-insurgent.md`
- `opencode/agents/subagents/deep-researcher.md`
- `.opencode/agents/session-local-implementer.md`
- All files in `opencode/commands/` (except `session-status.md`)
- `.opencode/commands/roadmap-add.md`
- All files in `opencode/protocols/`
- `opencode/skills/agent-delegation-expert/SKILL.md`
- `opencode/skills/agent-writer/SKILL.md`

**Out of scope:**
- `opencode/commands/session-status.md` — UX-only, no agent content
- `opencode/opencode.json` — config, not a prompt file
- Any session plan files themselves
- Source code, tests, or non-prompt files

## Patterns & Constraints

**Cross-cutting rules for all rewrites:**
1. No slash command references — replace "/plan", "/context-audit", "/plan invocation" etc. with "planning session", "audit task", "when you begin planning"
2. Agent-directive language — commands are tasks injected verbatim; headings like "How to Run X" become "Your Task" or direct imperatives
3. Audience is always the agent — the agent never knows a slash command triggered the prompt
4. Preserve all operational logic — no functional changes, only framing, audience clarity, and additions
5. For agent files: add persona paragraph, NEVER anti-patterns, and redirect guidance in "What You Don't Do" sections
6. Protocols use second person "you" — "you dispatch @ContextScout", "you run the checkpoint"
7. Subtask file template gets an audience note clarifying HW reads it first, then passes subtask content to the assigned subagent
8. HeadWrench persona: direct, confident, concise; never says "Certainly!", "Great!", or "Absolutely!"; refuses gracefully with redirect
