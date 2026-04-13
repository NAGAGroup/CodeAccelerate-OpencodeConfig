<node types>
// Internal, project-based search and analysis
context-scout: Broad and shallow project search. No analysis. Used as a first step in gathering project-specific information. Searches can either be entirely generic, useful for orienting the orchestrator on the project in early phases of plan execution, or for gathering broad project context on a specific phase of a plan, used to inform more targeted searches via context-insurgent. Do not overload a single context-scout node. Split complex scouting tasks into multiple sequential nodes. This node is used extensively throughout a DAG.
context-insurgent: Narrow and deep project search. Includes analysis. Used to gather specific information about the project to inform a specific decision or work-item. Place after a context-scout that gathered broad information about the topic, if needed. While work-item nodes have their own internal exploratory phases, they should always first be informed by an insurgent search and analysis in preceding steps.

// External, web-based research
external-scout: Standard external research that any engineer or other professional would run as part of standard work. It is encouraged to use this node multiple times throughout a DAG (e.g. initial research exploring options, more targeted detailed searches before setting up dependencies, researching APIs/getting started guides/tutorials before doing work, etc.). Do not overload a single external-scout node. Split complex research tasks into multiple sequential nodes.
deep-research: Comprehensive deep research into a topic, technology, or problem space. Rarely needed. If not obvious, likely not needed.

// Doing work (Note: Use internal and external research to help inform work-item steps)
junior-dev-work-item: Used to do software development work. The junior-dev subagent is a competent engineer and should be goal-driven, rather than task-driven (e.g. instructs to implement a feature, doesn't instruct to edit specific files). Do not overload a single junior-dev-work-item node. Split complex work into multiple sequential nodes. The junior-dev subagent can only make file edits. They do not run commands.
documentation-expert-work-item: Used to do documentation work. The documentation-expert subagent is a competent technical writer and should be goal-driven, rather than task-driven (e.g. instructs to update the README and user docs, doesn't instruct to edit a specific section). Do not overload a single documentation-expert-work-item node. Split complex work into multiple sequential nodes. The documentation-expert subagent can only make file edits. They do not run commands.

// Branching
decision-gate: Routes based on accumulated evidence. Use for routing decisions, not verifying implementation outcomes. Exactly 2 children required.
user-decision-gate: The decision requires user preference rather than executor judgment. Exactly 2 children required.
verify-work-item: Branching check after a work-item. This includes a delegation to a specialized subagent that has access to shell commands, allowing for building, testing, reading over the changes made in work-items, etc. The agent surfaces failure or success findings to the orchestrator. Success continues forward more work or continues to a write-notes exit node marked as a success exit; fail either continues to a fix sequence or continues to a write-notes exit node marked as a failure exit. Chain multiple verify->fix->verify sequences to handle multiple retries for challenging work. DAGs can have multiple exit pathways, do not limit your DAG to a single exit/success exit node.

// Special actions
user-discussion: Use when user input would prevent wasted work, executing unstructured user discussion before a user-decision-gate, brainstorming ideas, etc.
write-notes: Stores findings, decisions, and context to semantic notes. Every leaf node must be write-notes, but not every write-notes node needs to be a leaf. Success leaves capture what was accomplished; failure leaves capture what went wrong.
project-setup: Shell execution. Do not abuse. This is not a means to bypass the intended, predictable behavior of the DAG execution system, but is instead used to run scoped, non-destructive project commands. Use for things like updating dependencies, running build or generation tools, scaffolding, initializing submodules, etc.
commit: Checkpoint step, ensuring DAG execution is auditable and future steps don't ruin work already verified as correct.
autonomous-work: Delegates to a fully autonomous subagent. This is used only when the user specifies autonomous work is allowed. When this happens, this node should only be used as an escape hatch after all retry attempts have failed in a verify->fix->verify sequence. Should always be followed by one final verify-work-item branch that follows the same write-notes requirements for success and failure of the autonomous work.
</node types>
