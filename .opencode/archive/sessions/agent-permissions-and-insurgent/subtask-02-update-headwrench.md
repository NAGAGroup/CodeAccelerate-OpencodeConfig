# Subtask 02 — Update HeadWrench Delegation Rules and Debug Loop

## Delegation
- **Agent:** @DocWriter
- **Model tier:** fast (github-copilot/claude-haiku-4.5)
- **Reason:** Surgical markdown edits to one file with a clear spec — remove @explorer references, add ContextInsurgent bullet, update one step in the debug loop. Unambiguous changes, no code.

---

## Objective

Update `opencode/agents/headwrench.md` to:
1. Remove all references to `@explorer` from the Delegation Rules section
2. Add `@ContextInsurgent` to the delegation rules with explicit ask-only guidance (HW must use `question` tool before each invocation)
3. Update the Build-Test-Debug Loop section to reference `@ContextScout` and `@ContextInsurgent` instead of `@explorer`
4. Update the `## What You Don't Do` section if needed

Also update the `headwrench.md` file that lives in `opencode/agents/headwrench.md` (the source file). The symlinked version at `~/.config/opencode/agents/headwrench.md` will update automatically.

---

## Todolist

### 1. Update Delegation Rules section
- [ ] Remove the `@explorer` bullet: `- **@explorer** — quick codebase searches during debug loops`
- [ ] Add `@ContextInsurgent` bullet after `@ContextScout`:
  `- **@ContextInsurgent** — complex, multi-file project exploration requiring deep analysis or sequential reasoning. **Ask-only**: always invoke the \`question\` tool to get user confirmation before delegating to ContextInsurgent.`

### 2. Update Build-Test-Debug Loop section
- [ ] Replace step 2: `Delegate to **@explorer** to locate relevant code`
  with: `Delegate to **@ContextScout** (or **@ContextInsurgent** if deep analysis is needed — ask user first) to locate relevant code`

### 3. Verify no remaining @explorer references
- [ ] Search headwrench.md for any remaining "explorer" text and remove/replace
- [ ] Read back the full file to confirm changes are correct

---

## Scope
- **Edit:** `opencode/agents/headwrench.md` only
- **Read:** `opencode/agents/headwrench.md` (must read before editing)
- **Excluded:** All other agent files, all protocols, all session files

---

## Patterns
```
✅ GOOD — "ask user via question tool before delegating to @ContextInsurgent"
❌ BAD  — "delegate to @ContextInsurgent for deep exploration" (no ask-gate mentioned)

✅ GOOD — ContextScout for routine searches, ContextInsurgent for deep/complex exploration
❌ BAD  — replacing @explorer with @ContextInsurgent for ALL searches (ContextScout is preferred for routine work)
```

---

## Constraints
- Do NOT modify the checkpoint protocol sections or session bootstrap sections
- Do NOT add `task: ask` to HeadWrench's frontmatter permission block (that would gate all delegations, not just ContextInsurgent)
- The ask-only enforcement for ContextInsurgent is done via HW's instruction text ("use `question` tool first"), not via the permission system
- Preserve all other HeadWrench content unchanged — this is a surgical update to delegation rules only

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
