# sequential-thinking

## When to use

When HeadWrench needs to reason through a non-obvious decision before acting — architectural choices, debug hypotheses, scope trade-offs, or complex decompositions. Use before a branch node or before a high-stakes action.

## What it does

HW calls the `sequential-thinking` MCP tool directly (no agent dispatch). The tool steps through a structured reasoning process. Output is HW's conclusion, which feeds the next node.

## What the planning agent must resolve

- **The decision** — What specific question or trade-off HW should reason through
- **Context to provide** — What information HW already has that's relevant to the decision
- **Expected output** — What conclusion or decision the reasoning should produce
- **What comes next** — Which node uses this conclusion and how

## Node ID

Default: `sequential-thinking`. If used multiple times in a DAG, suffix: `sequential-thinking-<N>`.

## Notes

- No agent dispatch — HW executes this tool directly
- Use sparingly: only when the decision is genuinely non-obvious and stakes are high
- Particularly useful before `decision-gate` (to prepare HW's recommendation) or before `write-dag` nodes (to finalize structure)
- The `sequential-thinking_sequentialthinking` tool name is the MCP server tool — use this exact name in the todo array
