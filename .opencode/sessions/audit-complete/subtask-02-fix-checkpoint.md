# Subtask 02 — fix-checkpoint

## Objective
Fix all audit findings in `checkpoint.md` and the related `headwrench.md` entries: resolve the inbox-bypass contradiction, update commit ownership to HW-owns-all, add a 4th commit case for mixed subtasks, fix the gate format check, add cross-references, add the Session Close conditional to headwrench.md Layer 3 Step 1, and add the compaction recovery warning.

## Scope

### Edit
- `opencode/protocols/checkpoint.md`
- `opencode/agents/headwrench.md`

### Excluded
- No changes to context-management.md (authoritative — leave as-is)
- No changes to any other protocol or command files

## Constraints

### checkpoint.md changes

**C-P1 (Critical) — Remove inbox bypass:**
The section around lines 100–116 contains direct-to-context write guidance ("obvious destination + clearly reusable → write directly to context/"). This CONTRADICTS context-management.md which says checkpoints always write to inbox. Remove the direct-write shortcut entirely. Keep only the inbox-writing path. The "Uncertain" path goes to inbox; ALL paths go to inbox — no exceptions.

**H-P2 (High) — Fix commit ownership:**
Step 1 currently says CodeWriter/DocWriter may own their commits. Replace with the HW-owns-all pattern:
- Case 1: Read-only subtask → stage and commit only session directory changes
- Case 2: HW-direct implementation → stage all changes, commit
- Case 3: Session-local agent implementation → verify agent did NOT commit, then stage all changes and commit
- Case 4 (NEW, H-S3): Mixed subtask (session-local agent modified files + session dir updates) → after agent completes, HW stages all modified files plus session dir, single commit

**M-P1 (Medium) — Fix gate format check (Step 7):**
Current text checks for "GN ID format" subtask — this format does not exist. Gates are `[🚫 GATE]` todo items embedded in the **preceding subtask's `## Todolist`** section. Rewrite Step 7 to: "Check Layer 2 todos for `[🚫 GATE]` items. If one exists in the current subtask's todolist that has not yet been resolved, stop and surface to user. Gates are embedded as `[🚫 GATE]` todos in the preceding subtask's `## Todolist`, never as standalone subtask rows."

**L-P2 (Low) — Add context-management.md cross-reference:**
In the Inbox Qualification Guidance section, add a reference: "See `~/.config/opencode/protocols/context-management.md` for full inbox qualification criteria, staleness rules, and archival process."

**L-P1 (Low) — Add /context-audit reference to Session Close:**
In the Session Close section, add a note: "Consider running `/context-audit` to review session notes for promotion candidates before closing."

**H-S3 (High) — 4th commit case:**
Already described above in H-P2. Add as Case 4 in Step 1.

### headwrench.md changes

**H-P1 (High) — Session Close conditional in Layer 3 Step 1:**
In the Layer 3 checkpoint todos definition, Step 1 currently describes WIP commits. Add a conditional: "Exception: if this is the FINAL subtask of the session, use the Session Close procedure (in checkpoint.md) instead of a WIP commit. Commit message format for final subtask: `feat: complete session — {session-name}`."

**H-S1 (High) — Compaction recovery warning:**
In the Compaction Recovery section, add: "Warning: if context was compacted while only a bare session ID was available (no spec.json path), recovery may fail. The spec.json path is always `.opencode/sessions/{name}/spec.json`. If you have only an ID string without a name, check `.opencode/session-ids/` for the mapping file, or ask the user for the session name."

## Todolist
- [ ] checkpoint.md: remove inbox bypass (C-P1)
- [ ] checkpoint.md: rewrite Step 1 commit cases — HW-owns-all with 4 cases (H-P2 + H-S3)
- [ ] checkpoint.md: fix Step 7 gate format check (M-P1)
- [ ] checkpoint.md: add context-management.md cross-reference in Inbox Qualification (L-P2)
- [ ] checkpoint.md: add /context-audit reference in Session Close section (L-P1)
- [ ] headwrench.md: add Session Close conditional to Layer 3 Step 1 (H-P1)
- [ ] headwrench.md: add compaction recovery warning about bare session ID (H-S1)

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — protocol prose edits requiring careful attention to contradictions
