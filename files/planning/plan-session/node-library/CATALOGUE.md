# Node Library Catalogue

## Structural Rules

- **No loops.** Execution DAGs are acyclic — no node may appear on a path back to itself. Retries are implemented as unrolled sequences: `work → verify → fix → verify-retry → [converge | write-notes-failure]`. Each retry adds explicit nodes; there is no "loop back" construct.
- Every path terminates at a leaf node — no dead ends.
- Every leaf node should be a `write-notes` node that captures context before exit.
- Branches are mutually exclusive paths — parallel work is unsupported.

## Core

| Component | Description |
|-----------|-------------|
| `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |
| `project-search-and-analysis` | Investigation without mutation. Use before work-item when current state needs to be understood first. |
| `external-scout` | External research via external-scout behind a user approval gate. |
| `deep-research` | Comprehensive research on novel or frontier topics via deep-researcher. Rarely needed — most research belongs in external-scout. |
| `write-notes` | Store accumulated findings, decisions, and constraints to semantic notes. Use as leaf nodes to capture context before exit — both success and failure paths should end with a write-notes node. |
| `compress` | Compress closed conversation sections to free context window space. Always followed by kickoff-refresher. |
| `kickoff-refresher` | Realign the agent after context compression. Always placed after compress. |
| `sequential-thinking` | Pure reasoning step with no side effects. |

## Logic

| Component | Description |
|-----------|-------------|
| `verify` | Branching verification node. Always placed after work-item. Must have exactly 2 children: the next step (pass) and a fix path (fail). Use this — not decision-gate — for verifying implementation outcomes. |
| `decision-gate` | Executor assesses accumulated evidence and chooses which branch to take. Must have exactly 2 children. Use for runtime decisions based on prior findings, not for verifying implementation. |
| `user-decision-gate` | User chooses which branch to take. Must have exactly 2 children. |

## Operations

| Component | Description |
|-----------|-------------|
| `run-project-commands` | Shell command execution via tailwrench. Required when work-items depend on state that only a command can produce — installing dependencies, running build/generation tools, executing scaffolding CLIs, initializing submodules, or running setup scripts. Place before the work-item that needs the result. |
| `commit` | Git checkpoint at a meaningful save point. Placed after successful verify. |

## General

| Component | Description |
|-----------|-------------|
| `user-discussion` | Free-form conversation with the user mid-execution. |
| `autonomous-work` | Delegates to autonomous-agent. Only include when user explicitly approved autonomous work during planning. |
