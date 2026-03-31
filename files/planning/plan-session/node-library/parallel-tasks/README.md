# parallel-tasks Node Type

## When to use

Use `parallel-tasks` when you have **multiple independent tasks** that can execute concurrently without any task depending on another's output. All tasks must target **different files** (see Failure Modes below) and must be executable by haiku-tier agents (@JuniorDev, @QuickDoc, or @ExternalScout).

**Independence requirement:** Each task is self-contained. No task reads the output of another task in this node, and no task's success depends on another task completing first. Tasks may reference the same codebase for context, but they do not wait for each other or pass results to each other.

Examples of correct use:
- Update three separate configuration files in parallel
- Write two unrelated documentation files simultaneously
- Apply formatting fixes to three independent modules at once
- Research two separate libraries concurrently (via @ExternalScout)

Examples of incorrect use (→ make sequential instead):
- Task A updates a file, Task B reads Task A's changes (implicit dependency)
- Task A and Task B both write to `src/auth.ts` (collision — silent overwrite)
- Task A's success is measured by Task B's outcome (implicit dependency)

## What the planning agent must resolve

Before writing this node's prompt, answer all of the following in sequence:

1. **Task count** — How many parallel tasks? (minimum 3 for this node type; fewer tasks → remove unused `task` entries from the `todo` array).
   - Good: "Three tasks: (1) @JuniorDev adds refresh token function, (2) @JuniorDev adds session invalidation, (3) @QuickDoc updates API reference"
   - Bad: "Several tasks that need to happen in parallel" (no specific count)

2. **Per-task agent assignment** — For each task, which haiku agent?
   - @JuniorDev for code edits (10-step budget)
   - @QuickDoc for documentation and config writes (8-step budget)
   - @ExternalScout for external research (15-step budget)
   - (Never @ContextScout alone, never @ContextInsurgent, never @HeadWrench — use analyze-deep or scout-parallel nodes instead)
   - Good: "@JuniorDev for code edits, @QuickDoc for API documentation"
   - Bad: "@HeadWrench will orchestrate the tasks" (violates haiku-tier scope)

3. **Per-task target files** — For each task, which specific files/modules does it touch?
   - List absolute or repo-relative paths, never thematic descriptions
   - One target file per task is ideal; if a task touches multiple files, they must all be in the same logical module
   - Good: "`src/auth/token.ts`"
   - Bad: "the authentication system" or "auth-related files"

4. **Per-task goal** — What is the observable outcome for each task? State the end-state, not the process. Task goals must be concrete observable outcomes, never thematic descriptions.
    - Good: "The `authenticate()` function accepts a Bearer token parameter and returns a user ID on success"; "Update auth token expiry from 24h to 7d in config.ts"
    - Bad: "Update the authentication logic" (process description, not observable outcome); "Update the authentication system" (thematic description — too vague to be actionable). Vague goal descriptions propagate through all three cascade layers (planning → dispatch → execution).

5. **Per-task success criterion** — How will you verify each task succeeded? Make it observable and testable, independent of downstream tasks.
   - Good: "The function `validateEmail()` rejects addresses without an @ symbol and is exported from the module"
   - Bad: "The code is improved" (not observable); "Task 2 will use this function" (depends on Task 2 — not independent)

6. **Per-task constraints** — What patterns must each task follow? What files must it avoid? Does the edit require matching a specific style?
   - Example constraints: "Follow error-handling pattern in `src/errors/handler.ts`", "Do NOT modify type definition files", "Match the style of function signatures in `src/utils/format.ts`"
   - Good: "Follow validation pattern in `src/validators/input.ts`; do not modify `src/types/shared.ts`; match JSDoc comments from `src/auth/session.ts`"
   - Bad: (no constraints — the agent guesses at patterns and conventions)

