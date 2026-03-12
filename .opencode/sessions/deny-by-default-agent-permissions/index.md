# Session: deny-by-default-agent-permissions

**Goal:** Enforce deny-by-default tool permissions across all subagent definitions so agents cannot attempt tools they're not explicitly permitted to use, enabling safe unsupervised execution.

---

## Done Criteria

- [ ] All 8 agent files use deny-by-default (`"*": deny` as first permission entry)
- [ ] CodeWriter has no test/build/format bash permissions — read-only bash only (cat, ls, find, grep, rg)
- [ ] `agent-delegation-expert` skill documents the deny-by-default pattern with examples
- [ ] SubagentBuilder is updated to generate deny-by-default permission blocks in any agent it creates
- [ ] All changes committed and pushed to `main`

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ done | Fix agent permission blocks — @CodeWriter / standard |
| 02 | ✅ done | Update delegation skill with permission patterns — @DocWriter / fast |
| 03 | ✅ done | Update SubagentBuilder definition — @DocWriter / fast |
| G1 | ✅ done | User reviews all changed files before push |
| 04 | ✅ done | Push to main — HeadWrench / direct |

---

## Gates

### G1 — Review Before Push

**Stop condition:** All agent permission blocks have been updated to deny-by-default. The delegation skill and SubagentBuilder definition have been updated. HeadWrench stops here and surfaces all diffs for user review.

**Approval needed:** Explicit user approval of all changes before `git push origin main`.

---

## Current Focus

**Session complete.** All subtasks done, changes pushed to main.

---

## Scope

**In scope:**
- All 8 agent definition files in `opencode/agents/subagents/`
- `opencode/skills/agent-delegation-expert/SKILL.md`
- SubagentBuilder agent definition file
- Commits to `main` branch

**Out of scope:**
- `opencode/agents/headwrench.md` (orchestrator, not a restricted subagent)
- Protocol files
- Session plan schema
- Any code outside the OpenCode config repo

---

## Patterns & Constraints

- **Deny-by-default pattern:** Every agent permission block must start with `"*": deny` before any explicit allows
- **CodeWriter bash:** Read-only only — `cat`, `ls`, `find`, `grep`, `rg`. No execution commands.
- **No build/test delegation:** HeadWrench owns all bash execution — no subtask here assigns build/test to any subagent
- **Direct commit to `main`:** No feature branch for this session (user decision)
- **Circuit breaker:** 3 consecutive failures
