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
   | G1 | 🚫 GATE | Gate description |

   - Status values: `🔲 pending` · `▶️ in_progress` · `✅ completed` · `🚫 GATE` · `⏸ blocked` · `⏭ skipped`
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
  "status": "string",               // in_progress | complete
  "currentSubtask": number,         // 0-indexed position of the next subtask to execute
  "subtaskCount": number,           // Total number of non-gate subtasks
  "architectEnabled": boolean,      // Whether Architect agent is available for this session
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
- **`architectEnabled`**: Set during Q&A in the `/plan` workflow. Governs whether `@Architect` may be invoked.
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

## notes/ Convention
The `notes/` directory stores session-specific discoveries.
- **Naming**: `kebab-case-topic.md`
- **Content**: One concept per file — what was found, why it matters, open questions.
- **Lifecycle**: Written during the Checkpoint Protocol when a subtask yields significant findings.

## protocols/ Convention
If present, any Markdown file here overrides the corresponding global protocol for this session.
- `protocols/checkpoint.md` — overrides `~/.config/opencode/protocols/checkpoint.md` for this session.
- Written during `/plan` finalization **only if** the user requested changes to the default checkpoint protocol.

## Session Summary Todo
HeadWrench maintains a **single persistent todo item** throughout the session that serves as a compact orientation anchor — especially useful after context compaction.

### Contents
The todo must contain:
- Session name
- Session goal (one sentence)
- Path to `index.md`: `.opencode/sessions/{name}/index.md`
- Current subtask number and description

### Example
```
SESSION: fix-plan-schema-and-workflow | Goal: Align docs with real session format | Plan: .opencode/sessions/fix-plan-schema-and-workflow/index.md | Current: Subtask 02 — Update plan-workflow.md + plan.md
```

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
