# Node Library Catalogue

## Core

### execution-kickoff
The hardcoded entry node for every project DAG. Loads the `following-plans` skill, views the plan structure (compact then full), retrieves planning context from semantic notes, reasons through execution strategy, and stores executor-framed orientation notes. Every DAG starts here.

### work-item
A project mutation node. The agent reads notes, scouts the accumulated context, then delegates to either `@juniordev` (code/configuration changes) or `@documentation-expert` (documentation changes). Use for any discrete unit of work that changes files.

### project-search-and-analysis
An investigation node. The agent reads notes, scouts context, then delegates to either `@context-scout` (wide, broad survey) or `@context-insurgent` (narrow, targeted analysis). Use before work-item nodes to ensure the agent understands what it is changing.

### research
An external research node. The agent reads notes, scouts context, then delegates to `@external-scout` for a focused web search. Use when the task requires current external information that is not in the project.

### deep-research
An extended external research node. Like `research`, but scoped for broad domain exploration across multiple angles. Use when the user requests comprehensive coverage of a topic, not a single targeted query.

### write-notes
A notes-writing node. The agent stores findings, decisions, and open questions to the semantic notes system. Use after investigation or implementation phases to capture what was learned before compressing.

### compress
A context compression node. The agent compresses closed sections of the conversation. Use after a phase that produced substantial notes and before moving to the next major phase.

### session-overview-refresher
A re-orientation node (kickoff-refresher in the spec). The agent loads methodology skills, retrieves accumulated session context from semantic notes, and synthesizes understanding of what has been accomplished and what remains. Use after every `compress` node.

### sequential-thinking
A pure reasoning node. The agent works through a problem using sequential thinking before continuing. Use when a decision or analysis step is needed that does not require a subagent.

---

## Logic

### decision-gate
A branching node where the agent assesses accumulated evidence and chooses a path. The agent reasons through the options and calls `next_step` with the chosen branch ID. Use when the right path depends on what has been discovered during execution.

### user-decision-gate
A branching node where the user chooses a path. The agent presents the options via the `question` tool and routes based on the answer. Use when the choice requires user judgment.

### plan-fail
A terminal failure node. The agent stores a failure summary to semantic notes explaining what failed, what was tried, and what a future attempt should do differently. Use when an unresolvable problem is encountered or verification fails after retries.

### plan-success
A terminal success node. The agent provides a success summary of what was accomplished and notes any deferred items or follow-up work. Use as the final node when the plan completes successfully.

---

## Verification and Operations

### verify
A verification node. The agent reads notes, scouts context, then delegates to `@tailwrench` to run checks and report results. Use after every significant work-item to confirm the change is correct before continuing.

### run-project-commands
A shell operations node. The agent reads notes, scouts context, then delegates to `@tailwrench` to run commands. Use for installing dependencies, running build scripts, configuring tools, or any operation that requires shell access.

### commit
A git checkpoint node. The agent reads notes, scouts context, then delegates to `@tailwrench` to stage and commit changes. Use at stable checkpoints after verified work.

---

## General

### agentic-loop
A fully autonomous execution node (autonomous-work in the spec). The agent confirms the user's explicit approval before delegating to `@autonomous-agent`, which has full tool access and works without interruption until its goal is complete. Use only when the user has explicitly approved autonomous execution during planning.

### user-discussion
A free-form conversation node. The agent presents a topic to the user via the `question` tool and collects their input. Use when user input is needed mid-execution that does not require a branching decision.
