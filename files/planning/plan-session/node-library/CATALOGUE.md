# Node Library Catalogue

## Automatic

### execution-kickoff
The hardcoded entry node placed by init_dag at the root of every execution DAG. The agent loads the following-plans skill, views the plan structure (compact then full via show_compact_dag then show_dag), retrieves planning context from semantic notes via qdrant_qdrant-find, reasons through its execution strategy using sequential-thinking_sequentialthinking, and stores executor-framed orientation notes via qdrant_qdrant-store. Every DAG starts here — the dag-designer does not add it.

Enforcement: `[skill, show_compact_dag, show_dag, qdrant_qdrant-find, sequential-thinking_sequentialthinking, qdrant_qdrant-store]`

---

## Core

### work-item
Any project mutation — code changes, file edits, refactors, documentation updates. The agent dispatches @context-scout to understand current state, loads the appropriate delegation skill (juniordev-delegation for code, documentation-expert-delegation for docs), reasons through the implementation goal, then dispatches the chosen implementation subagent.

Enforcement: `[task, skill, sequential-thinking_sequentialthinking, task]`

### project-search-and-analysis
Investigation without mutation. The agent loads either the context-scout-delegation or context-insurgent-delegation skill based on session context, reasons through the dispatch prompt, then dispatches the chosen investigator. Use before work-item nodes when the current state of the area needs to be understood first.

Enforcement: `[skill, sequential-thinking_sequentialthinking, task]`

### research
External research via @external-scout behind an IP approval gate. The agent loads the external-scout-delegation skill, reasons through the research query, presents the exact query to the user for approval via the question tool, then dispatches @external-scout. If the user declines, dispatches @external-scout with a prompt to return immediately — satisfies enforcement without requiring a branch.

Enforcement: `[skill, sequential-thinking_sequentialthinking, question, task]`

### deep-research
Extended domain exploration, usually user-requested. For broad investigation across multiple sources rather than a single targeted query. The agent loads the external-scout-delegation skill, reasons through the research scope, then dispatches @external-scout.

Enforcement: `[skill, sequential-thinking_sequentialthinking, task]`

### write-notes
Store accumulated findings, decisions, and constraints to semantic notes. Place explicitly when a step's primary purpose is note storage. One qdrant_qdrant-store call satisfies enforcement; the agent makes as many calls as needed — one per significant finding.

Enforcement: `[qdrant_qdrant-store]`

### compress
Compress closed conversation sections to free context window space. Instructions before the compress call risk being compressed away — keep pre-compress prose minimal. Always followed by a kickoff-refresher node.

Enforcement: `[compress]`

### kickoff-refresher
Realign the agent after context compression. The agent loads the following-plans skill, loads the sequential-thinking skill, retrieves accumulated session context via qdrant_qdrant-find, then synthesizes understanding via sequential-thinking_sequentialthinking. Always placed after a compress node.

Enforcement: `[skill, skill, qdrant_qdrant-find, sequential-thinking_sequentialthinking]`

### sequential-thinking
Pure reasoning step with no side effects. The agent reasons through a problem, decision, or assessment using sequential-thinking_sequentialthinking without dispatching subagents or making changes.

Enforcement: `[sequential-thinking_sequentialthinking]`

---

## Logic

### decision-gate
The executor assesses accumulated evidence from semantic notes and chooses which branch to take. The agent retrieves context via qdrant_qdrant-find, reasons through the decision criteria via sequential-thinking_sequentialthinking, then calls next_step with the chosen branch ID. DAG designers must store notes about each conditional node's branch conditions by exact node ID during planning.

Enforcement: `[qdrant_qdrant-find, sequential-thinking_sequentialthinking]`

### user-decision-gate
The user chooses which branch to take. The agent presents the options via the question tool and routes based on the answer.

Enforcement: `[question]`

### plan-fail
Terminal failure node. The agent stores a failure summary to semantic notes via qdrant_qdrant-store capturing what was attempted, what failed, and what was learned. These notes are available to the next planning session.

Enforcement: `[qdrant_qdrant-store]`

### plan-success
Terminal success node. No required tool calls. The agent provides a summary of what was accomplished and notes any deferred items or follow-up work.

Enforcement: `[]`

---

## Verification and Operations

### verify
Verification of the most recent change. The agent loads the tailwrench-delegation skill, reasons through what verification means for this specific change (from semantic notes), then dispatches @tailwrench with specific verification criteria.

Enforcement: `[skill, sequential-thinking_sequentialthinking, task]`

### run-project-commands
Shell operations — adding dependencies, running build scripts, configuring tools, running tests. The agent loads the tailwrench-delegation skill, plans the command sequence, then dispatches @tailwrench.

Enforcement: `[skill, sequential-thinking_sequentialthinking, task]`

### commit
Git checkpoint at a meaningful save point. The agent loads the tailwrench-delegation skill, composes an appropriate commit message from session context, then dispatches @tailwrench to stage and commit.

Enforcement: `[skill, sequential-thinking_sequentialthinking, task]`

---

## General

### user-discussion
Free-form conversation with the user mid-execution. For presenting findings, discussing tradeoffs, or getting open-ended feedback that does not fit the structured question format.

Enforcement: `[question]`

### autonomous-work
Escape hatch that delegates to @autonomous-agent with no tool restrictions or step limits. The agent confirms the user's explicit approval via the question tool before dispatching. Include in a DAG only when the user explicitly approved autonomous work during planning.

Enforcement: `[question, task]`
