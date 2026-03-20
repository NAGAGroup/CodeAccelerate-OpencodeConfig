# Node: finalize — /plan-debug

Your role in this node is to write the debug session plan to disk. The debug session IS the implementation — it runs iteratively, updating its own fix node as it progresses.

## Steps

1. **Apply delegation instructions** — Delegation recommendations for each prompt file were established in the previous node. Use them when writing `diagnose.md`, `fix.md`, and `verify.md` — embed the appropriate delegation instructions in each.

2. **Confirm diagnose loop count with the user** — Ask: "How many diagnose visits do you want for this session? (default: 3)" Accept their response or use the default. Use this count as the value for `"remaining_visits"` in the `plan.json` template below.

3. **Write session plan files** to `.opencode/session-plans/{bug-name}/`:

   **`plan.json`** — DAG with four nodes:
   ```json
   {
     "schema_version": "1.0",
     "id": "{bug-name}",
     "session_type": "plan-debug",
     "goal": "Fix: {one-sentence bug description}",
     "created": "{today}",
     "status": "ready",
     "entry": "session-overview",
     "nodes": {
       "session-overview": {
         "id": "session-overview",
         "type": "agent",
         "prompt": ".opencode/session-plans/{bug-name}/prompts/session-overview.md",
         "next": "diagnose"
       },
        "diagnose": {
          "id": "diagnose",
          "type": "agent",
          "prompt": ".opencode/session-plans/{bug-name}/prompts/diagnose.md",
          "next": ["fix", "diagnose"],
          "remaining_visits": 3
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

    **Recovery note:** If the diagnose loop exhausts its counter and the DAG enters `failed` state, surface this to the user and ask whether they want to continue and with how many additional diagnose visits (default: 3). If they confirm, call `reset_counters({ visits: N })` to restore the counter and resume.

    **`prompts/session-overview.md`** — Write this file **verbatim** — do not modify, summarize, or adapt the content:

   ````
   # Session Overview — Debug Session

   <!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

   You are executing a debug session. Read this node once, internalize it, then call `next_step()` immediately.

   ## What This Session Is

   A debug session is a hypothesis-driven investigation loop. The goal is to confirm the root cause and apply a targeted fix.

   - **diagnose** — inspect the codebase against the top hypothesis; write findings to `fix.md`; loop back if refuted, advance if confirmed
   - **fix** — apply the fix identified during diagnose; `fix.md` accumulates "tried X, result Y" history across iterations
   - **verify** — run tests; if all pass call `close_session()`; if any fail loop back to diagnose

   ## Self-Editing Authority

   The fix node (`fix.md`) is intentionally rewritten during the session. You have full authority to:
   - Overwrite `fix.md` with new findings and attempted fixes
   - Update `plan.json` if the investigation reveals the structure needs to change
   - Add a new diagnose iteration by calling `next_step({ next: "diagnose" })` from verify if tests fail

   **One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`.

   ## Advance

   Call `next_step()` to proceed to the diagnose node.
   ````

   ---

   **`prompts/diagnose.md`** — First line must be `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->`. Bake in the approved hypothesis list. Instruct the agent to: try the top hypothesis (targeted code inspection or test run), write findings to `fix.md`, then route to `fix` if confirmed or back to `diagnose` if refuted. Close with `## Advance`: "Call `next_step({ next: 'fix' })` when hypothesis is confirmed, or `next_step({ next: 'diagnose' })` to loop back."

   **`prompts/fix.md`** — First line must be `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->`. Start as a placeholder: "No fix identified yet." The agent will overwrite this file during diagnose iterations, accumulating "tried X, result Y" history. Close with `## Advance`: "Call `next_step()` when the fix is applied."

    **`prompts/verify.md`** — First line must be `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->`. Instruct the agent to run the full test suite and any regression checks. Close with `## Advance`: "If all pass: call `close_session()`. If any fail: call `next_step({ next: 'diagnose' })`."

4. **Commit**:
   ```
    git add .opencode/session-plans/{bug-name}/
    git commit -m "plan: add debug session {bug-name}"
    ```

5. **Present the plan** to the user:
    - Bug statement and acceptance criteria
    - Hypothesis list (ranked, as approved)
    - Session plan structure (diagnose → fix → verify loop, with {remaining_visits} diagnose visits as confirmed with you)
    - Next step: "Run '/activate-plan {bug-name}' when ready to begin."

## Constraints

- The `fix.md` file must start as a placeholder — it is intentionally empty at plan creation time.
- Do not call `next_step()` — this is a terminal node. Call `close_session()` after presenting the plan.