7. **Independence verification** — For each pair of tasks, answer: does task A's output feed into task B as input?
   - If YES (even if indirectly) → these tasks have implicit dependency and must be sequential, not parallel. Use sequential nodes instead.
   - If NO → safe to run in parallel.
   - Good: "Task A (fix auth middleware) targets `src/middleware/auth.ts`; Task B (add logging helper) targets `src/utils/logging.ts`. Task B does not read Task A's output. ✓ Independent."
   - Bad: "Task A adds the `validateToken` function; Task B calls `validateToken` to process requests" (Task B depends on Task A completing first → use sequential nodes)

8. **File write conflict check** — Do any two tasks write to the same file?
   - If YES → one task will silently overwrite the other. Concurrent writes to the same file are lost. Make them sequential instead.
   - If NO → safe to run in parallel.
   - Good: "Task A touches `src/auth.ts`, Task B touches `src/logging.ts`, Task C touches `docs/api.md` — no collisions"
   - Bad: "Both Task A and Task B update `src/config.ts`" (collision — one write is lost → make sequential)

9. **Conventions reference (for @QuickDoc tasks only)** — Which existing file or documentation section does the new content match?
   - Provide a file path and mention the specific section structure or style element to match
   - Good: "`docs/api-reference.md` (follow the H3 headers + code block + description structure from the 'Authentication' section)"
   - Bad: (no reference — QuickDoc invents the format and produces inconsistent output)

## Notes

**Same-file write collision (failure mode):** Two tasks in the same `parallel-tasks` node that write to the same file will execute concurrently. OpenCode has no built-in file locking — whichever task completes last silently overwrites the first task's changes. The first task's edits are lost.
- **Mechanism:** Task A reads `src/config.ts`, makes edits, writes back. Simultaneously, Task B reads `src/config.ts`, makes different edits, writes back. If Task B completes after Task A, Task B's version becomes the file state, and Task A's changes vanish.
- **Prevention:** During planning, verify each file path appears in exactly one task's target list (item #8 above).
- **Fix:** If two tasks must both modify the same file, do not use `parallel-tasks`. Instead, create two sequential `task` nodes: node-1 (Task A only) → node-2 (Task B only). Each node has one task entry in its `todo` array.

**Implicit task dependency (failure mode):** A task that reads the output of another task in the same node (e.g., Task A modifies `config.json`, Task B reads the modified config to make decisions) will experience a race condition. Task B may begin before Task A completes, reading stale data, and the decision made by Task B becomes incorrect.
- **Mechanism:** Task B is told "Read the updated config from Task A." Both tasks start concurrently. If Task B's read executes before Task A's write, Task B reads the old config and makes wrong decisions.
- **Prevention:** During independence verification (item #7 above), check whether the tasks share any data flow, even indirectly. If task B needs the state changes from Task A, mark them as dependent.
- **Fix:** Use sequential `task` nodes in separate plan nodes: create node-1 (Task A), wait for result, then create node-2 (Task B). Task A's completion becomes the trigger for Task B's dispatch.

**Haiku agent step budget constraints:**
- @JuniorDev: 10 steps per dispatch. Complex edits (multi-file refactors, large rewrites, multiple unrelated changes) exceed this. Use analyze-deep + verify-check + sequential task chains instead.
- @QuickDoc: 8 steps per dispatch. Long documents or complex templates exceed this. Split into separate sequential nodes.
- @ExternalScout: 15 steps per dispatch. One-shot research tasks are safe; multi-phase investigations that require follow-up lookups exceed budget.

If a task is too complex for a single haiku dispatch, refactor into a sequential sub-DAG (scout → analyze → implement pattern).

## Output constraint

Each dispatched agent prompt must state the success criterion as an **observable outcome**, not a process description. Observable outcomes are testable and verifiable without additional tool calls. Process descriptions are not.
- Observable: "The function `foo()` accepts a second parameter named `type` of type `string`, and the module exports the updated function"
- Not observable: "Update the function foo() to accept a type parameter" (describes work, not outcome)
