# generic

## When to use

When no other node template fits. Use as an escape hatch for unusual node patterns — custom tool sequences, one-off combinations, or experimental flows. Document the rationale clearly in the node prompt.

## What it does

No fixed todo — the planning agent defines the todo array freely. The node can call any combination of tools in any order.

## What the planning agent must resolve

- **Todo sequence** — What tools should HW call, in what order? List them explicitly.
- **Rationale** — Why doesn't a standard node template fit this situation?
- **Each step** — For each item in the todo array, what exactly should HW do?
- **Success criteria** — How does HW know this node is done?

## Node ID

Always rename — `generic` is not a meaningful node name. Use a descriptive ID: `audit-registry`, `patch-schema`, `migrate-files`.

## Notes

- The `generic/plan.json` ships with `"todo": []` — the planning agent fills this in when writing the actual node
- If you find yourself using this node frequently for a particular pattern, consider proposing it as a new named template
- Valid todo items: any OpenCode tool name (`task`, `bash`, `question`), or MCP tool names like `sequential-thinking_sequentialthinking`
