<rules>
Acyclic. No loops. Retries are unrolled sequences: work-item → verify → fix → verify-retry → write-notes-pass or write-notes-failure. Each retry adds explicit nodes. There is no loop-back construct.
Every path ends at a write-notes leaf. No dead ends.
verify has exactly 2 children: pass path and fail path.
decision-gate has exactly 2 children: mutually exclusive branches.
Branches are mutually exclusive. Parallel work is unsupported.
Entry point: the first work node. Exit points: all write-notes leaf nodes, each marked success or failure.
</rules>

<components>
work-item: Any project mutation — code changes, file edits, refactors, documentation updates.
project-search-and-analysis: Investigation without mutation. Place before work-item when the executor cannot be assumed to know the current state of what they are changing.
verify: Branching check after work-item. Pass continues forward; fail enters a fix cycle. Use for verifying implementation outcomes, not routing decisions.
decision-gate: Routes based on accumulated evidence. Use for routing decisions, not verifying implementation outcomes. Exactly 2 children required.
run-project-commands: Shell execution. Required when a work-item depends on state only a command can produce: installing dependencies, running build or generation tools, scaffolding, initializing submodules. Place before the work-item that consumes the result.
write-notes: Stores findings, decisions, and context to semantic notes. Every leaf node must be write-notes. Success leaves capture what was accomplished; failure leaves capture what went wrong.
commit: Git checkpoint after a successful verify on a meaningful unit of work.
sequential-thinking: Pure reasoning with no side effects. Use when a planning or decision step benefits from structured reasoning before action.
</components>
