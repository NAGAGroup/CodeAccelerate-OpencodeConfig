# sequential-thinking

## When to use

Add a sequential-thinking node whenever HW needs to reason through a decision before dispatching agents or making structural choices:

- **After data collection** — After `scout-parallel` or `analyze-deep` nodes when findings need synthesis before deciding how to proceed
- **Before gates** — Before any `decision-gate` node where the right branch option isn't immediately clear
- **Before major actions** — Before `parallel-tasks` or `write-dag` nodes when the approach or scope is still being worked out
- **At decision points** — Whenever a task has multiple plausible approaches and HW needs to reason through trade-offs
- **Phase orientation** — At the start of a complex phase to orient HW's thinking before dispatching agents

**Key insight:** Complex project DAGs should have **multiple** sequential-thinking nodes — one per major decision point is a good default.

**When NOT to use:** **Do not** use before simple, unambiguous implementation steps where HW already has all context needed. Prefer it at genuine decision forks with 2 or more plausible approaches, not as a rote step between every node.

## What it does

HW calls the `sequential-thinking` MCP tool directly (no agent dispatch). The tool steps through a structured reasoning process. Output is HW's conclusion, which feeds the next node.

## What the planning agent must resolve

- **The decision** — What specific question or trade-off HW should reason through. Good: "Should we refactor the token module before adding refresh logic, or add it first?" Bad: "Figure out the auth approach."
- **Context to provide** — What information HW already has that's relevant to the decision
- **Expected output** — What conclusion or decision the reasoning should produce. Good: "A recommended implementation order with rationale — e.g., 'refactor first because the current structure makes adding refresh logic fragile'." Bad: "A conclusion."
- **What comes next** — Which node uses this conclusion and how. The output of the sequential-thinking call stays in HW's active context — subsequent nodes reference conclusions directly. No explicit capture step is needed unless the context window is large.
- **Output constraint** — After reasoning, HW's conclusion must be stated explicitly before calling `next_step()`. The prompt must instruct HW: "State your conclusion clearly before advancing — the next node will reference it."

## Node ID

Default: `sequential-thinking`. If used multiple times in a DAG, suffix: `sequential-thinking-<N>`. First instance: `sequential-thinking`. Second instance: `sequential-thinking-2`. Never use `-1` as a suffix.

## Notes

- No agent dispatch — HW executes this tool directly
- Use liberally in complex project DAGs — a multi-phase task often warrants 2–4 sequential-thinking nodes, one at each key decision point
- Particularly useful before `decision-gate` (to prepare HW's recommendation) or before `write-dag` nodes (to finalize structure)
- The `sequential-thinking_sequentialthinking` tool name is the MCP server tool — use this exact name in the todo array. A typo silently breaks the todo sequence.
- **Failure mode:** Setting a fixed thought-count target (e.g., "use exactly 10 thoughts") instead of a complexity-guided estimate. Fixed counts cause HW to pad reasoning or truncate before reaching a conclusion. Instruct HW to stop when the conclusion is clear, not when a count is reached.
- **Failure mode:** Using a single sequential-thinking node for a multi-phase project when each decision point deserves its own node. One 15-thought chain covering 3 distinct decisions is harder to follow and debug than 3 separate focused nodes.
