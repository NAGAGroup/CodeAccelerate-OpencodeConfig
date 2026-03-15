# Subtask 05 — fix-schema-and-context-management

## Objective
Fix audit findings in session-plan-schema.md (remove dead architectEnabled field, fix status values, fix gate representation) and context-management.md (document promoted_from:direct, add Conflict Resolution cross-reference, normalize paths). Also add the Conflict Resolution reference to headwrench.md.

## Scope

### Edit
- `opencode/protocols/session-plan-schema.md`
- `opencode/protocols/context-management.md`
- `opencode/agents/headwrench.md`

### Excluded
- No structural changes to either protocol — additions and targeted fixes only
- No changes to command files

## Constraints

### session-plan-schema.md changes

**M-A2/C-P4 (Medium/Critical) — Remove architectEnabled field:**
The `spec.json` schema definition includes an `architectEnabled` boolean field. Architect has been deleted. Remove this field from the schema definition and from any spec.json examples in the document.

**M-P3 (Medium) — Fix status field values:**
The `status` field definition currently says `"in_progress | complete"`. Fix to: `"in_progress | pending | completed"` (add `pending`, rename `complete` → `completed`). Update any example JSON that shows `"status": "complete"`.

**M-P4 (Medium) — Fix gate representation in example table:**
The example subtask table shows `🚫 GATE` as a standalone row (a subtask unto itself). This is wrong — gates are `[🚫 GATE]` todo items embedded inside the **preceding subtask's `## Todolist`**, never standalone rows. Fix the example to show a subtask with a `[🚫 GATE]` item in its Todolist rather than a standalone gate row. Add a note: "Gates are NOT subtasks. They are `[🚫 GATE]` todo items in the preceding subtask's `## Todolist`. HeadWrench stops at checkpoint when it encounters an unresolved gate todo."

### context-management.md changes

**M-P10 (Medium) — Document promoted_from:direct:**
The YAML header fields section documents `promoted_from: inbox` but not `promoted_from: direct`. Add: "`promoted_from: direct` — used when a context file was written directly (not promoted from inbox), typically during session bootstrap, checkpoint, or when HW writes a context file as part of a session plan."

**H-P6 (High) — Add Conflict Resolution cross-reference:**
The Conflict Resolution section (which resolves precedence when context files disagree) exists in context-management.md but nothing links to it. Add an explicit self-referencing note at the top of the document: "See the **Conflict Resolution** section below for rules on handling contradictions between context files at different tiers."

Also: add a note in the inbox destination guidance that says "When in doubt, write to inbox — never directly to context/ without human review."

**Path normalization:**
Replace any occurrences of relative paths like `opencode/protocols/` with `~/.config/opencode/protocols/` throughout the document.

### headwrench.md changes

**H-P6 related — Add Conflict Resolution reference:**
In the context loading section (Session Bootstrap or wherever context loading is described), add: "If loaded context files appear to contradict each other, apply the Conflict Resolution rules in `~/.config/opencode/protocols/context-management.md`."

## Todolist
- [ ] session-plan-schema.md: remove architectEnabled field from spec.json schema (M-A2/C-P4)
- [ ] session-plan-schema.md: fix status field values → in_progress | pending | completed (M-P3)
- [ ] session-plan-schema.md: fix gate representation in example table (M-P4)
- [ ] context-management.md: document promoted_from:direct (M-P10)
- [ ] context-management.md: add Conflict Resolution cross-reference at top (H-P6)
- [ ] context-management.md: add "when in doubt, write to inbox" note
- [ ] context-management.md: normalize paths to ~/.config/opencode/
- [ ] headwrench.md: add Conflict Resolution reference in context loading section

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — schema and protocol prose edits
