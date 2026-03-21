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

   > **Critical:** The final node in the generated `plan.json` MUST NOT have a `next` field. Omit it entirely. If `next` is present on the terminal node, executing agents cannot call `close_session()` and the session will be stuck.

   **`prompts/session-overview.md`** — Generated in Step 4.

   **`prompts/diagnose.md`** — First line: `<!-- DO NOT COMPACT THIS NODE -->`. Bake in the approved hypothesis as the starting point. Must include strict loop node language:

   ```
   ## Constraints

   You are in a loop node. You have ONE action: inspect the code path, write your findings to `fix.md`, then call `next_step()` immediately. Do NOT summarize, analyze, propose multiple solutions, or take any other action. After calling `next_step()`, stop — the DAG determines whether to loop again or advance. You MUST NOT make that determination yourself.
   ```

   The prompt must instruct the agent to write targeted findings to `fix.md` — not to call `next_step()` themselves.

   **`prompts/hypothesis-gate.md`** (only if confirm-mode: yes) — First line: `<!-- DO NOT COMPACT THIS NODE -->`. Present the current diagnosis from `diagnose.md`. Ask the user: "Proceed with this fix?" — Yes advances to `fix`, No loops back to `diagnose`. Must use strict gate node language:

   ```
   ## Constraints

   Present the diagnosis to the user. Then stop and wait. Do NOT call `next_step()` until the user has provided an explicit approval or redirect response. Do NOT infer approval from silence or partial responses. When the user responds:
   - If **Yes**: Call `next_step({ next: "fix" })` exactly once. Stop.
   - If **No**: Call `next_step({ next: "diagnose" })` exactly once. Stop.
   ```

   **`prompts/fix.md`** — First line: `<!-- DO NOT COMPACT THIS NODE -->`. Starts as a placeholder: "No fix identified yet." The agent overwrites this file during iterations, accumulating "tried X, result Y" history. Must include:

   ```
   ## Constraints

   - You MUST NOT run tests, verification commands, or any check to confirm the fix works. That is `verify.md`'s job.
   - You MUST NOT call `next_step()` or `close_session()` directly. Let the workflow control progression.
   - You MUST write only to `fix.md` — describe what you changed and why.
   ```

   **`prompts/verify.md`** — First line: `<!-- DO NOT COMPACT THIS NODE -->`. Must use the strict verification pattern:

   ```
   ## Verification Steps

   Execute ONLY the following steps, in order, exactly once:

   1. [specific step 1 — e.g., "Run the test suite: `npm test`"]
   2. [specific step 2 — e.g., "Check the specific failing test output"]
   3. [specific step 3 — e.g., "Confirm error is resolved"]

   Do NOT run additional commands. Do NOT take any other action. Do NOT interpret results beyond the pass/fail criteria below.

   **If all steps pass:** Call `close_session()` exactly once. Stop.
   **If any step fails:** Call `next_step()` exactly once. Stop. Do NOT attempt to fix anything here — that is the diagnose node's job.
   ```

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
- You MUST NOT execute any fixes or run any verification commands during plan creation.
- You MUST NOT modify the DAG after `close_session()` is called.

## Advance

Call `close_session()` exactly once. Do this exactly once. Do NOT call `next_step()` — this is a terminal node. Do NOT read session files or DAG state. Do NOT take any other action before or after calling `close_session()`.
