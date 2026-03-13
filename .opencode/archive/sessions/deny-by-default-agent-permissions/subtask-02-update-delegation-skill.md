# Subtask 02 — Update Delegation Skill with Permission Patterns

## Delegation
- **Agent:** @DocWriter
- **Model tier:** fast (haiku) — clear prose writing task; adding a well-specified new section to an existing skill file
- **Reason:** This is a documentation/prose writing task. The content to write is well-specified. DocWriter is the correct agent for skill/doc file updates.

---

## Objective

Add a new **"Permission Patterns"** section to the agent-delegation-expert skill file at `opencode/skills/agent-delegation-expert/SKILL.md`. This section must document the deny-by-default policy, provide the correct YAML template for different agent types, show common mistakes, and explain that CodeWriter is limited to read-only bash.

The skill currently only covers agent/model assignment routing — it says nothing about permission patterns. Future custom agents created by SubagentBuilder (and any human who edits agent files) need clear guidance on the correct permission model.

---

## Todolist

### 1. Read the current skill file
- [ ] Read `opencode/skills/agent-delegation-expert/SKILL.md` in full

### 2. Draft the new Permission Patterns section
The section must cover:
- [ ] The deny-by-default principle (why `"*": deny` is required, not `"*": ask`)
- [ ] Template for read-only agents (ContextScout, Architect pattern)
- [ ] Template for implementation agents (CodeWriter pattern — read-only bash + file tools)
- [ ] Template for specialized-tool agents (DeepResearcher, ContextInsurgent pattern)
- [ ] Common mistakes table (what NOT to do)
- [ ] A note that HeadWrench is the only executor — no subagent should have npm/make/cargo/build/test bash

### 3. Insert the section into the skill file
- [ ] Place the new section after the existing "Decision Table" and before "Custom Agents — When and How"
- [ ] Ensure the section uses proper markdown headers consistent with the rest of the file

---

## Scope
- **Edit:** `opencode/skills/agent-delegation-expert/SKILL.md`
- **Read:** `opencode/skills/agent-delegation-expert/SKILL.md`
- **Write:** Nothing new
- **Excluded:** All agent definition files (those were handled in Subtask 01), protocol files, session files

---

## Patterns

```
✅ GOOD — Section uses concrete YAML examples with ✅/❌ markers in a code block (to prevent markdown rendering issues)
✅ GOOD — Section is self-contained and can be read independently
✅ GOOD — Explicit statement: "HeadWrench is the only executor; no subagent should have bash execution permissions"

❌ BAD — Vague prose with no examples ("use deny-by-default" with no template)
❌ BAD — Overly long section that buries the key rule
```

---

## Constraints
- Do NOT modify the existing sections of the skill (Agent Routing Rules, Model Tier Rules, Decision Table, Custom Agents, Output Format)
- The new section must be inserted — not appended at the end and not prepended at the top
- Use consistent header level (##) with the rest of the file
- Keep the section concise — it should be skimmable, not a full tutorial

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
