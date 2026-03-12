# Subtask 03 — Update SubagentBuilder Definition

## Delegation
- **Agent:** @DocWriter
- **Model tier:** fast (haiku) — targeted instruction additions to an existing agent definition; clear scope
- **Reason:** This is a documentation/prose update to an agent definition file. DocWriter handles markdown/instruction file edits cleanly.

---

## Objective

Update the SubagentBuilder agent definition file to do two things:

1. **Fix SubagentBuilder's own permission block** — ensure it uses deny-by-default for any bash access it may have.

2. **Add an explicit instruction** to SubagentBuilder's system prompt/instructions telling it to always generate deny-by-default permission blocks (`"*": deny` as the first entry) in any agent it creates. Without this instruction, SubagentBuilder may generate new agents with allow-list or ask-by-default permissions, perpetuating the problem we're fixing in this session.

---

## Todolist

### 1. Read SubagentBuilder definition
- [ ] Read `opencode/agents/subagents/subagent-builder.md` in full

### 2. Fix SubagentBuilder's own permission block
- [ ] Verify whether the permission block uses deny-by-default
- [ ] If not: update it to use `"*": deny` as the bash default
- [ ] SubagentBuilder uses Write/Edit tools to create agent files — those tool permissions should remain; only bash needs the deny-default

### 3. Add deny-by-default generation instruction
- [ ] In the SubagentBuilder's instructions/system prompt section, add explicit guidance:
  - Any agent it generates must have `"*": deny` as the first entry in each permission category
  - Provide the canonical deny-by-default template it should use when writing permission blocks
  - Note that HeadWrench is the executor — subagents should never have npm/make/cargo/build/test bash

### 4. Ensure instruction placement is natural
- [ ] The new instruction should be placed in a logical location (e.g., after "how to write the agent spec" guidance, or in a "Permission Rules" subsection)
- [ ] It should be clear, not buried

---

## Scope
- **Edit:** `opencode/agents/subagents/subagent-builder.md`
- **Read:** `opencode/agents/subagents/subagent-builder.md`
- **Write:** Nothing new
- **Excluded:** All other agent files (handled in Subtask 01), skill files (handled in Subtask 02), protocol files

---

## Patterns

```
✅ GOOD — Instruction is explicit: "All generated agents MUST use deny-by-default permissions"
✅ GOOD — Canonical template is included so SubagentBuilder copies the exact pattern
✅ GOOD — Permission block fix uses same pattern as other agents: bash: "*": deny

❌ BAD — Vague: "Use secure permissions" (no template, no enforcement)
❌ BAD — Only fixing the permission block but not the generation instructions (future agents will still be broken)
```

---

## Constraints
- Do NOT change SubagentBuilder's core behavior, output format, or agent creation workflow
- The deny-by-default instruction must be clearly separated from existing instructions (not buried in a paragraph)
- If SubagentBuilder's current permission block already uses deny-by-default, only add the generation instruction (no redundant permission changes)

---

## [🚫 GATE] — User Reviews Before Push

**Stop condition:** All three implementation subtasks (01, 02, 03) are complete. Agent permission blocks have been fixed, the delegation skill has been updated, and SubagentBuilder has been updated.

**HeadWrench must:**
1. Run `git diff HEAD` to show all changes since planning commit
2. Show the user a summary of every file changed and what changed in each
3. Wait for explicit approval before proceeding to push

**Approval needed:** User explicitly says to push / approves the changes.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
