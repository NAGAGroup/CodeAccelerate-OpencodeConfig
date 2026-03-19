# Subtask 02 — Rewrite context-limit-nudge.md + Write Verification Protocol

## Delegation
- **Agent:** @session-local-implementer
- **Reason:** Requires careful prose rewriting of a prompt file plus authoring a new inbox file; implementation agent is appropriate

---

## Objective

Rewrite the range strategy section of `~/.config/opencode/dcp-prompts/overrides/context-limit-nudge.md` to remove the "ONE LARGE range" mandate and replace it with a preference for multiple smaller compressions — even in emergency mode. Then write a verification checklist to `.opencode/inbox/compress-fix-verification.md` so the user can manually confirm the fix is working. The subtask protection exception and the urgency tone ("MUST compress NOW") must be kept intact.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Todolist

### 1. Read current file
- [ ] Read `~/.config/opencode/dcp-prompts/overrides/context-limit-nudge.md` in full

### 2. Rewrite range strategy section
- [ ] Identify the section that contains "Prioritize one large, closed, high-yield compression range first" (approximately lines 19–28)
- [ ] Replace that section with new text that: (a) keeps EMERGENCY urgency, (b) instructs preference for MULTIPLE SMALLER compressions rather than one large range, (c) explains why (Copilot output token limits make large summaries fail), (d) keeps the subtask protection exception unchanged
- [ ] Verify the rest of the file is unchanged (lines 1–18 and any lines after the strategy section)

### 3. Write verification protocol
- [ ] Create `.opencode/inbox/compress-fix-verification.md` with a manual testing checklist covering: (1) DCP triggers at ~45% not 60%, (2) emergency nudge produces multiple small compressions not one large, (3) no "not enough tokens" errors observed, (4) compress works within a Copilot session, (5) note to restart opencode after dcp.jsonc changes take effect

### 4. Final check
- [ ] Re-read both edited/created files to confirm correctness

---

## Scope
- **Edit:** `~/.config/opencode/dcp-prompts/overrides/context-limit-nudge.md`
- **Read:** `~/.config/opencode/dcp-prompts/overrides/context-limit-nudge.md`
- **Write:** `/home/jack/CodeAccelerate-OpencodeConfig/.opencode/inbox/compress-fix-verification.md`
- **Excluded:** Everything else — do not touch `compress.md`, `system.md`, `dcp.jsonc`, or any other file

---

## Patterns
```
✅ GOOD — Keep lines 1–18 (urgency alert + subtask protection) exactly as-is
✅ GOOD — Use Edit tool to replace only the range strategy section (lines ~19–28)
✅ GOOD — New strategy section: prefer multiple short ranges; explain Copilot token constraint
✅ GOOD — Verification file is a simple markdown checklist, not a technical deep-dive
❌ BAD  — Removing or weakening the "MUST compress NOW" urgency language
❌ BAD  — Changing or removing the subtask protection exception
❌ BAD  — Writing one large range as even a fallback option (that's the bug we're fixing)
❌ BAD  — Committing changes (HeadWrench owns all git commits)
```

---

## Constraints

**For context-limit-nudge.md:**
- Keep the urgency ("MUST use the `compress` tool now") — do not soften it
- Keep the ACTIVE SUBTASK PROTECTION section exactly as-is (the exception for subtask-NN-*.md files currently being executed)
- Remove ALL text that suggests or permits one large range as a strategy — even as a fallback
- New strategy must explicitly say: prefer multiple smaller compressions; if one range is still too large to summarize, split it further

**For verification file:**
- Write as a plain markdown checklist the user can work through manually
- Keep it short and actionable — 5–8 checklist items is enough
- Include the reminder: restart opencode after updating dcp.jsonc before testing

**General:**
- Do NOT commit any files — HeadWrench owns all git commits
- Work only on files specified in this subtask

---

## Reference: Current range strategy section (lines ~19–28 of context-limit-nudge.md)

The section to replace reads approximately:

```
## Range Strategy

Prioritize one large, closed, high-yield compression range first. This overrides the normal preference for many small compressions — in emergency mode, a single large pass frees the most context fastest.

Start from older, resolved history and capture as much stale context as safely possible in one pass. Only split into multiple smaller compressions if one large range is unsafe (e.g., it crosses an active subtask boundary).
```

Replace this entire section with new text that inverts the preference: multiple smaller ranges first, explain why (output token budget on Copilot), and do NOT offer one large range as any option.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
