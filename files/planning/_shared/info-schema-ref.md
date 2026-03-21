# Info: Plan.json Schema Reference — {{DAG_TYPE}}

Reminder of the plan.json structure you must produce.

## Top-Level Required Fields

```json
{
  "schema_version": "1.0",
  "id": "session-name",
  "session_type": "plan-generic | plan-debug | plan-collaborative | plan-deep-research | plan-deep-review",
  "status": "ready",
  "entry": "session-overview",
  "nodes": { ... }
}
```

## Node Types

| Type | Purpose |
|------|---------|
| `"agent"` | LLM executes this step |
| `"gate"` | Waits for user approval |

## Node Fields

```json
{
  "id": "node-id",
  "type": "agent | gate",
  "prompt": "path/to/prompt.md",
  "next": {
    "next-node-id": {
      "desc": "Description",
      "choose_when": "When to take this branch"
    }
  },
  "remaining_visits": 3
}
```

## Key Rules

1. **Entry node**: Always `"session-overview"`
2. **Terminal nodes**: No `next` field
3. **Loop nodes**: `remaining_visits` on decision node (default: 3)
4. **Gate nodes**: `type: "gate"` and user approval required
5. **Last node in plan**: Must have NO `next` field

## Path Resolution

Prompt paths resolve in this order:
1. Absolute: `/foo/bar`
2. Home-relative: `~/foo/bar`
3. Worktree-relative: `foo/bar` or `.opencode/session-plans/...`

For built-in plans, use `planning/plan-type/prompts/...`
For session plans, use `.opencode/session-plans/...`

## Advance

Call `next_step()` to proceed to validity checks.
