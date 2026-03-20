# Node: finalize — /plan-debug

Your role in this node is to write the debug session plan to disk. The debug session IS the implementation — it runs iteratively, updating its own fix node as it progresses.

## Steps

1. **Write session plan files** to `.opencode/session-plans/{bug-name}/`:

   **`plan.json`** — DAG with three nodes:
   ```json
   {
     "schema_version": "1.0",
     "id": "{bug-name}",
     "session_type": "plan-debug",
     "goal": "Fix: {one-sentence bug description}",
     "created": "{today}",
     "status": "ready",
     "entry": "diagnose",
     "nodes": {
       "diagnose": {
         "id": "diagnose",
         "type": "agent",
         "prompt": ".opencode/session-plans/{bug-name}/prompts/diagnose.md",
         "next": ["fix", "diagnose"],
         "remaining_visits": 5
       },
       "fix": {
         "id": "fix",
         "type": "agent",
         "prompt": ".opencode/session-plans/{bug-name}/prompts/fix.md",
         "next": "verify"
       },
       "verify": {
         "id": "verify",
         "type": "agent",
         "prompt": ".opencode/session-plans/{bug-name}/prompts/verify.md",
         "next": ["diagnose"]
       }
     }
   }
   ```

   **`prompts/diagnose.md`** — Bake in the approved hypothesis list. Instruct the agent to: try the top hypothesis (targeted code inspection or test run), write findings to `fix.md`, then route to `fix` if confirmed or back to `diagnose` if refuted.

   **`prompts/fix.md`** — Start as a placeholder: "No fix identified yet." The agent will overwrite this file during diagnose iterations, accumulating "tried X, result Y" history.

   **`prompts/verify.md`** — Instruct the agent to run the full test suite and any regression checks. If all pass: call `close_session()`. If any fail: call `next_step({ next: "diagnose" })`.

2. **Commit**:
   ```
   git add .opencode/session-plans/{bug-name}/
   git commit -m "plan: add debug session {bug-name}"
   ```

3. **Present the plan** to the user:
   - Bug statement and acceptance criteria
   - Hypothesis list (ranked, as approved)
   - Session plan structure (diagnose → fix → verify loop, max 5 diagnose visits)
   - Next step: "Run '/activate-plan {bug-name}' when ready to begin."

## Constraints

- The `fix.md` file must start as a placeholder — it is intentionally empty at plan creation time.
- Do not call `next_step()` — this is a terminal node. Call `close_session()` after presenting the plan.
