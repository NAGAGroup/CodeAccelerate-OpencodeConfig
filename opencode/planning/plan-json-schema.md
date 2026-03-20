# plan.json Schema Reference

This is the canonical schema for all `plan.json` execution DAG files produced by planning sessions.

## Top-Level Fields

```json
{
  "schema_version": "1.0",
  "id": "{session-name}",
  "session_type": "plan-generic | plan-debug | plan-collaborative",
  "goal": "{one-sentence goal — optional but recommended}",
  "created": "{today YYYY-MM-DD}",
  "status": "ready",
  "entry": "session-overview",
  "nodes": { ... }
}
```

| Field | Required | Description |
|---|---|---|
| `schema_version` | ✅ | Always `"1.0"` |
| `id` | ✅ | Matches the session name (directory name under `.opencode/session-plans/`) |
| `session_type` | ✅ | One of `plan-generic`, `plan-debug`, `plan-collaborative` |
| `goal` | optional | Human-readable goal statement |
| `created` | optional | ISO date `YYYY-MM-DD` |
| `status` | ✅ | Set to `"ready"` when writing the plan |
| `entry` | ✅ | ID of the first node to execute — always `"session-overview"` |
| `nodes` | ✅ | Map of node ID → DagNode |

## Node Fields

```json
{
  "id": "my-node",
  "type": "agent",
  "prompt": ".opencode/session-plans/{session-name}/prompts/my-node.md",
  "next": "next-node-id",
  "remaining_visits": 3
}
```

| Field | Required | Description |
|---|---|---|
| `id` | ✅ | Unique node identifier — must match its key in `nodes` |
| `type` | ✅ | `"agent"` (LLM executes) or `"gate"` (waits for user approval) |
| `prompt` | ✅ | Path to the prompt file — see Path Resolution below |
| `next` | optional | Omit for terminal nodes. String for single next, array for branching. |
| `remaining_visits` | optional | Loop counter — see Loop Nodes below |

## Path Resolution

Prompt paths are resolved in this order:
1. **Absolute path** (`/foo/bar`) — used as-is
2. **Home-relative** (`~/foo/bar`) — `~` expanded to `$HOME`
3. **Worktree-relative** (`foo/bar`) — resolved relative to the repository root

Use worktree-relative paths for session plan prompts:
```
.opencode/session-plans/{session-name}/prompts/my-node.md
```

Use home-relative paths for shared planning infrastructure prompts:
```
~/.config/opencode/planning/...
```

## Terminal Nodes

A node with no `next` field is terminal. When `next_step()` is called on a terminal node, the DAG transitions to `complete` and instructs the agent to call `close_session()`.

## Loop Nodes

A node whose `next` array includes its own ID (or a prior node ID) is a loop node. Add `remaining_visits` to cap the loop:

```json
"diagnose": {
  "id": "diagnose",
  "type": "agent",
  "prompt": "...",
  "next": ["diagnose", "fix"],
  "remaining_visits": 3
}
```

- Each `next_step()` call on this node decrements `remaining_visits` by 1
- When `remaining_visits` reaches 0, the DAG transitions to `failed`
- **Default**: `remaining_visits: 3` — use this unless the user specifies otherwise during decompose
- **Recovery**: if the DAG enters `failed` state, surface this to the user and ask whether to continue and with how many additional visits (default: 3). If they confirm, call `reset_counters({ visits: N })` to restore the counter and resume

## Gate Nodes

Gate nodes pause execution and wait for explicit user approval before advancing:

```json
"review-gate": {
  "id": "review-gate",
  "type": "gate",
  "prompt": "...",
  "next": ["approved-branch", "rejected-branch"]
}
```

The agent presents findings, waits for user input, then calls `next_step({ next: "chosen-branch-id" })`.

## Minimal Example

```json
{
  "schema_version": "1.0",
  "id": "my-feature",
  "session_type": "plan-generic",
  "goal": "Add dark mode toggle to settings",
  "created": "2026-03-20",
  "status": "ready",
  "entry": "session-overview",
  "nodes": {
    "session-overview": {
      "id": "session-overview",
      "type": "agent",
      "prompt": ".opencode/session-plans/my-feature/prompts/session-overview.md",
      "next": "subtask-01-add-toggle"
    },
    "subtask-01-add-toggle": {
      "id": "subtask-01-add-toggle",
      "type": "agent",
      "prompt": ".opencode/session-plans/my-feature/prompts/subtask-01-add-toggle.md"
    }
  }
}
```
