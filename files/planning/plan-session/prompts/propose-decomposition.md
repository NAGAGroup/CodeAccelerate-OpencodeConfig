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

## Constraints

- Every node needs exactly one node type from the library (or `generic` if nothing fits)
- Nodes that need user decisions use `decision-gate` (todo: `["question"]`)
- Nodes running commands use `conditional-branch` or `verification-check`
- Each node should be completable by its assigned agent(s) working alone

## Present to user

After finalizing your decomposition, present it clearly. This is the last step before the planning gate — make it readable. The user will approve or request changes.
