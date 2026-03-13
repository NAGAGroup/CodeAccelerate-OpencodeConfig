# Subtask 02 — DCP Prompt Overrides

## Delegation
**Agent:** @CodeWriter
**Model:** standard (claude-sonnet) — requires careful prompt writing that balances specificity with not breaking existing DCP behavior; needs judgment about what to preserve vs. extend

---

## Objective

Write three DCP prompt override files to protect active subtask file reads from being compressed away during long sessions. The overrides live at `~/.config/opencode/dcp-prompts/overrides/` and extend (not replace) the default prompts with subtask-specific protection rules. Also update `dcp.jsonc` with tuned settings that encourage earlier, calmer compression rather than emergency large sweeps.

**Note:** These files have already been written as part of the planning process. This subtask exists to verify correctness, make any needed adjustments, and commit the work.

---

## Todolist

### 1. Read and verify all files written during planning
- [ ] Read `~/.config/opencode/dcp-prompts/overrides/system.md` — verify ACTIVE SUBTASK PROTECTION section is present and correct
- [ ] Read `~/.config/opencode/dcp-prompts/overrides/compress.md` — verify PROTECTED CONTENT section is present, "Do NOT compress when" list updated, verbatim-preservation rule is clear
- [ ] Read `~/.config/opencode/dcp-prompts/overrides/context-limit-nudge.md` — verify SUBTASK EXCEPTION clause is at the top and clearly gates the large-range strategy
- [ ] Read `~/.config/opencode/dcp.jsonc` — verify: `protectedFilePatterns` includes `**/subtask-*.md`, `minContextLimit` is `"20%"`, `iterationNudgeThreshold` is `8`, `nudgeForce` is `"strong"`

### 2. Cross-check override files against their defaults
- [ ] Read `~/.config/opencode/dcp-prompts/defaults/system.md` — confirm override is a superset (adds ACTIVE SUBTASK PROTECTION, does not remove anything)
- [ ] Read `~/.config/opencode/dcp-prompts/defaults/compress.md` — confirm override is a superset (adds PROTECTED CONTENT section and extends the "Do NOT compress when" list, preserves all original content)
- [ ] Read `~/.config/opencode/dcp-prompts/defaults/context-limit-nudge.md` — confirm override prepends SUBTASK EXCEPTION without removing the standard large-range strategy

### 3. Fix any issues found
- [ ] Correct any missing content, wrong wording, or structural issues in the override files
- [ ] Ensure none of the overrides accidentally removes or contradicts original default behavior

### 4. Commit
- [ ] Stage and commit all DCP files: `git add ~/.config/opencode/dcp.jsonc ~/.config/opencode/dcp-prompts/overrides/ && git commit -m "feat: add DCP prompt overrides and config tuning to protect active subtask reads"`

---

## Scope
- **Edit:** `~/.config/opencode/dcp-prompts/overrides/system.md`
- **Edit:** `~/.config/opencode/dcp-prompts/overrides/compress.md`
- **Edit:** `~/.config/opencode/dcp-prompts/overrides/context-limit-nudge.md`
- **Edit:** `~/.config/opencode/dcp.jsonc`
- **Read:** all four files above + their corresponding defaults
- **Write:** nothing new (files already exist)
- **Excluded:** All other files. Do not touch any agent definitions, protocols, or commands.

---

## Patterns

```
✅ GOOD — Override files extend the defaults: all original content preserved, new sections added
✅ GOOD — SUBTASK EXCEPTION in context-limit-nudge is the FIRST thing the model reads under pressure
✅ GOOD — compress.md override distinguishes: active subtask (off-limits) vs. completed subtask (verbatim required)
❌ BAD  — Override that replaces the default entirely (loses original behavior)
❌ BAD  — Subtask exception buried at the bottom of context-limit-nudge (won't be seen under pressure)
❌ BAD  — compress.md override that says "preserve verbatim" for active subtasks instead of "do not compress"
```

---

## Constraints
- Override files must be plain text only — no XML wrappers (per the README).
- Do not add YAML frontmatter or markdown headers to the override files — they are plain text prompt content.
- The `protectedFilePatterns` glob `**/subtask-*.md` uses the double-star to match regardless of session directory depth.
- Do not change `maxContextLimit` (60%) or `nudgeFrequency` (5) — those are already well-tuned.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
