# Node: finalize — /plan-debug

Your role in this node is to write the debug execution session plan to disk. The shape of the generated session depends on the user's answer in `confirm-mode`.

## Steps

1. **Apply delegation instructions** — Use the delegation recommendations from agent-routing to embed the appropriate delegation instructions in `diagnose.md`, `fix.md`, and (if applicable) `hypothesis-gate.md`.

2. **Confirm diagnose loop count with the user** — Ask: "How many diagnose iterations do you want for this session? (default: 3)" Use their response as `remaining_visits` on the `diagnose` node.

3. **Determine the session shape** from context (confirm-mode answer):

   **With confirmation (confirm-mode: yes):**
   - DAG: `session-overview → diagnose → hypothesis-gate (gate: ["fix","diagnose"]) → fix → verify → [loop back to diagnose or close]`
   - `diagnose` has `next: ["hypothesis-gate"]`
   - `verify` has `next: ["diagnose"]` with `remaining_visits` as confirmed, or omit `next` to make it terminal with a manual close

   **Without confirmation (confirm-mode: no):**
   - DAG: `session-overview → diagnose → fix → verify → [loop back to diagnose or close]`
   - `diagnose` has `next: ["fix"]`
   - `verify` has `next: ["diagnose"]` with `remaining_visits` as confirmed, or omit `next`

4. **Generate a session-specific `session-overview.md`** — Do NOT copy a static template. Generate it dynamically. It must include:
   - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
   - The bug description and acceptance criteria (from bug-intake)
   - The approved hypothesis (from hypothesis-form) — this is the execution starting point
   - The execution mode: confirmation on or off
   - The session structure (node-by-node for the chosen shape)
   - Self-editing authority: the agent may rewrite `fix.md` during the session; must not delete or rename the currently-executing node
   - `## Advance`: "Read this overview once, internalize it, then call `next_step()` immediately."

5. **Write session plan files** to `.opencode/session-plans/{bug-name}/`:

   **`plan.json`** — Use the schema from load-guidelines. Build the correct DAG for the chosen session shape (Step 3).

   **`prompts/session-overview.md`** — Generated in Step 4.

   **`prompts/diagnose.md`** — First line: `<!-- DO NOT COMPACT THIS NODE -->`. Bake in the approved hypothesis as the starting point. Instruct the agent to inspect the code path, write findings to `fix.md`, then advance or loop.

   **`prompts/hypothesis-gate.md`** (only if confirm-mode: yes) — First line: `<!-- DO NOT COMPACT THIS NODE -->`. Present the current diagnosis from `diagnose.md`. Ask the user: "Proceed with this fix?" — Yes advances to `fix`, No loops back to `diagnose`.

   **`prompts/fix.md`** — First line: `<!-- DO NOT COMPACT THIS NODE -->`. Starts as a placeholder: "No fix identified yet." The agent overwrites this file during iterations, accumulating "tried X, result Y" history.

   **`prompts/verify.md`** — First line: `<!-- DO NOT COMPACT THIS NODE -->`. Run the full test suite. If all pass: call `close_session()`. If any fail: call `next_step()` to loop back to diagnose.

6. **Commit**:
   ```
   git add .opencode/session-plans/{bug-name}/
   git commit -m "plan: add debug session {bug-name}"
   ```

7. **Present the plan** to the user:
   - Bug statement and acceptance criteria
   - The hypothesis
   - Session structure (chosen shape, diagnose visit count)
   - Next step: "Run '/activate-plan {bug-name}' when ready to begin."

## Constraints

- `fix.md` must start as a placeholder — it is intentionally empty at plan creation time.
- Do not call `next_step()` — this is a terminal node. Call `close_session()` after presenting the plan.
