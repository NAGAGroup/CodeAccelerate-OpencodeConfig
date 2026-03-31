# output-failure Node Type

Terminal node for communicating task failure to the user when retries are exhausted, a hard stop is encountered, or the user aborts the session.

## When to Use

Route to `output-failure` when:
- Retries or recovery attempts have been exhausted and the issue remains unresolved
- A hard constraint (missing dependency, permission denial, incompatible version) cannot be bypassed
- The user explicitly requests termination or aborts the session
- No further automated recovery is feasible or appropriate

**Do NOT use** `output-failure` as the immediate target for recoverable failures. If a failure might be fixable via a retry, fix node, or user input, exhaust those recovery paths first. Reserve `output-failure` for true terminal scenarios — retries attempted and failed, or unrecoverable hard stops.

## What the Planning Agent Must Resolve

Complete this four-item checklist before filling the prompt template:

1. **What was attempted** — Concretely describe all major phases the DAG completed before failure (e.g., "Scout phase: 3 parallel ContextScouts read the codebase. Implementation phase: 2 JuniorDev edits attempted."). Do not gloss over completed work — only focus on failures.
   - ✓ Good: "Scout phase completed (3 agents read codebase). Implementation attempted (JuniorDev attempted 2 edits to src/auth/token.ts over 45 minutes). Build verification failed both times."
   - ✗ Bad: "The plan failed."

2. **Failure point** — Name the exact phase or step where the plan stopped, including the specific failure. State the root cause clearly (e.g., "TypeScript error persisted," "permission denied on file X," "required dependency not installed").
   - ✓ Good: "Build failed after 2 fix attempts. TypeScript errors in src/auth/token.ts line 47-52 remained unresolved. Root cause: strict mode violation in type signature."
   - ✗ Bad: "Build step had an error."

3. **Recovery options** — List 1–3 specific, executable recovery paths. Each must be:
   - Exact command-level (copy-paste ready: `npm install`, `bun run test`, `git clone <url>`)
   - File or path references where applicable
   - A fallback (contact support, abort and retry manually) only if concrete actions are exhausted
   - ✓ Good: "1. Run `bun run typecheck` to see exact errors. 2. Manually edit src/auth/token.ts and resolve the type annotation on line 47. 3. If errors persist, contact support with the error output."
   - ✗ Bad: "Try again." or "Restart the session." (both too vague, user cannot act on them)

4. **Output constraint** — The filled prompt MUST communicate in plain user-facing language. Do NOT reference:
   - DAG node IDs or todo arrays
   - Planning system mechanics or plugin internals
   - HW-internal state or reasoning
   - Only describe: what was tried, why it failed, and what the user can do next.

## Notes

### Failure Mode: Vague Recovery Options

**Symptom:** User receives output like "restart the session" or "try again" with no specific action.

**Mechanism:** Planning agent filled `{{RECOVERY_OPTIONS}}` with generic phrases instead of exact commands or file paths. User cannot act on abstract suggestions.

**Fix:** For each recovery option, include:
1. Exact command (with all flags): `npm install --save-dev @types/node`, not "install dependencies"
2. File path if applicable: `/path/to/config.json` or `src/index.ts`, not "the config file"
3. Expected outcome: "This will resolve version conflicts" so user knows success when it happens
4. Fallback only if concrete options exhausted: provide support contact or documented issue link

### Failure Mode: Premature Routing to output-failure

**Symptom:** DAG routes to `output-failure` on the first error without attempting recovery.

**Mechanism:** Planning agent did not include a retry or fix node before `output-failure`. The plan gives up before recovery is tried.

**Fix:** Always precede `output-failure` with at least one recovery node:
- `parallel-tasks` with multiple fix strategies (e.g., "try fix A, if that fails try fix B")
- `sequential-thinking` to analyze the failure and propose a workaround
- `decision-gate` to ask user for input (abort or continue)

Only route to `output-failure` after recovery has been **attempted and confirmed failed**.

## Node ID

Always `output-failure` within a single failure branch. If a DAG has multiple failure paths (e.g., branches from a decision gate), each branch gets its own terminal node with a unique ID: `output-failure`, `output-failure-2`, etc. **Do not reuse the same ID across branches** — reusing an ID overwrites the node_map entry and causes premature session termination.
