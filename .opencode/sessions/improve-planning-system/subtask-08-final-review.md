# Subtask 07 — Final Review + Polish Pass

## Delegation
**Agent:** @DocWriter
**Model:** fast (claude-haiku) — documentation review and consistency fixes; clear scope, no complex judgment

---

## Objective

Perform a cross-file consistency check and polish pass across all files modified in this session. Verify that cross-references are accurate, terminology is consistent, no file contradicts another, and all new sections are well-integrated. Fix any inconsistencies, broken references, or clarity issues found.

---

## Todolist

### 1. Read all modified files
- [ ] Read `~/.config/opencode/commands/amend.md` (subtask 01)
- [ ] Read `~/.config/opencode/protocols/session-plan-schema.md` (subtasks 02, 03, 04)
- [ ] Read `~/.config/opencode/agents/headwrench.md` (subtasks 02, 03, 04, 05)
- [ ] Read `~/.config/opencode/protocols/checkpoint.md` (subtasks 02, 05)
- [ ] Read `~/.config/opencode/agents/subagents/code-writer.md` (subtask 05)
- [ ] Read `~/.config/opencode/agents/subagents/doc-writer.md` (subtask 05)
- [ ] Read `~/.config/opencode/commands/plan.md` (subtask 06)
- [ ] Read `~/.config/opencode/protocols/plan-workflow.md` (subtask 06)

### 2. Cross-file consistency check
- [ ] Verify that `plan.md` and `plan-workflow.md` phase/step numbers and descriptions are aligned
- [ ] Verify that `checkpoint.md` agent commit rules match what `code-writer.md` and `doc-writer.md` say
- [ ] Verify that `headwrench.md` commit ownership section is consistent with `checkpoint.md` step 1
- [ ] Verify that parallel group syntax in `session-plan-schema.md` is referenced correctly in `headwrench.md`
- [ ] Verify that task sizing guidelines in `session-plan-schema.md` are reflected in `headwrench.md` prompting section
- [ ] Verify that the compaction recovery procedure in `headwrench.md` is consistent with session summary todo format in `session-plan-schema.md`
- [ ] Verify that `amend.md` references correct protocol files and uses correct terminology

### 3. Apply fixes
- [ ] Fix any broken cross-references (wrong file paths, wrong section names)
- [ ] Fix any contradictory rules between files
- [ ] Fix any unclear or ambiguous language found during review
- [ ] Ensure new sections have consistent heading levels with their surrounding context

### 4. Commit
- [ ] Stage and commit any fixes: `git add -A && git commit -m "docs: final consistency pass — fix cross-references and polish across all modified files"`
- [ ] If no changes were needed, make a note and skip the commit

---

## Scope
- **Edit:** Any of the 8 files listed in the Read section above, only to fix inconsistencies
- **Read:** All 8 files listed above
- **Write:** nothing new
- **Excluded:** All other files not listed. Do not add new features — this is a polish pass only.

---

## Patterns

```
✅ GOOD — Only fixing actual inconsistencies; not rewriting content for style preferences
✅ GOOD — Changes are minimal and targeted — broken reference → correct reference
❌ BAD  — Rewriting sections that are functionally correct but could be "better"
❌ BAD  — Adding new features or sections during the review pass
❌ BAD  — Skipping the review because "it looks fine" — actually read each file carefully
```

---

## Constraints
- This is a polish and consistency pass only — do not add new features or redesign any section.
- If a genuine design inconsistency is found that requires more than a wording fix, note it as a follow-up recommendation rather than changing the design.
- All file paths must use `~/.config/opencode/` prefix format, not relative paths.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
