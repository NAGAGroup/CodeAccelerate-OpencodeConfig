# plan-end.md — Plan Finalization

Finalization steps run after the type-specific plan is drafted and user-approved. These steps are shared across all session types.

## Step 1 — Write Session Files

Write all session files to `.opencode/sessions/{name}/`:

- `index.md` — session name, goal, status, subtask table
- `spec.json` — full session spec (session name, status, goal, currentSubtask: 1, totalSubtasks, circuitBreaker, consecutiveFailures: 0, createdAt, subtasks array)
- `subtask-NN-{name}.md` — one file per subtask, each with fully populated `## Objective`, `## Scope`, `## Constraints`, `## Todolist`, and `## Delegation` sections

All `## Delegation` sections must already be filled in before writing. Do not leave `TBD` in any delegation field.

## Step 2 — Activate Session

Call the `activate_session` tool with the session name. This registers the session as the active session for the current opencode session.

## Step 3 — Session-Local Agent Creation

Load the **agent-writer skill** (`~/.config/opencode/skills/agent-writer/SKILL.md`).

For each subtask that requires implementation or documentation work:
1. Check if a suitable session-local agent already exists in `.opencode/agents/`
2. If not, use the agent-writer skill to create one at `.opencode/agents/{name}.md`
3. Write `PLACEHOLDER_MODEL_ID` in the agent's `model:` frontmatter field
4. Populate all permission fields according to the agent's role (use the permission templates in the agent-writer skill)

After creating all agents, tell the user:

> "Before running 'start', update `PLACEHOLDER_MODEL_ID` in `.opencode/agents/{name}.md` with your preferred model. Restart opencode after updating."

If no session-local agents were created (all subtasks are HW-direct or read-only), skip this step.

## Step 4 — Commit the Plan

```bash
git add .opencode/sessions/{name}/
git commit -m "plan: add session {name}"
```

If session-local agents were created, also stage them:

```bash
git add .opencode/agents/{name}.md
```

## Step 5 — Present Final Overview

Present a summary to the user:

- Subtask list (number, name, delegation assignment)
- Gate locations (which subtasks have `[🚫 GATE]` items)
- Session-local agents created (names, what they handle)
- The `PLACEHOLDER_MODEL_ID` warning if any agents were created
- Next step: "Run 'start' when ready to begin execution."
