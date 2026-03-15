# Session Plan Schema

## Overview
The HeadWrench (HW) session plan is the central source of truth for an active agent session. It defines the goal, provides the machine-readable state for the orchestrator, and maintains a living record of progress and discoveries. Session plans are stored in `.opencode/sessions/{session-name}/`.

## Directory Structure
```bash
.opencode/sessions/{session-name}/
├── index.md                  # Living plan document (human-readable)
├── spec.json                 # Machine-readable state (orchestrator-facing)
├── subtask-NN-{name}.md      # One file per subtask — loaded individually at runtime
├── notes/                    # Session-specific concept notes
└── protocols/                # (Optional) Session-specific protocol overrides
```

## index.md Specification
The `index.md` file is the high-level status document for humans and subagents. It does **not** contain agent/model assignments — those live in the individual subtask files.

### Required Sections
1. **Header**: Session name + goal (1-2 sentences).
2. **Done Criteria**: Checklist of success conditions.
3. **Subtask Table**: Minimal — three columns only:

   | # | Status | Description |
   |---|--------|-------------|
   | 01 | 🔲 pending | Short description — **Agent / model tier** |
   | 02 | 🔲 pending | Next subtask — with gate todo inside its Todolist |

   Example subtask Todolist with a gate (inside `subtask-02-*.md`):
   ```markdown
   ## Todolist
   ### 1. Do the work
   - [ ] Implement the thing
   - [ ] [🚫 GATE] User must approve findings before proceeding to subtask 03
   ```

   > **Gates are NOT subtasks.** They are `[🚫 GATE]` todo items in the preceding subtask's `## Todolist`. HeadWrench stops at checkpoint when it encounters an unresolved gate todo.

   - Status values: `🔲 pending` · `▶️ in_progress` · `✅ completed` · `⏸ blocked` · `⏭ skipped`
   - Agent/model are appended to the Description column for human readability only.

4. **Gates Section**: One subsection per gate (`### GN — Name`) explaining the stop condition and what approval is needed.
5. **Current Focus**: One-liner stating what is happening right now and what's next.
6. **Scope**: In-scope and out-of-scope lists.
7. **Patterns & Constraints**: Hard rules and invariants for the session.

## spec.json Specification
Machine-readable orchestrator state. Agent/model assignments are **not** stored here — they live in subtask files.

### Schema Definition
```json
{
  "name": "string",                 // kebab-case-session-name
  "goal": "string",                 // One sentence goal
  "created": "string",              // YYYY-MM-DD
  "status": "string",               // in_progress | pending | completed
  "currentSubtask": number,         // 0-indexed position of the next subtask to execute
  "subtaskCount": number,           // Total number of non-gate subtasks
  "circuitBreakerThreshold": number,// Max consecutive failures allowed before stopping (default: 3)
  "subtasks": [
    {
      "id": "string",               // 01, 02, GN, etc.
      "name": "string",             // kebab-case short name (matches filename slug)
      "description": "string",      // Human-readable description
      "status": "string"            // pending | in_progress | completed | blocked | skipped
    }
  ]
}
```

### Field Descriptions
- **`currentSubtask`**: The 0-indexed position of the task the orchestrator should run next. Updated at each checkpoint.
- **`subtaskCount`**: Count of executable subtasks only (gates are not counted).
- **`circuitBreakerThreshold`**: If this many consecutive subtasks fail, the session halts and escalates to the user.

## subtask-NN-{name}.md Specification
Each subtask has its own isolated file. **Only the current subtask file is loaded at runtime** — this keeps context focused. HeadWrench reads the file for the current subtask and passes it to the assigned subagent.

### Filename Convention
`subtask-NN-{name}.md` — zero-padded two-digit ID + kebab-case name slug.
Examples: `subtask-01-analyze.md`, `subtask-03-fix-compaction-hook.md`

### Required Sections

