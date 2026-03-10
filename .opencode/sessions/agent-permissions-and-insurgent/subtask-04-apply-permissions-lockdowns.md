# Subtask 04 — Apply Permissions Lockdowns

## Delegation
- **Agent:** @DocWriter
- **Model tier:** fast (github-copilot/claude-haiku-4.5)
- **Reason:** Applying pre-approved YAML frontmatter edits to multiple agent `.md` files. Clear spec from gate decisions, known patterns (YAML permission blocks). No code, no judgment — follow the approved changes exactly.

---

## Objective

Apply any approved permissions lockdowns from the audit findings (Gate G1). Edit each agent file's permission frontmatter to match the approved changes.

**Updated context (post-audit):** The `agent-delegation-expert` subagent no longer exists (removed in a prior session — only the skill remains). The audit's one concrete finding (`task: deny` missing on that subagent) is therefore moot. As of G1, the audit found **zero required changes** to any live agent file. This subtask will only have work to do if the user decides at G1 to apply additional lockdowns beyond what the audit flagged.

**Note:** HeadWrench will inject the approved lockdown list into the subagent's prompt at execution time, based on what the user approved at G1. The Todolist below is the template — actual items will be specific to each approved change.

---

## Todolist

### 1. Read approved changes from gate notes
- [ ] Read `notes/permissions-audit.md` for approved changes
- [ ] Read `notes/gate-g1-decisions.md` for user's specific approval decisions (HeadWrench writes this at G1)

### 2. Apply lockdowns to each affected agent file
*(Specific items to be added by HeadWrench based on G1 approval)*
- [ ] [Populated at G1 gate by HeadWrench]

### 3. Verify each change
- [ ] Read back each modified agent file to confirm frontmatter is valid YAML
- [ ] Confirm no unintended whitespace or formatting changes

---

## Scope
- **Edit:** Any agent `.md` files with approved lockdown changes (specific files TBD at G1)
- **Read:** `notes/permissions-audit.md`, `notes/gate-g1-decisions.md`, all affected agent files
- **Excluded:** `opencode.json` (unless an opencode.json-level permission override is approved), protocols, commands, session files

---

## Patterns
```
✅ GOOD — Explicit deny: "bash: '*': deny" rather than omitting bash block entirely
❌ BAD  — Removing a bash allowlist entry that the agent legitimately needs

✅ GOOD — Adding missing "task: deny" to subagents that lack it (if any such gap is found and approved)
❌ BAD  — Adding "task: deny" to headwrench.md (HW is primary, needs task for delegation)

✅ GOOD — Keep existing correct permissions unchanged — only touch what the audit flagged
❌ BAD  — Reformatting the entire frontmatter block (creates noisy diffs)
```

---

## Constraints
- ONLY apply changes that were explicitly approved at Gate G1 — do not improvise additional lockdowns
- Do NOT modify HeadWrench's permission block without explicit user approval — it's a primary agent with different defaults
- Preserve all non-permission content in agent files unchanged
- YAML frontmatter must remain valid — malformed frontmatter will break the agent
- If the audit found no issues with an agent, leave it completely unchanged

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
