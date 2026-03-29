# Propose Task Decomposition

Break the approved structure into a concrete node-by-node decomposition. Use the node library to select the right node type for each step, then present your assignments to the user.

## Todo

1. `task` — Dispatch @ContextScout to read `{{SESSION_PATH}}/node-library/CATALOGUE.md` and any node README files relevant to your proposed structure. Use what it returns to finalize your node-type selections and agent assignments.

## What to produce

After the scout returns, synthesize a decomposition with this format for each node:

- **Node ID** — Short, descriptive, kebab-case (e.g. `implement-auth`, `verify-build`)
- **Node type** — Which library node this uses (e.g. `scout-parallel`, `verification-check`)
- **What it does** — Clear scope and deliverables in 1–2 sentences
- **Agent assignment** — Which specialist handles it and how many `task` dispatches
- **Branch conditions** (if applicable) — The `when` conditions and whether user-decided or agent-decided

## Agent routing at a glance

| Agent | Model | Use for | Parallel? |
|-------|-------|---------|-----------|
| `@ContextScout` | haiku | Quick codebase reads, file discovery | Yes |
| `@ContextInsurgent` | sonnet | Deep multi-file reasoning, synthesis | No |
| `@JuniorDev` | haiku | Scoped code edits | Yes |
| `@QuickDoc` | haiku | Document generation, single-file writes | Yes |
| `@DeepResearcher` | haiku | Web/docs research | Yes |
| `@HeadWrench` (subagent) | sonnet | Shell access, build/test verification | No |

Prefer haiku agents in parallel. Reserve sonnet agents for tasks that genuinely require deep reasoning across many files.

**ContextInsurgent produces analysis and synthesis only — never assign it code edits or file writes. Those belong to @JuniorDev (code) or @QuickDoc (docs).**

## Sequential Thinking Nodes

Sequential-thinking nodes execute HeadWrench directly — no agent dispatch, HW calls the MCP tool itself. Use them **liberally** in complex project DAGs. They are cheap (MCP tool calls) and powerful (full reasoning context).

**Insert a sequential-thinking node when:**

- After `scout-parallel` or `analyze-deep` — findings need synthesis before deciding how to proceed
- Before any `decision-gate` — the right branch isn't immediately obvious and trade-offs need reasoning
- Before `parallel-tasks` or `write-dag` — scope or approach is still being worked out
- Whenever multiple plausible approaches exist and trade-offs need to be reasoned through

**Complex tasks should have 2–4 sequential-thinking nodes**, one at each major decision point—not just one. This is not "overthinking"; it's building in explicit synthesis moments so branch choices are clear and justified.

**Anti-pattern to avoid:** Skipping sequential-thinking in multi-phase tasks because no single decision feels "hard enough." If there are multiple branching points or a complex decomposition, add the nodes. They cost nothing and make plans more robust.

## Constraints

- Every node needs exactly one node type from the library (or `generic` if nothing fits)
- Nodes that need user decisions use `decision-gate` (todo: `["question"]`)
- Nodes running commands use `conditional-branch` or `verification-check`
- Each node should be completable by its assigned agent(s) working alone

## Present to user

After finalizing your decomposition, present it clearly. This is the last step before the planning gate — make it readable. The user will approve or request changes.
