# Subtask 01 — Fix Agent Permission Blocks

## Delegation
- **Agent:** @CodeWriter
- **Model tier:** standard (claude-sonnet) — multiple agent files with careful structured YAML edits; needs judgment on what to preserve vs. change in each file
- **Reason:** Precise edits to YAML frontmatter permission blocks across 8 agent files. Standard tier because each file has a unique structure and the edits must be exact — wrong changes would break agent behavior.

---

## Objective

Read all 8 subagent definition files and apply deny-by-default permissions to every agent that doesn't already have it. The primary target is CodeWriter (which has `npm test *`, `make *`, `cargo test *` — all forbidden). Also fix DocWriter and SubagentBuilder. Verify that ContextScout, Architect, DeepResearcher, ContextInsurgent, and GatesExpert already comply; make no unnecessary changes to compliant files.

The deny-by-default rule: every agent's permission block must start with `"*": deny` before any explicit allows. `"*": ask` is not acceptable as a default — it still allows tool use with user approval, which breaks unsupervised execution.

---

## Todolist

### 1. Read all agent files in parallel
- [ ] Read `opencode/agents/subagents/code-writer.md`
- [ ] Read `opencode/agents/subagents/doc-writer.md`
- [ ] Read `opencode/agents/subagents/subagent-builder.md`
- [ ] Read `opencode/agents/subagents/context-scout.md`
- [ ] Read `opencode/agents/subagents/architect.md`
- [ ] Read `opencode/agents/subagents/deep-researcher.md`
- [ ] Read `opencode/agents/subagents/context-insurgent.md`
- [ ] Read `opencode/agents/subagents/gates-expert.md`

### 2. Audit and document current permission model for each agent
- [ ] For each file, note: current default (deny/ask/allow), any problematic explicit allows, whether it already complies

### 3. Fix CodeWriter permissions
- [ ] Remove `"npm test *": allow`, `"make *": allow`, `"cargo test *": allow` from bash permissions
- [ ] Remove `"npx prettier *": allow`, `"npx eslint *": allow` from bash permissions
- [ ] Change bash default from `"*": ask` to `"*": deny`
- [ ] Keep ONLY: `"cat *": allow`, `"ls *": allow`, `"find *": allow`, `"grep *": allow`, `"rg *": allow`
- [ ] Verify no other permission sections grant execution capabilities

### 4. Fix DocWriter permissions (if non-compliant)
- [ ] If DocWriter uses allow-list approach (`"*": ask` or no default), change bash default to `"*": deny`
- [ ] Remove any execution commands (npm, make, cargo, npx run, etc.)
- [ ] Keep only file-inspection bash (cat, ls, find, grep, rg) if any bash is present

### 5. Fix SubagentBuilder permissions (if non-compliant)
- [ ] Add or update permission block to use `"*": deny` as default
- [ ] SubagentBuilder writes files (uses Write/Edit tools), so file-writing tools should be allowed; bash should be deny-by-default with no execution commands

### 6. Verify compliant agents (no changes needed unless broken)
- [ ] Confirm ContextScout has `bash: "*": deny` — document finding
- [ ] Confirm Architect has `bash: "*": deny` — document finding
- [ ] Confirm DeepResearcher has `bash: "*": deny` or root-level deny — document finding
- [ ] Confirm ContextInsurgent has `bash: "*": deny` — document finding
- [ ] Confirm GatesExpert has `bash: "*": deny` — document finding

---

## Scope
- **Edit:** `opencode/agents/subagents/code-writer.md`, `opencode/agents/subagents/doc-writer.md`, `opencode/agents/subagents/subagent-builder.md` (and any other non-compliant agents discovered)
- **Read:** All 8 files in `opencode/agents/subagents/`
- **Write:** Nothing new
- **Excluded:** `opencode/agents/headwrench.md`, protocol files, skill files, session plan schema

---

## Patterns

```
✅ GOOD — deny-by-default bash block
permission:
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
    "find *": allow
    "grep *": allow
    "rg *": allow

❌ BAD — ask-by-default (still allows tool use with approval, breaks unsupervised execution)
permission:
  bash:
    "*": ask
    "cat *": allow
    "npm test *": allow

❌ BAD — no default (implicit allow-all)
permission:
  bash:
    "cat *": allow
    "npm test *": allow
```

---

## Constraints
- Do NOT remove the `"*": deny` from agents that already have it
- Do NOT add bash execution permissions (npm, npx, make, cargo, yarn, pnpm, bun) to ANY agent
- Do NOT modify the agent's core behavior description or system prompt — only the permission block
- CodeWriter must retain file tool access (Read, Write, Edit, Glob, Grep) — only bash execution is being restricted
- If an agent already complies with deny-by-default, make NO changes to it

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
