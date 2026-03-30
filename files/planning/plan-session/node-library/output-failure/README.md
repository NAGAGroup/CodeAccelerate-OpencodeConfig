# output-failure

## When to use

As the terminal node for the failure path — when retries are exhausted, a hard stop is hit, or the user chooses to abort. Every failure path in the DAG must terminate with `output-failure`. Do not reuse `output-success` on failure paths, even if the failure is soft.

**Do not** use as the immediate failure target when a retry is feasible. Route recoverable failures through a fix node first. Reserve `output-failure` for when retries are exhausted or the failure is unrecoverable.

## What it does

Auto-advances immediately (empty todo). The prompt instructs HW what to communicate to the user: what was attempted, what failed, and what recovery options exist.

## What the planning agent must resolve

- **What failed** — Brief description of what the DAG attempted and where it stopped
  Good: "Three ContextScout agents explored the codebase; JuniorDev attempted 2 edits to src/auth/token.ts; build failed with TypeScript errors." Bad: "The plan failed."
- **Failure cause** — What the anticipated failure scenario is (e.g., "tests failed after two fix attempts", "build error not resolved")
  Good: "TypeScript errors in src/auth/token.ts remained unresolved after 2 fix attempts." Bad: "Something went wrong."
- **Recovery options** — What the user can try manually or with a fresh session. Good: 'Run `npm install` manually to resolve dependency conflicts, then re-run the plan.' Bad: 'Try again.'
- **Communication constraint** — The filled prompt must communicate in plain language. Must NOT reference DAG node IDs, "todo: []", or plugin mechanics — only what was tried, what failed, and what to do next.

## Node ID

Always `output-failure`. If a DAG has multiple failure paths, each branch gets its own `output-failure` instance — nodes cannot be shared or referenced by ID across branches.

> **Anti-pattern:** Do NOT reuse the `output-failure` ID across branches. Every terminal node must have a unique ID — e.g., `output-failure`, `output-failure-2`. Reusing an ID causes a **validation error** at DAG-authoring time.

## Notes

- Empty todo — no tool calls required
- Keep the prompt honest and helpful: tell the user exactly what happened and what to do next
- Do not leave recovery options vague — be specific about what manual steps are needed
- **Failure mode:** Vague recovery options (e.g., "restart the session") — users cannot act on them. Always include at least one command-level instruction: exact shell command, file path, or URL.
- **Failure mode:** Routing to output-failure on the first error without a retry node. Reserve output-failure for when retries are exhausted — recoverable failures should have a fix-and-retry loop before this node.