```markdown
# Subtask NN — Title

## Delegation
- **Agent:** [Agent name]
- **Model tier:** [fast / standard / deep — with specific model identifier]
- **Reason:** [Why this agent and tier for this subtask]

---

## Objective
[Clear, specific goal for this subtask — one paragraph]

---

## Todolist

### 1. [Work item group]
- [ ] Specific action
- [ ] Specific action

### N. [Final group — always ends with checkpoint]
- [ ] [last work item]

---

## Scope
- **Edit:** [files permitted to modify]
- **Read:** [files to examine]
- **Write:** [new files to create]
- **Excluded:** [explicitly off-limits]

---

## Patterns
\`\`\`
✅ GOOD — [example of correct approach]
❌ BAD  — [example of wrong approach]
\`\`\`

---

## Constraints
- [Hard rules]
- [Invariants that must not be violated]

---

## [🚫 GATE] (include only if this subtask ends at a gate)
[Stop condition and what the user must approve before the next subtask begins]

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
```

### Notes
- The checkpoint footer is **mandatory** on every subtask file.
- Gate sections are only included when the subtask immediately precedes a gate.
- The `## Patterns` section uses fenced code blocks to prevent markdown rendering of ✅/❌ lines.

## Delegation Sizing Guidelines

- **Rule of thumb (soft, not hard):** A single delegation should usually stay around ~3 files or ~500 lines of new/modified content. This is a sizing heuristic, not an absolute cap.
- **Anti-pattern to avoid:** Asking DocWriter to produce a 5000-word document in a single task invocation — split it into logical parts instead.
- **Use `task_id` to continue oversized sequential work:** If one slot's work is too large for a single invocation, run Part 1 first and capture the returned `task_id`. Resubmit Part 2 with that same `task_id` so the work continues in the same subagent session. Repeat for Part 3+ as needed.

Example (prose/pseudocode):
- Part 1 prompt: "Draft sections 1-2 of the migration guide in `docs/migration.md`; stop after section 2 and report progress."
- Result handling: "Store returned `task_id` from Part 1 as `doc_task_id`."
- Part 2 resume prompt: "Resume using `doc_task_id`; draft sections 3-4 in the same file, preserving style and terminology from Part 1."

- **Important:** The `task_id` resubmit pattern is for **sequential slicing only** (when later parts depend on earlier parts). If parts are independent and scopes do not overlap, use **parallel groups** instead.

### Parallel Delegation (Optional)
Subtasks may opt into parallel delegation when multiple agents can work simultaneously on strictly separate scopes.

Use this `## Delegation` format for parallel groups:

```markdown
## Delegation — Parallel Group
This subtask uses parallel delegation. HeadWrench launches all slots simultaneously in a single message.

### Slot A — [short description]
- **Agent:** @CodeWriter
- **Model tier:** fast
- **Scope:** [specific files/scope slice for this slot]

### Slot B — [short description]
- **Agent:** @CodeWriter
- **Model tier:** fast
- **Scope:** [specific files/scope slice for this slot]
```

Use a per-slot `## Todolist` structure:

```markdown
## Todolist

### Slot A — [description]
- [ ] Task for slot A

### Slot B — [description]
- [ ] Task for slot B
```

Rules for parallel groups:
- Slots must have explicit, non-overlapping file scopes. No two slots may edit the same file.
- Parallel group subtasks should use a `## Scope` section with clearly delineated per-slot file lists.
- The standard single-agent `## Delegation` format remains valid and unchanged. Parallel groups are opt-in.
- `## Todolist` remains the source of Layer 2 todos regardless of delegation type.

## notes/ Convention
The `notes/` directory stores session-specific discoveries.
- **Naming**: `kebab-case-topic.md`
- **Content**: One concept per file — what was found, why it matters, open questions.
- **Lifecycle**: Written during the Checkpoint Protocol when a subtask yields significant findings.

## protocols/ Convention
If present, any Markdown file here overrides the corresponding global protocol for this session.
- `protocols/checkpoint.md` — overrides `~/.config/opencode/protocols/checkpoint.md` for this session.
- Written during `/plan` finalization **only if** the user requested changes to the default checkpoint protocol.

