# Node Library Catalogue

## Automatic

| Component | Description |
|-----------|-------------|
| `execution-kickoff` | Entry node placed automatically by `init_dag`. Do not add it — it is always the root. |

## Core

| Component | Description |
|-----------|-------------|
| `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |
| `project-search-and-analysis` | Investigation without mutation. Use before work-item when current state needs to be understood first. |
| `research` | External research via @external-scout behind a user approval gate. |
| `deep-research` | Extended external research without an approval gate. |
| `write-notes` | Store accumulated findings, decisions, and constraints to semantic notes. |
| `compress` | Compress closed conversation sections to free context window space. Always followed by kickoff-refresher. |
| `kickoff-refresher` | Realign the agent after context compression. Always placed after compress. |
| `sequential-thinking` | Pure reasoning step with no side effects. |

## Logic

| Component | Description |
|-----------|-------------|
| `verify` | Branching verification node. Always placed after work-item. Must have exactly 2 children: the next step (pass) and a fix path or plan-fail (fail). Use this — not decision-gate — for verifying implementation outcomes. |
| `decision-gate` | Executor assesses accumulated evidence and chooses which branch to take. Must have exactly 2 children. Use for runtime decisions based on prior findings, not for verifying implementation. |
| `user-decision-gate` | User chooses which branch to take. Must have exactly 2 children. |
| `plan-fail` | Terminal failure node. Failure branches always end here. |
| `plan-success` | Terminal success node. Only reachable from commit or the final happy path node. |

## Operations

| Component | Description |
|-----------|-------------|
| `run-project-commands` | Shell operations — installing dependencies, running build scripts, running tests. |
| `commit` | Git checkpoint at a meaningful save point. Placed after successful verify. |

## General

| Component | Description |
|-----------|-------------|
| `user-discussion` | Free-form conversation with the user mid-execution. |
| `autonomous-work` | Delegates to @autonomous-agent. Only include when user explicitly approved autonomous work during planning. |
