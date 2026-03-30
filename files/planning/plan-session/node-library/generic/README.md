# generic

## When to use

When no other node template fits. Use as an escape hatch for unusual node patterns — custom tool sequences, one-off combinations, or experimental flows. Document the rationale clearly in the node prompt. Examples: A single `bash` check to verify a file exists before branching. A node that calls `question` then `bash` in sequence for an interactive confirm-and-run pattern. A node calling a custom MCP tool not covered by other templates.

## What it does

No fixed todo — the planning agent defines the todo array freely. The node can call any combination of tools in any order.

## What the planning agent must resolve

- **Todo sequence** — What tools should HW call, in what order? List them explicitly. Good: "[1. bash — Run 'bun run build', 2. task — Dispatch @JuniorDev to fix compile errors]" Bad: "Some tool calls to fix the issue."
- **Rationale** — Why doesn't a standard node template fit this situation?
- **Each step** — For each item in the todo array, what exactly should HW do? Good: "task — Dispatch @JuniorDev to edit src/auth/token.ts: add refreshToken function. Success: TypeScript compiles." Bad: "task — Fix the auth code."
- **Success criteria** — How does HW know this node is done?
- **Output constraint (if dispatching an agent)** — If the todo includes a `task` call, the filled prompt must include a return format instruction for that agent. Good: "Return a file-by-file list of changes made." Bad: omitting return format entirely (agent produces unpredictable output shape).

## Node ID

Always rename — `generic` is not a meaningful node name. Use a descriptive ID: `audit-registry`, `patch-schema`, `migrate-files`.

## Notes

- The `generic/plan.json` ships with `"todo": []` — the planning agent fills this in when writing the actual node. When writing a `generic` node into a project DAG, **replace** the empty todo with the actual sequence needed. Do not ship a node with `"todo": []` unless it genuinely needs no tool calls (like `conditional-branch`).
- If you find yourself using this node frequently for a particular pattern, consider proposing it as a new named template
- Valid todo items: any OpenCode tool name (`task`, `bash`, `question`, `compress`), or MCP tool names like `sequential-thinking_sequentialthinking`

## Anti-patterns to avoid

> **Do NOT use `generic` to substitute for `decision-gate` or `conditional-branch`.** If your `next` field is a branch array, the todo must include either `question` (user-decided) or be empty (condition-decided). Arbitrary todos with branch `next` create ambiguous semantics. *(consequence: branching logic fails, node advances unpredictably or blocks on undefined tool)*

> **Do NOT leave todo items undefined.** Every item in the todo array must have a clear, specific instruction in the prompt. Vague todos like `"task"` with no guidance will fail — the executing agent needs to know exactly what to dispatch and to whom. *(consequence: executing agent receives empty or contradictory instructions and produces unusable output)*

> **Do NOT use `generic` to chain long sequences.** If a node needs more than 4–5 todo items, split it into multiple nodes. Long sequences are harder to debug and exceed step budgets. *(consequence: node exceeds step budget or fails silently mid-sequence, session hangs)*

> **Always rename the node ID.** Using `"id": "generic"` in plan.json will cause confusing state if any other generic node exists in the DAG (duplicate IDs throw a validation error). *(consequence: node ID collides with another generic node, silently overwrites state, node ends session prematurely)*
