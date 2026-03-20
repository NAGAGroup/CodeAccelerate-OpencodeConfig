# Subtask 08 — Implement: Subagent Files

## Delegation
**Agent:** HeadWrench direct
**Model:** anthropic/claude-sonnet-4-6

---

## Objective
Rewrite all subagent files in `~/.config/opencode/agents/subagents/` from scratch using the Role-Goal-Backstory pattern, deny-by-default tool permissions, and model tiers established in the design.

---

## Context
- Model tiers: Scout → haiku, Implementer → sonnet, Architect → o1-mini
- Role-Goal-Backstory pattern: each agent has a clear role, a well-defined goal, and a backstory that shapes its behavior
- Deny-by-default: each agent lists only the tools it is explicitly allowed to use
- Read current subagent files for reference: `~/.config/opencode/agents/subagents/`

---

## Todolist

- [ ] Rewrite `~/.config/opencode/agents/subagents/context-scout.md`
  - Role: read-only reconnaissance agent
  - Model: anthropic/claude-haiku-4-5
  - Permissions: Read, Glob, Grep — NO Write, NO Bash, NO Edit
  - Goal: answer a specific question about the codebase; return findings in structured form
  - Hard limit: shallow pass only; escalate to ContextInsurgent if depth is needed

- [ ] Rewrite `~/.config/opencode/agents/subagents/context-insurgent.md`
  - Role: deep multi-file analysis agent
  - Model: anthropic/claude-sonnet-4-6
  - Permissions: Read, Glob, Grep, sequential-thinking MCP — NO Write, NO Bash, NO Edit
  - Goal: deep architectural analysis with sequential reasoning; return findings + recommended actions
  - Use for: complex analysis requiring multi-file correlation and sequential thinking

- [ ] Rewrite `~/.config/opencode/agents/subagents/deep-researcher.md`
  - Role: web and documentation research agent
  - Model: anthropic/claude-haiku-4-5
  - Permissions: Exa MCP tools (web search, crawl), context7 MCP — NO Write, NO Bash, NO Edit
  - Goal: find authoritative sources, synthesize findings, return citations + summary
  - User-gated: this agent incurs external API costs; document that clearly
  - Hard limit: research only — no implementation recommendations

---

## Scope
- Three subagent files: context-scout, context-insurgent, deep-researcher
- Out of scope: headwrench.md (subtask 07), session-local agents (created on-demand via agent-writer skill)

## Constraints
- Role-Goal-Backstory pattern mandatory for all three
- context-scout and context-insurgent: NO write or exec permissions whatsoever
- deep-researcher: NO write or exec; only external research tools
- Each agent must include an explicit "What I don't do" section
- Model assignments must match tier table: scout/haiku, insurgent/sonnet, researcher/haiku

## Verification
- Each file has correct YAML frontmatter (mode, model, permissions)
- Deny-by-default is explicit — tools listed = only tools allowed
- Role-Goal-Backstory is clearly structured in each system prompt

---

*Checkpoint: `wip: subtask 08 complete — subagents`*
