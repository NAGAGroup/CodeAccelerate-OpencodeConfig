# output-failure

## When to use

As the terminal node for the failure path — when retries are exhausted, a hard stop is hit, or the user chooses to abort. Every DAG with a failure branch must terminate with this node (or `output-success`).

## What it does

Auto-advances immediately (empty todo). The prompt instructs HW what to communicate to the user: what was attempted, what failed, and what recovery options exist.

## What the planning agent must resolve

- **What failed** — Brief description of what the DAG attempted and where it stopped
- **Failure cause** — What the anticipated failure scenario is (e.g., "tests failed after two fix attempts", "build error not resolved")
- **Recovery options** — What the user can try manually or with a fresh session

## Node ID

Always `output-failure`. If a DAG has multiple failure paths, each branch gets its own `output-failure` instance — nodes cannot be shared or referenced by ID across branches.

> **Anti-pattern:** Do NOT reuse the `output-failure` ID across branches. Every terminal node must have a unique ID — e.g., `output-failure`, `output-failure-2`. Reusing an ID silently corrupts the node map and the session will terminate prematurely on whichever branch resolves it first.

## Notes

- Empty todo — no tool calls required
- Keep the prompt honest and helpful: tell the user exactly what happened and what to do next
- Do not leave recovery options vague — be specific about what manual steps are needed
