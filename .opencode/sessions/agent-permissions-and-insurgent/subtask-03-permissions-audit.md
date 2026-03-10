# Subtask 03 — Permissions Audit (All Agents)

## Delegation
- **Agent:** @ContextScout
- **Model tier:** fast (github-copilot/claude-haiku-4.5)
- **Reason:** Read-only analysis across 10 agent files — ContextScout is purpose-built for structured analysis and producing findings reports. The evaluation criteria are clearly specified, keeping this within haiku's capability range.

---

## Objective

Conduct a read-only audit of all agent permission frontmatter blocks. For each agent, analyze whether its permissions are appropriately scoped — neither over-permissive nor over-restrictive for its intended role. Produce a structured findings report to `.opencode/sessions/agent-permissions-and-insurgent/notes/permissions-audit.md`.

Agents to audit:
1. `opencode/agents/headwrench.md` (primary orchestrator)
2. `opencode/agents/subagents/context-scout.md`
3. `opencode/agents/subagents/context-insurgent.md` (new, just created in subtask 01)
4. `opencode/agents/subagents/code-writer.md`
5. `opencode/agents/subagents/doc-writer.md`
6. `opencode/agents/subagents/deep-researcher.md`
7. `opencode/agents/subagents/gates-expert.md`
8. `opencode/agents/subagents/subagent-builder.md`
9. `opencode/agents/subagents/architect.md`
10. `opencode/agents/subagents/agent-delegation-expert.md`

---

## Todolist

### 1. Read all agent permission blocks
- [ ] Read each of the 10 agent files listed above
- [ ] Extract the `permission:` frontmatter block from each

### 2. Analyze each agent against these criteria
For each agent, evaluate:
- [ ] **`task: deny`** — is it set on all subagents? (Required: subagents must not create delegation chains)
- [ ] **`edit` / `write`** — does the agent actually need to write files? Deny if not.
- [ ] **`question`** — which agents can ask the user? Is this appropriate for each role?
- [ ] **`bash` wildcard default** — is it `deny`, `ask`, or `allow`? Should it be more restrictive?
- [ ] **`bash` allowlist** — are the explicitly-allowed commands minimal and necessary?
- [ ] **`skill`** — does the agent need to load skills? Is this granted/denied appropriately?
- [ ] **Missing explicit denies** — are important capabilities implicitly allowed by omission when they should be explicitly denied?
- [ ] **HeadWrench specifically** — currently only has `question: allow`. Does it need bash permissions explicitly stated? What's the default permission model for primary agents?

### 3. Write the findings report
- [ ] Write a structured report to `notes/permissions-audit.md` in this session's notes directory
- [ ] Format: one section per agent with current permissions, findings, and proposed changes
- [ ] Include a summary table: agent | current status | proposed changes | risk level

---

## Scope
- **Read:** All 10 agent files listed above
- **Write:** `notes/permissions-audit.md` (the findings report only)
- **Excluded:** Do NOT modify any agent files — this is a read-only analysis subtask
- **Excluded:** opencode.json, protocols, session files

---

## Patterns
```
✅ GOOD — Note each permission as "appropriate", "over-permissive", "under-restrictive", or "missing"
❌ BAD  — Proposing sweeping changes without explaining the specific risk each permission poses

✅ GOOD — "CodeWriter has bash: '*': ask which is correct — but npm test allow may be too broad if not needed"
❌ BAD  — "CodeWriter permissions look fine" (too vague, no actionable finding)
```

---

## Constraints
- This is STRICTLY read-only. Do NOT edit or write any agent files.
- The findings report (`notes/permissions-audit.md`) is the ONLY output file to create.
- Flag but do not implement lockdowns — that is subtask 04's job (after user approval at G1).
- Assess HeadWrench's primary-agent permissions model — primary agents in OpenCode likely get all permissions by default unless explicitly constrained. Note this as an open question if uncertain.

---

## [🚫 GATE] G1 — Permissions Audit Review + /session-status Decision

After the permissions audit is complete, HeadWrench will present the full audit findings to the user. Do not proceed to subtask 04 until the user has:
1. Reviewed the `notes/permissions-audit.md` findings
2. Approved the proposed lockdowns (or adjusted them)
3. Decided on the `/session-status` implementation approach (Option A: slash command, Option B: plugin attempt, Option C: skip)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
