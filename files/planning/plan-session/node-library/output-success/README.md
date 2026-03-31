# output-success Node Type

**Purpose:** Terminal node for the happy path. Communicates accomplishments, artifacts, and next steps to the user in plain language. Auto-advances (empty todo).

## When to Use

Use `output-success` as the terminal node for every successful branch in your DAG. This node exists purely to deliver results to the user in a clear, completed-state message.

**Multiple success branches?** If your DAG has two or more successful outcomes, create separate instances: `output-success`, `output-success-2`, `output-success-3`, etc. Each branch needs its own terminal node with its own unique node ID. Do not attempt to reuse a single `output-success` node across multiple branches — reusing node IDs causes the DAG engine to silently overwrite the node_map entry and terminate the session prematurely.

## What the Planning Agent Must Resolve

Before writing this node, answer these questions:

1. **Accomplishments** — What did the DAG produce? State 1–3 concrete results.
   - ✓ Good: "Refactored token-refresh logic in `src/auth/token.ts`, added 12 unit tests in `src/auth/__tests__/token.test.ts`, updated error handling to distinguish token-expired from network-timeout."
   - ✗ Bad: "The feature was added" / "Authentication improvements were made" (vague, no file paths)

2. **Artifacts** — What is the user walking away with? List specific files written, commands run, changes committed, etc.
   - ✓ Good: "Files: `src/auth/token.ts` (refactored), `src/auth/__tests__/token.test.ts` (12 new tests), `docs/auth-flows.md` (updated). Command to run: `npm test -- src/auth`"
   - ✗ Bad: "Code was written" / "Tests were added" (incomplete, no file list or command)

3. **Communication constraint** — Write only plain user-facing language. No node IDs, todo arrays, plugin mechanics, or HW-internal state. The user reads this text directly.
   - ✓ Good: "You can now run the migration with `npm run migrate:prod`. Next, update the deployment docs."
   - ✗ Bad: "Node `output-success` has completed. The planning enforcement plugin has advanced the session. Next step: user should call `activate_plan` if needed." (references node IDs, plugin internals)

4. **Next steps** — What should the user do now? Be concrete and actionable.
   - ✓ Good: "Run `npm run test` to verify the changes. Then submit a PR with the commit message: 'fix: token refresh race condition (fixes #42).'"
   - ✗ Bad: "Test the changes" / "Proceed with next steps" (vague, no concrete commands or context)

## Notes

**Failure mode: Vague accomplishments without file paths**
- **Mechanism:** Planning agent writes "Added authentication" instead of "Added OAuth2 login flow in `src/pages/login.tsx` (45 lines, +3 deps in `package.json`) and integration test in `src/__tests__/login.test.tsx` (120 lines)." User receives a message that hides what actually changed.
- **Fix:** The "must resolve" checklist requires accomplishments to name specific files and line counts. When filling `{{ACCOMPLISHMENTS}}`, the planning agent must cite paths, not just features.

**Failure mode: Action items mistaken as messages**
- **Mechanism:** Planning agent writes in the accomplishments section: "User should now run `npm test`" or "Next, refactor the database schema." HW reads this as a message to display (because this is a terminal node with empty todo), not as a command HW should execute. The user receives instructions phrased as if HW will do them, but HW won't. Confusion ensues.
- **Fix:** The template's `## Terminal constraint` fixed section reminds the planning agent: "This is a terminal node with empty todo. Do not include instructions that HW should execute — they will be read as messages to the user, not commands. All guidance must be phrased as 'you should' or 'run this command,' not 'do this.'"

**Failure mode: Node ID or plugin references in user-facing text**
- **Mechanism:** Planning agent writes "This node `output-success` has completed the planning session" or "The planning enforcement plugin has advanced to the terminal node." User sees internal scaffolding exposed.
- **Fix:** The communication constraint explicitly forbids node IDs, todo arrays, and plugin references. Phrasing guides the planning agent to use second person ("You have completed X") instead of first-person system state ("The system has advanced").

## Output Constraint

This is a user-facing message, not a system log. Write in plain language — no node IDs, todo arrays, planning mechanics, or HW-internal state. The user reads this text directly and should understand immediately what was accomplished and what to do next.