## Context Loading

HeadWrench loads context at two moments: **session bootstrap** (when user says "start") and **compaction recovery** (when context is lost). Subagents do **not** load context — HW manages context and provides each subagent with a fully-specified, isolated prompt.

### What to Load

Follow the 5-tier model from `~/.config/opencode/protocols/context-management.md`:

| Tier | Location | Load Rule |
|------|----------|-----------|
| 1 | `~/.config/opencode/` (protocols, agents, commands) | Always loaded by the runtime |
| 2 | `~/.config/opencode/context/` (global permanent context) | Read all files with `active: true` (or no header — missing `active` = true) |
| 3 | `.opencode/context/` (local permanent context) | Read all files with `active: true` |
| 4 | `.opencode/sessions/*/notes/` | Only sessions with status `in_progress` or `pending`; skip completed/archived |
| 5 | Current `subtask-NN-*.md` | Load only the current subtask file — fresh per task |

Skip any file where `superseded_by:` is set (regardless of `active:` value).

### When to Load

- **Session Bootstrap**: After reading `spec.json`, and before creating Layer 2 todos, load Tiers 2–4.
- **Compaction Recovery**: After reconstructing from `spec.json` and loading the current subtask file, reload Tiers 2–4 before resuming work.
- **Planning** (`/plan`): ContextScout handles Tier 2–4 reading during Phase 1 (situational awareness). HW does not need to re-load independently during planning.

### What Not to Load

- **Inbox** (`.opencode/inbox/`) — write-only staging queue; never read by agents
- **Archive** (`.opencode/archive/`) — historical record; never read by agents
- **Completed session notes** — only active (in_progress/pending) session notes are loaded
- **All subtask files simultaneously** — only the current `subtask-NN-*.md` file is loaded at runtime


HeadWrench maintains a **single persistent todo item** throughout the session that serves as a compact orientation anchor — especially useful after context compaction.

### Contents
The todo must contain:
- Session name
- Session goal (one sentence)
- Path to `spec.json`: `.opencode/sessions/{name}/spec.json`
- Path to `index.md`: `.opencode/sessions/{name}/index.md`
- Current subtask number and description
- The phrase: `If context lost: read spec.json → load current subtask file → rebuild todo stack`

### Example
```
SESSION: improve-planning-system | Goal: Harden planning workflow and recovery behavior across compaction events | Spec: .opencode/sessions/improve-planning-system/spec.json | Plan: .opencode/sessions/improve-planning-system/index.md | Current: Subtask 03 — Compaction Survival | If context lost: read spec.json → load current subtask file → rebuild todo stack
```

This todo must be rich enough for HeadWrench to fully re-bootstrap session orientation without any prior chat history.

### Ownership Rules
- **HeadWrench creates** this todo during session bootstrap (plan finalization).
- **HeadWrench updates** it at every checkpoint to reflect the new current subtask.
- This todo is for HeadWrench's own orientation only. Subagents are given isolated, fully-specified single-task prompts by HW and have no awareness of session context or the todo list.

## Invariants
- **Consistency**: `spec.json` and `index.md` must be kept in sync by the Checkpoint Protocol.
- **Next Task**: `currentSubtask` always reflects the 0-indexed position of the *next* subtask to execute.
- **Subtask file isolation**: Only the current subtask file is loaded at runtime — never load all subtask files simultaneously.
- **Delegation in subtask files**: Agent and model assignments live exclusively in subtask-NN files under `## Delegation`. They are never stored in `spec.json` or `index.md`.
- **Immutability**: Completed subtask files and their todos are not modified except for retroactive notes.
- **Session summary todo**: HeadWrench owns and updates it. For HW orientation only — subagents have no awareness of it.
- **Build & Test Ownership**: Build and test steps are never assigned to CodeWriter or any subagent. HeadWrench runs them directly after implementation subtasks complete.
