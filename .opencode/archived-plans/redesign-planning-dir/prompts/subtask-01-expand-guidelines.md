<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask ST01: Expand plan-design-guidelines.md with Schema Clarifications

## Objective

Expand `files/planning/plan-design-guidelines.md` to resolve 5 specific clarity gaps in the schema reference section and add missing practical guidance. The expanded sections will serve as the foundation for all subsequent boilerplate cleanup and DAG rebuilds.

## Scope

**File to edit:** `/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-design-guidelines.md`

**Sections to add/expand:**

1. **`next` Field Type Clarification** (new subsection after line 405)
   - Current state: Line 406 documents that `next` can be "string, object, or undefined" but no example shows when to use string shorthand
   - Add a 10-line subsection explaining:
     - When to use string shorthand: `"next": "node-id"` (single deterministic next node)
     - When to use object notation: `"next": { "branch1": { "desc": "...", "choose_when": "..." }, ... }` (gate or agent with multiple exits)
     - Example: String shorthand for a clarify node; object for a gate node
   - Reference: This appears to be implicit in the schema but never explicitly taught

2. **`progress` Object Initialization** (new subsection after line 381)
   - Current state: `progress` is documented as runtime fields, but unclear if it exists in initial plan.json
   - Add a 5-line clarification:
     - `progress` does **not** exist in initial plan.json; plugin creates it on first execution
     - Initial state: `{ current_node: entry, started_at: <timestamp>, updated_at: <timestamp>, completed_at: null }`
     - Only the top-level plan has progress; nodes have only `status` and `completed_at`

3. **Status Enumeration** (new subsection after line 369)
   - Current state: Only "ready" is mentioned; "failed" is mentioned at line 499 but no complete enum
   - Add a 12-line table showing all valid `status` values:
     - Top-level: `"ready"` (initial), `"running"` (session started), `"paused"` (at gate), `"completed"` (terminal reached), `"failed"` (loop exhausted)
     - Per-node: `"pending"` (not yet started), `"running"` (agent executing), `"completed"` (agent finished, not yet advanced), `"waiting"` (gate node, user decision pending)
   - Clarify that status transitions happen via plugin at runtime; agents don't set status directly

4. **Session Plan File Storage Convention** (new subsection after line 251)
   - Current state: No guidance on directory structure or file naming
   - Add a 15-line subsection covering:
     - Root: `.opencode/session-plans/{session-name}/`
     - Contents: `plan.json` (root), `prompts/` (all prompt files), `artifacts/` (optional, for generated specs/reports)
     - File naming: `prompts/session-overview.md`, `prompts/subtask-NN-{name}.md`, `prompts/{node-id}.md` for other nodes
     - Path resolution: Absolute paths work; worktree-relative paths should use `./` prefix; home-relative not recommended in session plans
     - Example directory tree

5. **Error Handling in Nodes** (new subsection at end of "Prompt Strictness Standards" section, after line 341)
   - Current state: No guidance on node-level error handling
   - Add a 12-line subsection covering:
     - Agents should not catch exceptions; let them bubble up to the plugin
     - Nodes that fail tool calls should re-attempt or call `next_step()` with no args to advance (plugin will log the error)
     - Gate nodes should re-prompt user if input is invalid; agent nodes should re-run the failing tool up to 3 times before giving up
     - Loop nodes should NOT attempt recovery; let the loop counter handle re-attempts
     - Example: An agent fails to read a file; re-attempt with `bash` instead of `read` tool, then advance if both fail

## Constraints

- You MUST NOT reorder existing sections or move lines around
- You MUST preserve all existing content verbatim
- New subsections must follow the style and formatting of existing sections (heading level, bullet style, code fence style)
- You MUST NOT add examples that contradict or duplicate existing examples in the document
- All new text must be written in 2nd-person imperative voice (same as existing guidelines)

## Delegation

**Agent:** @QuickDoc (haiku)

**Files to edit:**
- `/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-design-guidelines.md`

**Goal:** Add 5 new subsections to the schema reference and strictness standards sections. Each subsection should resolve one specific clarity gap identified in the discovery phase.

**Constraints:**
- Preserve all existing content and formatting
- Follow existing style (headings, bullets, code fences)
- No contradictions or duplication with existing sections
- Write in 2nd-person imperative voice
- Use exact line numbers from the compressed context to locate insertion points

**Verify:** After editing, the file should have 5 new subsections covering `next` polymorphism, `progress` initialization, status enumeration, file storage conventions, and error handling. All existing content remains intact.

## Advance

Call `next_step()` when this subtask is complete. Do this exactly once.

